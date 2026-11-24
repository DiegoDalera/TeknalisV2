// Vercel Function — corre en el servidor, nunca en el navegador.
// Necesita la variable de entorno ANTHROPIC_API_KEY configurada en Vercel
// (Project Settings → Environment Variables), no en este archivo.

// ---- Límites de abuso ------------------------------------------------------
const MAX_MENSAJES_ENTRADA = 24;   // cuántos mensajes aceptamos como máximo
const MAX_MENSAJES_CONTEXTO = 12;  // cuántos se envían a la API
const MAX_CHARS_MENSAJE = 500;     // largo máximo de cada mensaje
const VENTANA_MS = 60 * 1000;      // ventana del rate limit (1 minuto)
const MAX_POR_VENTANA = 8;         // pedidos por IP por ventana
const MAX_POR_HORA = 40;           // pedidos por IP por hora

// Rate limit en memoria. En Vercel cada instancia tiene su propio contador,
// así que es una barrera "best effort": frena el abuso casual. Para un límite
// estricto, usar Vercel Firewall (Rate Limiting) o Upstash Redis.
const registroPorIp = new Map();

function excedeRateLimit(ip) {
  const ahora = Date.now();
  const hits = (registroPorIp.get(ip) || []).filter((t) => ahora - t < 60 * 60 * 1000);
  hits.push(ahora);
  registroPorIp.set(ip, hits);

  // Evita que el Map crezca sin límite en instancias de larga vida.
  if (registroPorIp.size > 5000) {
    for (const [clave, tiempos] of registroPorIp) {
      if (!tiempos.some((t) => ahora - t < 60 * 60 * 1000)) registroPorIp.delete(clave);
    }
  }

  const enVentana = hits.filter((t) => ahora - t < VENTANA_MS).length;
  return enVentana > MAX_POR_VENTANA || hits.length > MAX_POR_HORA;
}

function ipDelCliente(req) {
  const xff = req.headers["x-forwarded-for"];
  if (typeof xff === "string" && xff.length > 0) return xff.split(",")[0].trim();
  return req.socket?.remoteAddress || "desconocida";
}

// Solo aceptamos pedidos que vengan del propio sitio (producción o previews).
// No frena a un script que falsifique el header, pero corta el uso desde
// otras páginas web y los usos casuales.
function origenPermitido(req) {
  const origen = req.headers.origin || req.headers.referer;
  if (!origen) return false;
  try {
    return new URL(origen).host === req.headers.host;
  } catch {
    return false;
  }
}

// Devuelve el historial limpio o null si el formato no es válido.
function sanearMensajes(messages) {
  if (!Array.isArray(messages) || messages.length === 0) return null;
  if (messages.length > MAX_MENSAJES_ENTRADA) return null;

  const limpios = [];
  for (const m of messages) {
    if (!m || typeof m !== "object") return null;
    if (m.role !== "user" && m.role !== "assistant") return null;
    if (typeof m.content !== "string") return null;
    const content = m.content.trim();
    if (content.length === 0 || content.length > MAX_CHARS_MENSAJE) return null;
    limpios.push({ role: m.role, content });
  }

  let recortado = limpios.slice(-MAX_MENSAJES_CONTEXTO);
  // La API exige que la conversación empiece con un mensaje del usuario.
  while (recortado.length > 0 && recortado[0].role !== "user") recortado.shift();
  // Y que termine con uno del usuario (es a quien tiene que responder).
  if (recortado.length === 0 || recortado[recortado.length - 1].role !== "user") return null;
  return recortado;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Método no permitido" });
  }

  if (!origenPermitido(req)) {
    return res.status(403).json({ error: "Origen no permitido." });
  }

  if (excedeRateLimit(ipDelCliente(req))) {
    res.setHeader("Retry-After", "60");
    return res.status(429).json({ error: "Demasiados mensajes. Probá de nuevo en un minuto." });
  }

  const historialAcotado = sanearMensajes(req.body?.messages);
  if (!historialAcotado) {
    return res.status(400).json({ error: "Mensajes inválidos." });
  }

  const SYSTEM_PROMPT = `Sos el asistente virtual de "Veterinaria San Roque", una veterinaria de barrio.
Respondé siempre en español rioplatense, tono cercano y profesional, en mensajes cortos (estilo WhatsApp, no más de 3-4 líneas).
Nunca uses formato markdown (nada de asteriscos para negrita, guiones para listas, ni almohadillas para títulos). Escribí como se escribe un WhatsApp real: texto plano, si necesitás separar ideas usá renglones o emojis simples, no símbolos de formato.

Información del negocio:
- Horarios: Lunes a viernes 9 a 19hs, sábados 9 a 13hs. Domingos cerrado.
- Servicios: consultas generales, vacunación, desparasitación, cirugías de rutina (castraciones), peluquería canina y felina.
- Vacunas: aplicamos el calendario completo (quíntuple, antirrábica, etc). Conviene traer la libreta sanitaria si la tienen.
- Turnos: se reservan por este mismo chat o llamando al 11 5555-0000. Para cirugías se pide una consulta previa.
- Urgencias fuera de horario: NO las resolvemos por acá. Si el mensaje describe una urgencia real (el animal está mal, un accidente, intoxicación, etc), respondé con calma indicando que derivás a atención humana inmediata y decí que alguien del equipo se va a contactar a la brevedad — no des diagnósticos ni indicaciones médicas.
- Precios: no des montos exactos, indicá que varían según el caso y que se confirman en la consulta.

Si te preguntan algo que no sabés o que no está en esta información, decilo con honestidad y ofrecé derivar a una persona del equipo. Nunca inventes información médica ni de precios.`;

  try {
    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 300,
        system: SYSTEM_PROMPT,
        messages: historialAcotado
      })
    });

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text();
      console.error("Error de Anthropic:", errText);
      return res.status(502).json({ error: "No pudimos conectar con el asistente." });
    }

    const data = await anthropicRes.json();
    const textoRespuesta = data.content?.find(b => b.type === "text")?.text || "Perdón, no pude procesar eso.";

    return res.status(200).json({ reply: textoRespuesta });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error interno." });
  }
}

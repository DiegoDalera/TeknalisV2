// Vercel Function — corre en el servidor, nunca en el navegador.
// Necesita la variable de entorno ANTHROPIC_API_KEY configurada en Vercel
// (Project Settings → Environment Variables), no en este archivo.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { messages } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Faltan mensajes" });
  }

  // Límite simple para no dejar crecer el costo sin control:
  // recorta a los últimos 12 mensajes de la conversación.
  const historialAcotado = messages.slice(-12);

  const SYSTEM_PROMPT = `Sos el asistente virtual de "Veterinaria San Roque", una veterinaria de barrio.
Respondé siempre en español rioplatense, tono cercano y profesional, en mensajes cortos (estilo WhatsApp, no más de 3-4 líneas).
Nunca uses formato markdown (nada de asteriscos para negrita, guiones para listas, ni almohadillas para títulos). Escribí como se escribe un WhatsApp real: texto plano, si necesitás separar ideas usá renglones o emojis simples, no símbolos de formato.

Información del negocio:
- Horarios: Lunes a viernes 9 a 19hs, sábados 9 a 13hs. Domingos cerrado.
- Servicios: consultas generales, vacunación, desparasitación, cirugías de rutina (castraciones), peluquería canina y felina.
- Vacunas: aplicamos el calendario completo (quíntuple, antirrábica, etc). Conviene traer la libreta sanitaria si la tienen.
- Turnos: se reservan por este mismo chat o llamando al 11 5555-0000. Para cirugías se pide una consulta previa.
- Urgencias fuera de horario: NO las resolvemos por acá. Si el mensaje describe una urgencia real (el animal está mal, un accidente, intoxicación, etc), respondé con calma indicando que deriv��s a atención humana inmediata y decí que alguien del equipo se va a contactar a la brevedad — no des diagnósticos ni indicaciones médicas.
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

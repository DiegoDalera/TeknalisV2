// Vercel Function — corre en el servidor.
// La dispara automáticamente el cron configurado en vercel.json (una vez
// por día). Hace una consulta mínima a Supabase para que el proyecto
// registre actividad y no se pause por inactividad — el plan free de
// Supabase pausa el proyecto a los 7 días sin uso, y esto lo evita.
//
// Usa la misma URL y anon key públicas que ya están en
// demos/agenda-turnos.html (la anon key es pública por diseño en
// Supabase; el acceso real lo controlan las políticas de RLS en cada
// tabla). No hace falta configurar ninguna variable de entorno nueva.

const SUPABASE_URL = "https://matglcfrlchzlzzoiqaq.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hdGdsY2ZybGNoemx6em9pcWFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYyNTI5OTQsImV4cCI6MjEwMTgyODk5NH0.2qrIlisSPkGbNsiACEt08NwqkjcqnQ-GTHinXAr2ODA";

export default async function handler(req, res) {
  try {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/negocios?select=id&limit=1`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`
        }
      }
    );

    if (!r.ok) {
      const errText = await r.text();
      console.error("Keep-alive: error de Supabase:", errText);
      return res.status(502).json({ ok: false, error: "No se pudo consultar Supabase." });
    }

    return res.status(200).json({ ok: true, checked_at: new Date().toISOString() });
  } catch (err) {
    console.error("Keep-alive: error interno:", err);
    return res.status(500).json({ ok: false, error: "Error interno." });
  }
}

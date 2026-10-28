import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { comment, score, intensity, target, kind } = await req.json();
    if (typeof comment !== "string" || comment.length > 4000) {
      return NextResponse.json({ error: "Comentario no válido." }, { status: 400 });
    }
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ summary: comment.trim(), keywords: [] });
    }
    const prompt = `Eres el analista de opiniones de Smart Lore. Analiza el comentario de un usuario sin cambiar su sentido, no inventes información y conserva matices. Devuelve SOLO JSON válido con "summary" (resumen fiel en español, máximo 45 palabras) y "keywords" (3 a 5 etiquetas cortas en español; si no hay suficientes ideas, devuelve solo las justificadas). No infieras datos sensibles ni identidades. Contexto: entorno=${kind}; destino=${String(target || "no especificado").slice(0,300)}; valoración=${score}/5; intensidad=${intensity}/3. Comentario: ${comment}`;
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json", temperature: 0.2 } })
    });
    if (!response.ok) throw new Error("Gemini no disponible");
    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    const parsed = JSON.parse(text);
    return NextResponse.json({
      summary: typeof parsed.summary === "string" ? parsed.summary.slice(0, 500) : comment.trim(),
      keywords: Array.isArray(parsed.keywords) ? parsed.keywords.filter((x: unknown) => typeof x === "string").slice(0, 5) : []
    });
  } catch {
    return NextResponse.json({ error: "No se pudo analizar el comentario." }, { status: 500 });
  }
}
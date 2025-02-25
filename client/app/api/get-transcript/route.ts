import { NextRequest, NextResponse } from "next/server";

// Función para extraer el ID del video desde un enlace de YouTube
function extractVideoId(url: string): string | null {
  const regex =
    /(?:youtube\.com\/(?:.*v=|.*\/|.*videos\/|.*embed\/|.*shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// ✅ Cambiamos "handler" por "GET" para cumplir con Next.js 15
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const videoUrl = searchParams.get("videoUrl");

    if (!videoUrl) {
      return NextResponse.json({ error: "Falta el enlace del video." }, { status: 400 });
    }

    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      return NextResponse.json({ error: "El enlace del video no es válido." }, { status: 400 });
    }

    const apiKey = process.env.YOUTUBE_API_KEY; // Asegúrate de que esta variable está en tu .env
    const url = `https://www.googleapis.com/youtube/v3/captions?videoId=${videoId}&part=snippet&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return NextResponse.json({ error: "No hay subtítulos disponibles para este video." }, { status: 404 });
    }

    // Extraer el ID de los subtítulos
    const captionId = data.items[0].id;
    return NextResponse.json({ captionId }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al obtener los subtítulos." }, { status: 500 });
  }
}

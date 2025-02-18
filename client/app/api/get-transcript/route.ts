import { NextApiRequest, NextApiResponse } from "next";

// Función para extraer el ID del video desde un enlace de YouTube
function extractVideoId(url: string): string | null {
  const regex =
    /(?:youtube\.com\/(?:.*v=|.*\/|.*videos\/|.*embed\/|.*shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { videoUrl } = req.query;

    if (!videoUrl || typeof videoUrl !== "string") {
      return res.status(400).json({ error: "Falta el enlace del video." });
    }

    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      return res
        .status(400)
        .json({ error: "El enlace del video no es válido." });
    }

    const apiKey = process.env.YOUTUBE_API_KEY; // Usa tu API Key de YouTube
    const url = `https://www.googleapis.com/youtube/v3/captions?videoId=${videoId}&part=snippet&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return res
        .status(404)
        .json({ error: "No hay subtítulos disponibles para este video." });
    }

    // Extraer el ID de los subtítulos
    const captionId = data.items[0].id;
    res.status(200).json({ captionId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los subtítulos." });
  }
}

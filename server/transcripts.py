from youtube_transcript_api import YouTubeTranscriptApi

def get_youtube_transcript(video_id):
    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        return transcript
    except Exception as e:
        print(f"Error al obtener el transcript: {e}")
        return None

# Ejemplo de uso con un ID de video de YouTube:
video_id = "dQw4w9WgXcQ"  # Reemplázalo con el ID del video que quieras
transcript = get_youtube_transcript(video_id)

if transcript:
    for line in transcript:
        print(f"{line['start']}: {line['text']}")

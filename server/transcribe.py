# services.py
import os
import yt_dlp
import tempfile
from openai import OpenAI
from dotenv import load_dotenv

# Cargar variables de entorno desde .env
load_dotenv()

# Crear cliente de OpenAI
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def download_audio(video_url):
    """Descarga el audio en un archivo temporal y lo convierte a MP3."""
    try:
        temp_audio = tempfile.NamedTemporaryFile(delete=False, suffix=".mp3")
        audio_path = temp_audio.name  # Ruta del archivo temporal
        temp_audio.close()  # Cerrar el archivo para que yt-dlp pueda escribir en él

        ydl_opts = {
            'format': 'bestaudio[ext=m4a]/bestaudio/best',  # Prioriza M4A, compatible con Whisper
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',  # Conversión a MP3
                'preferredquality': '64',
            }],
            'ffmpeg_location': r'C:\ffmpeg-2025-02-13-git-19a2d26177-full_build\bin\ffmpeg.exe',
            'outtmpl': f"{audio_path}.%(ext)s"
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([video_url])

        return f"{audio_path}.mp3"  # Retorna el nombre del archivo final convertido

    except Exception as e:
        print(f"Error en la descarga del audio: {e}")
        return None

def transcribe_audio(audio_path):
    """Utiliza OpenAI Whisper API para transcribir el audio."""
    try:
        with open(audio_path, "rb") as audio_file:
            transcription = client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                response_format="text"
            )

        print("Respuesta de OpenAI:", transcription)
        return transcription if isinstance(transcription, str) else transcription.text

    except Exception as e:
        print(f"Error en la transcripción del audio: {e}")
        return None

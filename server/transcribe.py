import os
import yt_dlp
import tempfile
from openai import OpenAI
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# Buscar ffmpeg en diferentes ubicaciones
FFMPEG_PATH = os.getenv("FFMPEG_PATH", "/usr/bin/ffmpeg")

if not os.path.exists(FFMPEG_PATH):
    FFMPEG_PATH = "/usr/local/bin/ffmpeg"
if not os.path.exists(FFMPEG_PATH):
    FFMPEG_PATH = "/bin/ffmpeg"
if not os.path.exists(FFMPEG_PATH):
    FFMPEG_PATH = "/opt/homebrew/bin/ffmpeg"

if os.path.exists(FFMPEG_PATH):
    print(f"✅ ffmpeg encontrado en {FFMPEG_PATH}")
else:
    print("❌ ffmpeg NO encontrado. Verifica su instalación en Railway.")

# Crear cliente de OpenAI
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def download_audio(video_url):
    """Descarga el audio en un archivo temporal y lo convierte a MP3."""
    try:
        temp_audio = tempfile.NamedTemporaryFile(delete=False, suffix=".mp3")
        audio_path = temp_audio.name
        temp_audio.close()

        ydl_opts = {
            'format': 'bestaudio/best',
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '64',
            }],
            # USAR EN DESARROLLO
            # 'ffmpeg_location': r'C:\ffmpeg-2025-02-13-git-19a2d26177-full_build\bin\ffmpeg.exe',
            #---------------------------------------------------------------------
            # USAR EN PRODUCCIÓN
            'ffmpeg_location': FFMPEG_PATH,
            'noplaylist': True,
            'outtmpl': f"{audio_path}.%(ext)s"
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([video_url])

        return f"{audio_path}.mp3"

    except Exception as e:
        print(f"Error en la descarga del audio: {e}")
        return None

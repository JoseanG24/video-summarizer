import os
import yt_dlp
from openai import OpenAI
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import tempfile

# Cargar variables de entorno desde .env
load_dotenv()

# Crear cliente de OpenAI
client = OpenAI()

# Configurar Flask
app = Flask(__name__)
CORS(app)

def download_audio(video_url):
    """ Descarga el audio en un archivo temporal y lo convierte a MP3 """
    try:
        temp_audio = tempfile.NamedTemporaryFile(delete=False, suffix=".mp3")
        audio_path = temp_audio.name  # Ruta del archivo temporal
        temp_audio.close()  # Cerrar el archivo para que yt-dlp pueda escribir en él

        ydl_opts = {
            'format': 'bestaudio[ext=m4a]/bestaudio/best',  # Prioriza M4A, compatible con Whisper
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',  # Asegura conversión a MP3
                'preferredquality': '192',
            }],
            # 'ffmpeg_location': r'C:\ffmpeg-2025-02-13-git-19a2d26177-full_build\bin\ffmpeg.exe',
            'outtmpl': f"{audio_path}.%(ext)s"  # Asegura que yt-dlp maneje bien el nombre del archivo
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([video_url])

        return f"{audio_path}.mp3"  # Retorna el nombre del archivo final convertido

    except Exception as e:
        print(f"Error en la descarga del audio: {e}")
        return None

def transcribe_audio(audio_path):
    """ Usa OpenAI Whisper API para transcribir el audio """
    try:
        with open(audio_path, "rb") as audio_file:
            transcription = client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                response_format="text"
            )

        return transcription.text

    except Exception as e:
        print(f"Error en la transcripción del audio: {e}")
        return None

@app.route("/api/summarize", methods=["POST"])
def summarize_video():
    """ Recibe un enlace de YouTube, descarga el audio, lo transcribe y lo elimina """
    try:
        data = request.get_json()
        video_url = data.get("videoUrl")

        if not video_url:
            return jsonify({"error": "Falta el enlace del video"}), 400

        # Descargar el audio en un archivo temporal
        audio_path = download_audio(video_url)
        if not audio_path:
            return jsonify({"error": "Error al descargar el audio"}), 500

        # Transcribir el audio con OpenAI Whisper API
        transcription = transcribe_audio(audio_path)

        # Eliminar el archivo temporal inmediatamente después de la transcripción
        os.remove(audio_path)

        if not transcription:
            return jsonify({"error": "Error al transcribir el audio"}), 500

        return jsonify({
            "videoUrl": video_url,
            "transcription": transcription
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=8080)

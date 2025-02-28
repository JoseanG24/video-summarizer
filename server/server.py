import os
from flask import Flask, jsonify, request
from flask_cors import CORS
import transcribe
import requests
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound
from urllib.parse import urlparse, parse_qs
import subprocess

FFMPEG_PATH = os.getenv("FFMPEG_PATH", "/usr/bin/ffmpeg")

try:
    subprocess.run([FFMPEG_PATH, "-version"], check=True)
    print("✅ FFmpeg está instalado correctamente")
except FileNotFoundError:
    print("❌ FFmpeg no está instalado. Intenta instalarlo en Railway")

app = Flask(__name__)
CORS(app)

def extract_video_id(url):
    try:
        parsed_url = urlparse(url)
        if parsed_url.hostname in ["www.youtube.com", "youtube.com"]:
            return parse_qs(parsed_url.query).get("v", [None])[0]
        elif parsed_url.hostname in ["youtu.be"]:
            return parsed_url.path.lstrip("/")
        return None
    except Exception:
        return None

def get_youtube_transcript(video_id):
    try:
        transcript_data = YouTubeTranscriptApi.get_transcript(video_id)
        return " ".join([entry["text"] for entry in transcript_data])
    except (TranscriptsDisabled, NoTranscriptFound):
        return None
    except Exception as e:
        print(f"Error inesperado en get_youtube_transcript: {e}")
        return None
    
#route
@app.route("/api/summarize", methods=["POST"])
def summarize_video():
    try:
        data = request.get_json()
        video_url = data.get("videoUrl")

        if not video_url:
            return jsonify({"error": "Falta el enlace del video"}), 400

        video_id = extract_video_id(video_url)
        if not video_id:
            return jsonify({"error": "URL de video inválida"}), 400

        transcript = get_youtube_transcript(video_id)
        if transcript:
            return jsonify({"videoUrl": video_url, "transcription": transcript, "source": "YouTube Automatic Transcript"})

        video_status = requests.get(f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={video_id}")
        if video_status.status_code != 200:
            return jsonify({"error": "El video es privado o ha sido eliminado"}), 400

        audio_path = transcribe.download_audio(video_url)
        if not audio_path:
            return jsonify({"error": "Error al descargar el audio"}), 500

        transcription = transcribe.transcribe_audio(audio_path)
        os.remove(audio_path)

        if not transcription:
            return jsonify({"error": "Error al transcribir el audio"}), 500

        return jsonify({"videoUrl": video_url, "transcription": transcription, "source": "Manual Audio Transcription"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))

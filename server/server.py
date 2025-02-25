# app.py
import os
from flask import Flask, jsonify, request
from flask_cors import CORS
import transcribe  # Importamos las funciones definidas en services.py

# Configurar Flask
app = Flask(__name__)
CORS(app)

@app.route("/api/summarize", methods=["POST"])
def summarize_video():
    """Recibe un enlace de YouTube, descarga el audio, lo transcribe y lo elimina."""
    try:
        data = request.get_json()
        video_url = data.get("videoUrl")

        if not video_url:
            return jsonify({"error": "Falta el enlace del video"}), 400

        # Descargar el audio utilizando la función del módulo de servicios
        audio_path = transcribe.download_audio(video_url)
        if not audio_path:
            return jsonify({"error": "Error al descargar el audio"}), 500

        # Transcribir el audio utilizando la función del módulo de servicios
        transcription = transcribe.transcribe_audio(audio_path)

        # Eliminar el archivo temporal después de la transcripción
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
    port = int(os.environ.get("PORT", 8080))
    app.run(debug=True, host="0.0.0.0", port=port)

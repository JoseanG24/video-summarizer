#!/bin/bash
echo "🔧 Instalando FFmpeg en Railway..."
apt-get update && apt-get install -y ffmpeg
echo "✅ FFmpeg instalado correctamente"

# Iniciar la aplicación
python server.py
    
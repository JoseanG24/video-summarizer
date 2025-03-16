#!/bin/bash
echo "🔧 Instalando FFmpeg en Railway..."
apt-get update && apt-get install -y ffmpeg
echo "✅ FFmpeg instalado correctamente"

# Verificar la instalación de ffmpeg
which ffmpeg
ffmpeg -version

# Iniciar la aplicación
python server.py

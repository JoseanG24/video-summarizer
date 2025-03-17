#!/bin/bash

echo "🔧 Instalando FFmpeg y ffprobe en Railway..."
apt-get update && apt-get install -y ffmpeg libavcodec-extra

echo "✅ Instalación completada."

# Verificar si ffmpeg y ffprobe están correctamente instalados
echo "🔍 Verificando instalación de FFmpeg y ffprobe..."
which ffmpeg
which ffprobe
ls -l /usr/bin/ffmpeg
ls -l /usr/bin/ffprobe
ffmpeg -version

echo "🚀 Iniciando el servidor..."
python server.py

#!/bin/bash

echo "🔧 Instalando FFmpeg y ffprobe en Railway..."
apt-get update && apt-get install -y ffmpeg libavcodec-extra

echo "✅ Instalación completada."

# Mostrar ruta de ffmpeg
echo "🔍 Verificando instalación de FFmpeg y ffprobe..."
which ffmpeg || echo "❌ ffmpeg no encontrado"
which ffprobe || echo "❌ ffprobe no encontrado"
ls -l /usr/bin/ffmpeg || echo "❌ /usr/bin/ffmpeg no existe"
ls -l /usr/bin/ffprobe || echo "❌ /usr/bin/ffprobe no existe"

# Intentar ejecutar ffmpeg antes de iniciar el servidor
echo "🔍 Ejecutando ffmpeg para verificar que funciona..."
ffmpeg -hide_banner -loglevel panic -version || echo "❌ ffmpeg no se pudo ejecutar"

echo "🚀 Iniciando el servidor..."
python server.py

#!/bin/bash

echo "🔧 Instalando FFmpeg y ffprobe en Railway..."
apt-get update && apt-get install -y ffmpeg libavcodec-extra

echo "✅ Instalación completada."

# Verificar si ffmpeg y ffprobe están instalados
echo "🔍 Verificando instalación de FFmpeg y ffprobe..."
FFMPEG_PATH=$(which ffmpeg)
FFPROBE_PATH=$(which ffprobe)

if [ -x "$FFMPEG_PATH" ]; then
    echo "✅ FFmpeg encontrado en: $FFMPEG_PATH"
else
    echo "❌ FFmpeg NO encontrado. Verifica la instalación en Railway."
fi

if [ -x "$FFPROBE_PATH" ]; then
    echo "✅ FFprobe encontrado en: $FFPROBE_PATH"
else
    echo "❌ FFprobe NO encontrado. Verifica la instalación en Railway."
fi

# Exportar rutas para que yt-dlp las use
export FFMPEG_PATH="$FFMPEG_PATH"
export FFPROBE_PATH="$FFPROBE_PATH"

# Intentar ejecutar ffmpeg antes de iniciar el servidor
echo "🔍 Ejecutando ffmpeg para verificar que funciona..."
ffmpeg -version || echo "❌ No se puede ejecutar ffmpeg"

echo "🚀 Iniciando el servidor..."
python server.py

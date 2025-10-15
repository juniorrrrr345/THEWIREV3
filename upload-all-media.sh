#!/bin/bash

# Script pour télécharger et uploader tous les médias
cd /workspace/THEWIREV3/media

# Liste des médias à copier
declare -a media_files=(
    "1759709671151-pjmcxshdqna.jpeg"
    "1759710638809-xec8pq3mpb.mp4"
    "1759709771797-s7um3x2yoi.jpeg"
    "1759710627295-303rnd12wnv.mp4"
    "1759712756822-8qbxokur0gl.jpeg"
    "1759712769683-sg24iyc9hv.mp4"
    "1759801159055-45h6uffqh7k.jpeg"
    "1759802656925-m592dhwj29h.mp4"
    "1759804819733-sq2z0n60q2.png"
    "1759804760487-i8nj8lpdvh.mp4"
)

# URL de base de l'ancien bucket
OLD_BASE_URL="https://pub-b38679a01a274648827751df94818418.r2.dev/images"

echo "🚀 Début du téléchargement et upload des médias..."

for file in "${media_files[@]}"; do
    echo "📥 Téléchargement de $file..."
    curl -s -o "$file" "$OLD_BASE_URL/$file"
    
    if [ $? -eq 0 ]; then
        echo "📤 Upload de $file vers R2..."
        wrangler r2 object put "thewirev3-media/images/$file" --file="$file" --remote
        
        if [ $? -eq 0 ]; then
            echo "✅ $file uploadé avec succès"
        else
            echo "❌ Erreur upload $file"
        fi
    else
        echo "❌ Erreur téléchargement $file"
    fi
    
    echo "---"
done

echo "🎉 Terminé !"
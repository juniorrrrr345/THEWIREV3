// Script pour copier les médias de l'ancien bucket vers le nouveau
const fs = require('fs');

// Liste des URLs à copier
const mediaUrls = [
  'https://pub-b38679a01a274648827751df94818418.r2.dev/images/1759708758469-fa2hqugapxb.jpeg',
  'https://pub-b38679a01a274648827751df94818418.r2.dev/images/1759803479309-mg00g6ik7b.mp4',
  'https://pub-b38679a01a274648827751df94818418.r2.dev/images/1759709671151-pjmcxshdqna.jpeg',
  'https://pub-b38679a01a274648827751df94818418.r2.dev/images/1759710638809-xec8pq3mpb.mp4',
  'https://pub-b38679a01a274648827751df94818418.r2.dev/images/1759709771797-s7um3x2yoi.jpeg',
  'https://pub-b38679a01a274648827751df94818418.r2.dev/images/1759710627295-303rnd12wnv.mp4',
  'https://pub-b38679a01a274648827751df94818418.r2.dev/images/1759712756822-8qbxokur0gl.jpeg',
  'https://pub-b38679a01a274648827751df94818418.r2.dev/images/1759712769683-sg24iyc9hv.mp4',
  'https://pub-b38679a01a274648827751df94818418.r2.dev/images/1759801159055-45h6uffqh7k.jpeg',
  'https://pub-b38679a01a274648827751df94818418.r2.dev/images/1759802656925-m592dhwj29h.mp4',
  'https://pub-b38679a01a274648827751df94818418.r2.dev/images/1759804819733-sq2z0n60q2.png',
  'https://pub-b38679a01a274648827751df94818418.r2.dev/images/1759804760487-i8nj8lpdvh.mp4'
];

// Fonction pour télécharger et uploader un fichier
async function copyMedia(url) {
  try {
    console.log(`Téléchargement de ${url}...`);
    
    // Télécharger le fichier
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Extraire le nom du fichier
    const filename = url.split('/').pop();
    
    // Créer FormData pour l'upload
    const FormData = require('form-data');
    const form = new FormData();
    form.append('file', buffer, {
      filename: filename,
      contentType: filename.endsWith('.mp4') ? 'video/mp4' : 
                   filename.endsWith('.png') ? 'image/png' : 'image/jpeg'
    });
    
    // Uploader vers le nouveau bucket via l'API du Worker
    const uploadResponse = await fetch('https://thewirev3.calitek-junior.workers.dev/api/upload', {
      method: 'POST',
      body: form,
      headers: form.getHeaders()
    });
    
    if (uploadResponse.ok) {
      const result = await uploadResponse.json();
      console.log(`✅ ${filename} copié vers: ${result.url}`);
      return result.url;
    } else {
      console.error(`❌ Erreur upload ${filename}:`, await uploadResponse.text());
      return null;
    }
  } catch (error) {
    console.error(`❌ Erreur pour ${url}:`, error.message);
    return null;
  }
}

// Fonction principale
async function main() {
  console.log('🚀 Début de la copie des médias...');
  
  const newUrls = [];
  
  for (const url of mediaUrls) {
    const newUrl = await copyMedia(url);
    if (newUrl) {
      newUrls.push({
        old: url,
        new: newUrl
      });
    }
    
    // Pause entre les uploads
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n📋 Résumé:');
  console.log(`✅ ${newUrls.length} fichiers copiés avec succès`);
  console.log(`❌ ${mediaUrls.length - newUrls.length} fichiers échoués`);
  
  // Sauvegarder le mapping
  fs.writeFileSync('media-mapping.json', JSON.stringify(newUrls, null, 2));
  console.log('\n💾 Mapping sauvegardé dans media-mapping.json');
}

main().catch(console.error);
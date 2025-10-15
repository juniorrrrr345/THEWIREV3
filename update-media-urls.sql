-- Mettre à jour les URLs des médias vers le nouveau bucket R2
UPDATE products SET 
  photo = REPLACE(photo, 'https://pub-b38679a01a274648827751df94818418.r2.dev', 'https://pub-709c95af63174b2184f80637e65ac26e.r2.dev'),
  video = REPLACE(video, 'https://pub-b38679a01a274648827751df94818418.r2.dev', 'https://pub-709c95af63174b2184f80637e65ac26e.r2.dev')
WHERE photo LIKE '%pub-b38679a01a274648827751df94818418.r2.dev%' 
   OR video LIKE '%pub-b38679a01a274648827751df94818418.r2.dev%';
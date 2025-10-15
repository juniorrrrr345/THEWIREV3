# Configuration THEWIREV3

## Étapes de configuration

### 1. Créer la base de données D1
```bash
wrangler d1 create thewirev3-db
```
Notez le `database_id` retourné et remplacez `PLACEHOLDER_DATABASE_ID` dans `wrangler.toml`

### 2. Créer le bucket R2
```bash
wrangler r2 bucket create thewirev3-media
wrangler r2 bucket dev-url enable thewirev3-media
```
Notez l'URL retournée et remplacez `PLACEHOLDER_NEW_URL` dans `worker/index.js`

### 3. Mettre à jour wrangler.toml
Remplacer `PLACEHOLDER_DATABASE_ID` par l'ID de la base de données créée

### 4. Mettre à jour worker/index.js
Remplacer `PLACEHOLDER_NEW_URL` par l'URL R2 créée

### 5. Exécuter le schéma de base de données
```bash
wrangler d1 execute thewirev3-db --file=./worker/schema.sql --remote
```

### 6. Configurer les secrets
```bash
wrangler secret put DEFAULT_ADMIN_USERNAME
# Entrer: admin

wrangler secret put DEFAULT_ADMIN_PASSWORD
# Entrer: MotDePasseFort123!
```

### 7. Déployer le Worker
```bash
wrangler deploy
```

### 8. Initialiser la base de données
```bash
curl https://thewirev3.VOTRE-USERNAME.workers.dev/api/init
```

### 9. Importer les données de base
```bash
wrangler d1 execute thewirev3-db --file=./farms.sql --remote
wrangler d1 execute thewirev3-db --file=./categories.sql --remote
```

### 10. Pousser sur GitHub
```bash
git add .
git commit -m "Configure THEWIREV3"
git push origin main
```

### 11. Déployer sur Vercel
- Connecter le repo sur Vercel
- Ajouter la variable d'environnement:
  - Name: VITE_API_URL
  - Value: https://thewirev3.VOTRE-USERNAME.workers.dev
- Redéployer

## URLs de test
- Admin: https://VOTRE-BOUTIQUE.vercel.app/admin/login
- Storefront: https://VOTRE-BOUTIQUE.vercel.app
- Username: admin
- Password: MotDePasseFort123!
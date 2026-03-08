const fs = require('fs');
const path = require('path');

// Créer le dossier de sortie
const outputDir = 'dist';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Fonction pour copier récursivement
function copyDirSync(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const files = fs.readdirSync(src);
  files.forEach(file => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    
    if (fs.statSync(srcPath).isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

// Copier tous les fichiers de site/ vers dist/
console.log('📦 Copie des fichiers site/ vers dist/...');
copyDirSync('site', outputDir);

// Copier aussi les fichiers CSS globaux si nécessaire
if (fs.existsSync('assets')) {
  console.log('📦 Copie des assets globaux...');
  copyDirSync('assets', path.join(outputDir, 'assets'));
}

console.log('✅ Build complété ! Fichiers prêts pour Vercel.');

# 🛍️ Ricky_shop — E-commerce Product Catalog

Plateforme e-commerce moderne avec **8 produits enrichis**, panier fonctionnel, et intégration WhatsApp directe pour les commandes.

## 📋 Produits

1. **CalmCarry®** — Appareil bien-être acupression (anti-anxiété, sommeil)
2. **CABIN CARE by Ottocast** — CarPlay sans fil + surveillance arrière
3. **Air Nova Smart Mouse** — Souris sans fil dual-mode avec laser
4. **All-in-One Universal Travel Adapter** — Universel 150+ pays
5. **Wifi Porter** — Partage Wi-Fi NFC sans batterie
6. **P50 Tactical Torch** — Lampe torche LED ultra puissante
7. **LANTHOME™ Blanchisseur Dentaire** — Kit blanchiment des dents
8. **Tondeuse Professionnelle 4-en-1** — Grooming multi-fonction

## 🚀 Déploiement

### Sur Vercel (Recommandé)

```bash
# 1. Cloner le repo
git clone https://github.com/Richogata/Ricky_shop.git
cd Ricky_shop

# 2. Déployer sur Vercel
npx vercel@latest
```

Le script de build v'a :
- Copier les fichiers de `site/` vers un dossier `dist/`
- Vercel servira ce dossier automatiquement
- Les routes seront gérées correctement

### En Local

```bash
# Démarrer un serveur local
npm run dev

# Accéder à http://localhost:3000
```

## 📁 Structure du Projet

```
Ricky_shop/
├── site/
│   ├── index.html          # Page d'accueil
│   ├── catalogue.html      # Catalogue complet
│   ├── panier.html         # Panier d'achat
│   ├── vente.html          # Page produit détaillée
│   └── assets/
│       ├── site.css        # Styles (lisibilité optimisée)
│       ├── data.js         # 8 produits enrichis
│       └── app.js          # Logique JavaScript
├── products.csv            # Export Shopify
├── vercel.json             # Config Vercel
├── build.js                # Script de build
├── package.json
├── .vercelignore
└── .gitignore
```

## ✨ Fonctionnalités

- ✅ **Catalogue dynamique** — 8 produits avec descriptions complètes
- ✅ **Panier fonctionnel** — Ajouter/retirer/gérer quantité
- ✅ **Intégration WhatsApp** — Commander directement par WhatsApp
- ✅ **Responsive Design** — Optimisé mobile et desktop
- ✅ **Images améliorées** — Haute résolution avec fallback
- ✅ **Typographie lisible** — Texte spacieux et clair
- ✅ **Compatibilité détaillée** — Infos système pour chaque produit

## 🎨 Personnalisation

### Modifier le numéro WhatsApp
Éditer `site/assets/data.js` :
```javascript
window.STORE = {
  name: "Ricky_shop",
  whatsappNumber: "YOUR_NUMBER_HERE",  // Format: 228XXXXXXXX
  whatsappDisplay: "+228 XX XX XX XX"
};
```

### Ajouter un nouveau produit
Ajouter un objet dans l'array `window.PRODUCTS[]` avec la structure :
```javascript
{
  id: "produit-unique",
  name: "Nom Produit",
  brand: "Marque",
  category: "Catégorie",
  priceText: "Prix affichage",
  oldPriceText: "Prix barré",
  description: "Description longue",
  details: [/* array de points clés */],
  images: [/* array URLs */],
  // ... autres propriétés
}
```

## 🔧 Technologies

- **HTML5** — Structure sémantique
- **CSS3** — Design moderne et responsive
- **JavaScript Vanilla** — Zéro dépendance frontend
- **Node.js** — Script de build
- **Vercel** — Déploiement statique

## 📄 License

MIT © 2026 Richogata

## 📞 Support

Commandes via WhatsApp : **+228 98 48 99 84**

---

**Déployé sur :** https://ricky-shop.vercel.app (quand connecté à Vercel)

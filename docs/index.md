# Resend Full MCP - Documentation

Bienvenue dans la documentation complète du serveur **Resend Full MCP** et du **Skill Resend-Expert**.

## 🚀 Qu'est-ce que Resend Full MCP ?

Resend Full MCP est un serveur **Model Context Protocol (MCP)** qui offre une couverture 100% de l'**API Resend**. Il permet aux assistants IA et aux applications LLM de gérer toute la puissante infrastructure de messagerie de Resend.

### ✨ Caractéristiques principales

- **70+ outils MCP** couvrant 12 modules complets de l'API Resend
- **Skill Resend-Expert** avec 1644 lignes de bonnes pratiques et exemples
- **Intégration native** avec Claude Desktop, Cursor, Windsurf, Continue, Cline
- **Sécurité renforcée** avec validation, rate limiting, et gestion d'erreurs
- **Installation simplifiée** via npm ou Python

## 📚 Documentation

### 🎯 Pour commencer

<div class="grid cards" markdown>

-   :material-rocket-launch:{ .lg .middle } **Démarrage Rapide**

    ---

    Installation et configuration en quelques minutes

    [:octicons-arrow-right-24: Commencer](Démarrage%20Rapide.md)

-   :material-book-open-variant:{ .lg .middle } **Introduction et Aperçu**

    ---

    Comprendre l'architecture et les fonctionnalités

    [:octicons-arrow-right-24: En savoir plus](Introduction%20et%20Aperçu.md)

-   :material-cog:{ .lg .middle } **Configuration des Clients MCP**

    ---

    Configurer Claude Desktop, Cursor, Windsurf, etc.

    [:octicons-arrow-right-24: Configurer](Configuration%20des%20Clients%20MCP.md)

-   :material-star:{ .lg .middle } **Skill Resend-Expert**

    ---

    Guide complet avec patterns et bonnes pratiques

    [:octicons-arrow-right-24: Découvrir](Skill%20Resend-Expert.md)

</div>

### 🏗️ Architecture et Modules

<div class="grid cards" markdown>

-   :material-sitemap:{ .lg .middle } **Architecture Technique**

    ---

    Comprendre le fonctionnement interne du serveur MCP

    [:octicons-arrow-right-24: Consulter](Architecture%20Technique.md)

-   :material-email:{ .lg .middle } **Module Emails**

    ---

    Envoi, batch, scheduled, pièces jointes

    [:octicons-arrow-right-24: Explorer](Fonctionnalités%20et%20Modules/Module%20Emails/Module%20Emails.md)

-   :material-domain:{ .lg .middle } **Module Domaines**

    ---

    Configuration DNS, SPF, DKIM, DMARC

    [:octicons-arrow-right-24: Explorer](Fonctionnalités%20et%20Modules/Module%20Domaines/Module%20Domaines.md)

-   :material-webhook:{ .lg .middle } **Module Webhooks**

    ---

    Notifications en temps réel des événements email

    [:octicons-arrow-right-24: Explorer](Fonctionnalités%20et%20Modules/Module%20Webhooks/Module%20Webhooks.md)

-   :material-account-group:{ .lg .middle } **Module Audiences**

    ---

    Gestion des listes de diffusion et contacts

    [:octicons-arrow-right-24: Explorer](Fonctionnalités%20et%20Modules/Module%20Audiences/Module%20Audiences.md)

-   :material-bullhorn:{ .lg .middle } **Module Broadcasts**

    ---

    Campagnes marketing et newsletters

    [:octicons-arrow-right-24: Explorer](Fonctionnalités%20et%20Modules/Module%20Broadcasts/Module%20Broadcasts.md)

</div>

## 📦 12 Modules complets

Le serveur MCP expose tous les endpoints de l'API Resend :

| Module | Outils | Description |
|--------|--------|-------------|
| 📧 **Emails** | 8 | Envoi transactionnel, batch, scheduled |
| 📨 **Emails Reçus** | 4 | Gestion des emails entrants |
| 🌐 **Domaines** | 6 | Configuration et vérification DNS |
| 🔑 **Clés API** | 3 | Gestion des accès API |
| 👥 **Audiences** | 4 | Listes de diffusion |
| 📇 **Contacts** | 13 | Gestion complète des contacts |
| 📝 **Templates** | 7 | Templates email réutilisables |
| 📢 **Broadcasts** | 6 | Campagnes marketing |
| 🪝 **Webhooks** | 5 | Événements en temps réel |
| 🎯 **Segments** | 4 | Segmentation d'audiences |
| 🏷️ **Topics** | 5 | Sujets d'abonnement |
| 🔧 **Propriétés de Contact** | 5 | Champs personnalisés |

**Total : 70+ outils MCP**

## 🎓 Skill Resend-Expert

Le **Skill Resend-Expert** est automatiquement installé avec le serveur MCP. Il contient :

- ✅ **Patterns d'architecture** pour web, mobile et backend
- ✅ **React Email** templates avec bonnes pratiques
- ✅ **Webhooks** avec vérification de signature
- ✅ **Intégrations framework** (Next.js, Express, NestJS, React Native)
- ✅ **Bonnes pratiques** de sécurité, délivrabilité, performance
- ✅ **1644 lignes** d'exemples et recommandations

[:octicons-arrow-right-24: Découvrir le Skill Resend-Expert](Skill%20Resend-Expert.md)

## 🚀 Installation rapide

=== "NPM"

    ```bash
    # Installation globale
    npm install -g @qrcommunication/resend-full-mcp

    # Ou utilisation directe
    npx @qrcommunication/resend-full-mcp
    ```

=== "Python"

    ```bash
    # Installation depuis PyPI
    pip install resend-full-mcp

    # Lancement du serveur
    resend-mcp
    ```

=== "Source"

    ```bash
    # Cloner le dépôt
    git clone https://github.com/QrCommunication/resend-full-mcp.git
    cd resend-full-mcp

    # Installer et compiler
    npm install
    npm run build

    # Démarrer le serveur
    npm start
    ```

## 🔧 Configuration minimale

1. Créez un fichier `.env` :

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
```

2. Configurez votre client MCP (Claude Desktop, Cursor, etc.)

[:octicons-arrow-right-24: Guide complet de configuration](Configuration%20des%20Clients%20MCP.md)

## 📖 Navigation de la documentation

### Pour les développeurs

- [Démarrage Rapide](Démarrage%20Rapide.md) - Installation et premiers pas
- [Architecture Technique](Architecture%20Technique.md) - Fonctionnement interne
- [Développement et Tests](Développement%20et%20Tests.md) - Contribuer au projet

### Pour l'intégration

- [Skill Resend-Expert](Skill%20Resend-Expert.md) - Guide complet d'implémentation
- [Protocole MCP et Interface](Protocole%20MCP%20et%20Interface.md) - Communication MCP
- [Référence API](Référence%20API/Référence%20API.md) - Documentation complète des endpoints

### Pour la production

- [Sécurité et Gestion des Erreurs](Sécurité%20et%20Gestion%20des%20Erreurs.md) - Bonnes pratiques
- [Déploiement et Maintenance](Déploiement%20et%20Maintenance.md) - Mise en production
- [Dépannage et FAQ](Dépannage%20et%20FAQ.md) - Solutions aux problèmes courants

## 🤝 Contribution

Ce projet est open source. Les contributions sont les bienvenues !

- [:fontawesome-brands-github: GitHub](https://github.com/QrCommunication/resend-full-mcp)
- [:fontawesome-solid-bug: Issues](https://github.com/QrCommunication/resend-full-mcp/issues)
- [:fontawesome-solid-comments: Discussions](https://github.com/QrCommunication/resend-full-mcp/discussions)

## 📄 Licence

MIT License - Copyright © 2026 Qr Communication

---

**Prêt à commencer ?** [:octicons-arrow-right-24: Suivez le guide de démarrage rapide](Démarrage%20Rapide.md)

# Configuration des Clients MCP

<cite>
**Fichiers référencés dans ce document**
- [README.md](file://README.md)
- [package.json](file://package.json)
- [src/index.ts](file://src/index.ts)
- [.env.example](file://.env.example)
</cite>

## Sommaire
1. [Introduction](#introduction)
2. [Prérequis et installation](#prérequis-et-installation)
3. [Configuration de base](#configuration-de-base)
4. [Configuration des clients MCP](#configuration-des-clients-mcp)
5. [Paramètres d'environnement](#paramètres-denvironnement)
6. [Différences entre les clients](#différences-entre-les-clients)
7. [Exemples de configuration complets](#exemples-de-configuration-complets)
8. [Optimisations de performance](#optimisations-de-performance)
9. [Gestion des erreurs](#gestion-des-erreurs)
10. [Sécurité et bonnes pratiques](#sécurité-et-bonnes-pratiques)
11. [Dépannage](#dépannage)
12. [Conclusion](#conclusion)

## Introduction

Le serveur MCP Resend Full est une implémentation complète du protocole Model Context Protocol (MCP) qui expose toutes les fonctionnalités de l'API Resend à travers 70 outils répartis dans 12 modules. Ce document fournit une documentation détaillée pour configurer et utiliser ce serveur avec différents clients MCP compatibles.

## Prérequis et installation

### Configuration requise
- **Node.js** 18+ (recommandé : v20 ou supérieur)
- **TypeScript** 5+
- Une **clé API Resend** valide
- Un **client MCP compatible** (Claude Desktop, Continue, Cline, etc.)

### Méthodes d'installation

#### Utilisation de npm/npx
```bash
# Installation globale
npm install -g @qrcommunication/resend-full-mcp

# Ou utilisation directe avec npx
npx @qrcommunication/resend-full-mcp
```

#### Utilisation de Python
```bash
# Installation depuis PyPI
pip install resend-full-mcp

# Lancement du serveur
resend-mcp
```

#### Depuis la source
```bash
# Clonage du dépôt
git clone https://github.com/QrCommunication/resend-full-mcp.git
cd resend-full-mcp

# Installation des dépendances
npm install

# Construction du projet
npm run build

# Démarrage du serveur
npm start
```

**Section sources**
- [README.md](file://README.md#L127-L178)
- [package.json](file://package.json#L10-L14)

## Configuration de base

### Structure du projet
```
resend-full-mcp/
├── src/
│   └── index.ts          # Implémentation principale du serveur MCP
├── dist/                 # Code JavaScript compilé (généré)
├── package.json          # Dépendances et scripts du projet
├── tsconfig.json         # Configuration TypeScript
├── .env                  # Variables d'environnement (non versionné)
├── .env.example          # Modèle de variables d'environnement
├── .gitignore            # Règles d'ignorance Git
└── README.md             # Documentation du projet
```

### Initialisation du serveur
Le serveur se configure automatiquement à partir des variables d'environnement définies dans le fichier `.env`. Le fichier d'exemple fournit le modèle nécessaire pour la configuration de base.

**Section sources**
- [README.md](file://README.md#L446-L460)
- [.env.example](file://.env.example#L1-L6)

## Configuration des clients MCP

### Claude Desktop

#### Configuration JSON
Ajoutez au fichier `claude_desktop_config.json` :

```json
{
  "mcpServers": {
    "resend": {
      "command": "npx",
      "args": ["-y", "@qrcommunication/resend-full-mcp"],
      "env": {
        "RESEND_API_KEY": "re_xxxxxxxxxxxxxxxxxxxx"
      }
    }
  }
}
```

#### Caractéristiques spécifiques
- Utilise le gestionnaire de paquets npm (`npx`) pour exécuter le serveur
- Permet de spécifier des variables d'environnement personnalisées
- Supporte le redémarrage automatique du serveur

### Continue.dev

#### Configuration JSON
Ajoutez au fichier `config.json` :

```json
{
  "mcpServers": [
    {
      "name": "resend",
      "command": "npx",
      "args": ["-y", "@qrcommunication/resend-full-mcp"],
      "env": {
        "RESEND_API_KEY": "re_xxxxxxxxxxxxxxxxxxxx"
      }
    }
  ]
}
```

#### Caractéristiques spécifiques
- Accepte un tableau de serveurs MCP
- Permet plusieurs instances configurées
- Gestion simplifiée des environnements

### Cline

#### Configuration JSON
Ajoutez au fichier de configuration MCP :

```json
{
  "resend": {
    "command": "npx",
    "args": ["-y", "@qrcommunication/resend-full-mcp"],
    "env": {
      "RESEND_API_KEY": "re_xxxxxxxxxxxxxxxxxxxx"
    }
  }
}
```

#### Caractéristiques spécifiques
- Structure de configuration légère
- Support direct des variables d'environnement
- Intégration native avec l'interface utilisateur

**Section sources**
- [README.md](file://README.md#L211-L264)

## Paramètres d'environnement

### Variables obligatoires

#### Clé API Resend
```env
# Votre clé API Resend depuis le tableau de bord
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
```

### Variables optionnelles

#### Base de l'API Resend
```env
# URL de base de l'API (par défaut : https://api.resend.com)
RESEND_API_BASE_URL=https://api.resend.com
```

#### Journalisation de débogage
```env
# Activer la journalisation de débogage (par défaut : false)
DEBUG=true
```

#### Limite de fréquence personnalisée
```env
# Limite de fréquence personnalisée (requêtes/seconde, par défaut : 2)
RATE_LIMIT=2
```

### Sécurité des clés API
- Ne jamais valider le fichier `.env` dans le contrôle de version
- Le fichier `.gitignore` inclut déjà le fichier `.env`
- Utilisez des clés API restreintes lorsque possible
- Renouvelez régulièrement les clés API
- Limitez les clés API à des domaines spécifiques en production

**Section sources**
- [README.md](file://README.md#L180-L210)
- [.env.example](file://.env.example#L1-L6)

## Différences entre les clients

### Claude Desktop
- Interface de bureau complète avec gestion avancée des serveurs MCP
- Support des variables d'environnement complexes
- Gestion des redémarrages automatiques
- Interface de configuration JSON structurée

### Continue.dev
- Interface de développement moderne
- Gestion simplifiée des configurations multiples
- Intégration native avec l'écosystème VS Code
- Support de plusieurs serveurs MCP simultanément

### Cline
- Interface utilisateur simplifiée
- Configuration légère et directe
- Idéal pour les utilisateurs débutants
- Moins de fonctionnalités avancées mais plus facile à utiliser

### Autres clients MCP compatibles
Le serveur est conçu pour être compatible avec tous les clients MCP standards, y compris :
- **Ollama** : avec le module MCP
- **LM Studio** : via les serveurs MCP
- **ChatGPT** : avec des extensions MCP
- **Autres clients** : selon leur implémentation MCP

## Exemples de configuration complets

### Configuration optimale pour Claude Desktop
```json
{
  "mcpServers": {
    "resend-production": {
      "command": "npx",
      "args": ["-y", "@qrcommunication/resend-full-mcp"],
      "env": {
        "RESEND_API_KEY": "re_production_key_here",
        "DEBUG": "false",
        "RATE_LIMIT": "2"
      },
      "workingDir": "/home/user/projects/email-app"
    },
    "resend-development": {
      "command": "npx",
      "args": ["-y", "@qrcommunication/resend-full-mcp"],
      "env": {
        "RESEND_API_KEY": "re_development_key_here",
        "DEBUG": "true",
        "RATE_LIMIT": "1"
      },
      "workingDir": "/home/user/projects/test-app"
    }
  }
}
```

### Configuration pour Continue.dev
```json
{
  "mcpServers": [
    {
      "name": "resend-api",
      "command": "npx",
      "args": ["-y", "@qrcommunication/resend-full-mcp"],
      "env": {
        "RESEND_API_KEY": "${env:RESEND_API_KEY}",
        "DEBUG": "${env:DEBUG}",
        "NODE_ENV": "production"
      },
      "autoRestart": true
    }
  ]
}
```

### Configuration sécurisée pour Cline
```json
{
  "resend": {
    "command": "npx",
    "args": ["-y", "@qrcommunication/resend-full-mcp"],
    "env": {
      "RESEND_API_KEY": "${secrets:RESEND_API_KEY}",
      "DEBUG": "false"
    }
  }
}
```

## Optimisations de performance

### Gestion de la limite de fréquence
Le serveur respecte les limites de fréquence de l'API Resend :
- **Par défaut** : 2 requêtes par seconde
- **Limites de rafale** : jusqu'à 10 requêtes en rafale courte
- **Augmentations** : limites plus élevées disponibles sur les plans payants

### Gestion des ressources
- **Mémoire** : Le serveur utilise environ 50MB de mémoire pour les opérations standard
- **CPU** : Faible consommation CPU pour les appels API
- **Réseau** : Optimisé pour les connexions HTTP/HTTPS

### Bonnes pratiques de performance
- Utilisez des requêtes batch pour envoyer plusieurs emails
- Mettez en cache les données fréquemment utilisées
- Évitez les appels répétés pour les mêmes données
- Utilisez des filtres appropriés pour limiter les résultats

**Section sources**
- [README.md](file://README.md#L487-L495)

## Gestion des erreurs

### Erreurs d'authentification
- **401 Unauthorized** : Clé API invalide ou manquante
- **403 Forbidden** : Permissions insuffisantes

### Erreurs de validation
- **400 Bad Request** : Paramètres invalides ou champs requis manquants
- **422 Unprocessable Entity** : Syntaxe valide mais données invalides

### Erreurs de ressource
- **404 Not Found** : Ressource n'existe pas
- **409 Conflict** : Conflit de ressource ou conflit

### Erreurs de limitation de fréquence
- **429 Too Many Requests** : Limite de fréquence dépassée

### Erreurs serveur
- **500 Internal Server Error** : Problème de service Resend
- **503 Service Unavailable** : Disponibilité temporaire du service

**Section sources**
- [README.md](file://README.md#L497-L518)

## Sécurité et bonnes pratiques

### Gestion des clés API
- Stockez votre clé API Resend dans des variables d'environnement
- Ne jamais valider les clés API dans le contrôle de version
- Utilisez des clés API à accès restreint (sending_access uniquement)
- Renouvelez régulièrement vos clés API
- Limitez les clés API à des domaines spécifiques en production

### Sécurité des webhooks
- Validez toujours les signatures des webhooks
- Utilisez des points de terminaison HTTPS pour les webhooks
- Mettez en œuvre la validation des secrets de webhook
- Mettez en place des limites de fréquence pour les points de terminaison
- Enregistrez les événements webhook pour l'audit

### Confidentialité des données
- Le serveur ne stocke aucun contenu d'email ni données de destinataire
- Toutes les données sont traitées en temps réel et envoyées directement à Resend
- Respectez le RGPD et autres réglementations de confidentialité
- Mettez en place des mécanismes d'abonnement annulant

### Meilleures pratiques de configuration
- Utilisez des environnements séparés pour développement et production
- Mettez en place des variables d'environnement sécurisées
- Utilisez des configurations optimisées pour chaque environnement
- Surveillez les performances et les erreurs
- Mettez à jour régulièrement le serveur MCP

**Section sources**
- [README.md](file://README.md#L462-L485)

## Dépannage

### Erreur : "La variable d'environnement RESEND_API_KEY n'est pas définie"
**Solution** : Créez un fichier `.env` avec votre clé API Resend :
```bash
echo "RESEND_API_KEY=re_votre_cle_ici" > .env
```

### Erreur : "Échec de l'appel d'outil"
**Causes possibles** :
- Clé API invalide
- Paramètres requis manquants
- Limite de fréquence de l'API dépassée
- Problèmes de connectivité réseau

**Solution** : Vérifiez le message d'erreur détaillé et vérifiez votre clé API et vos paramètres.

### Erreur : "Outil inconnu"
**Solution** : Vérifiez le nom de l'outil en utilisant la méthode `tools/list` pour voir tous les outils disponibles.

### Problèmes de connexion
- Vérifiez votre connectivité Internet
- Testez la clé API avec l'interface Resend
- Vérifiez les pare-feux et proxy
- Redémarrez le serveur MCP

### Problèmes de performance
- Réduisez le nombre d'appels simultanés
- Utilisez des requêtes batch
- Mettez en cache les données fréquemment utilisées
- Vérifiez les limites de fréquence

**Section sources**
- [README.md](file://README.md#L520-L541)

## Conclusion

Le serveur MCP Resend Full fournit une solution complète et sécurisée pour intégrer l'API Resend dans les assistants IA et applications LLM. Grâce à sa configuration flexible et à son support de plusieurs clients MCP, il permet aux développeurs de créer des applications puissantes pour la gestion des emails, des audiences, des domaines et des webhooks.

Les configurations présentées dans ce document couvrent les besoins de base pour Claude Desktop, Continue.dev, Cline et d'autres clients MCP compatibles. En suivant les bonnes pratiques de sécurité et en optimisant les performances, vous pouvez déployer efficacement ce serveur dans vos environnements de développement et de production.

Pour des mises à jour et des améliorations futures, consultez le dépôt GitHub et suivez le roadmap prévu pour le projet.
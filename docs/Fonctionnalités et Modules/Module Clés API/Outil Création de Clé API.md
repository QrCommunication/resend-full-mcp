# Outil Création de Clé API

<cite>
**Fichiers référencés dans ce document**
- [README.md](file://README.md)
- [src/index.ts](file://src/index.ts)
- [package.json](file://package.json)
- [.env.example](file://.env.example)
</cite>

## Sommaire
1. [Introduction](#introduction)
2. [Objectif de l’outil](#objectif-de-loutil)
3. [Configuration requise](#configuration-requise)
4. [Création d’une clé API](#création-dune-clé-api)
5. [Niveaux de permission](#niveaux-de-permission)
6. [Exemples de création de clés](#exemples-de-création-de-clés)
7. [Bonnes pratiques de nommage](#bonnes-pratiques-de-nommage)
8. [Implications de sécurité](#implications-de-sécurité)
9. [Gestion des clés API](#gestion-des-clés-api)
10. [Conclusion](#conclusion)

## Introduction
Cet outil permet de créer des clés API pour votre compte Resend à travers le Model Context Protocol (MCP). Il s’intègre dans un écosystème d’IA assistants qui peuvent interagir avec l’API Resend pour envoyer des emails, gérer des domaines, des audiences, des modèles, des diffusions, des webhooks, des segments, des sujets et des propriétés de contacts.

## Objectif de l’outil
L’outil de création de clé API vous permet de générer de nouvelles clés avec :
- Un nom descriptif pour identifier facilement l’utilisation de la clé
- Un niveau de permission précisant les opérations autorisées

## Configuration requise
Avant de créer des clés API, assurez-vous que votre environnement est correctement configuré avec une clé API Resend valide.

- Votre clé API Resend doit être définie dans une variable d’environnement
- Le serveur MCP lit cette variable pour exécuter les appels à l’API Resend

**Section sources**
- [README.md](file://README.md#L180-L210)
- [.env.example](file://.env.example#L1-L6)

## Création d’une clé API
Pour créer une nouvelle clé API, vous devez appeler l’outil `create_api_key` avec les paramètres suivants :

- name : Nom de la clé API (obligatoire)
- permission : Niveau de permission (facultatif, valeur par défaut : full_access)

Le niveau de permission peut prendre deux valeurs :
- full_access : Accès complet aux opérations de l’API Resend
- sending_access : Accès restreint uniquement à l’envoi d’emails

**Section sources**
- [src/index.ts](file://src/index.ts#L319-L350)
- [src/index.ts](file://src/index.ts#L1127-L1135)

## Niveaux de permission
Voici les deux niveaux de permission disponibles et leurs implications :

- full_access
  - Autorisations complètes sur toutes les ressources Resend
  - Peut effectuer toutes les opérations : création, lecture, mise à jour, suppression de domaines, audiences, contacts, modèles, diffusions, webhooks, segments, sujets, etc.
  - Risque élevé si compromise : accès total à vos données et opérations

- sending_access
  - Autorisations restreintes aux seules opérations d’envoi d’emails
  - Ne peut pas lire ni modifier les configurations de domaine, audience, contacts, modèles, diffusions, webhooks, segments, sujets
  - Moins de risques en cas de compromission : accès limité à l’envoi d’emails

**Section sources**
- [README.md](file://README.md#L493-L502)
- [src/index.ts](file://src/index.ts#L319-L350)

## Exemples de création de clés
Voici quelques scénarios courants avec des exemples de nommage :

- Pour un service d’envoi de notifications système
  - Nom : notifications-systeme
  - Permission : sending_access

- Pour un service de diffusion marketing
  - Nom : service-marketing
  - Permission : sending_access

- Pour un outil d’administration technique
  - Nom : admin-outil
  - Permission : full_access

- Pour un service de gestion des contacts
  - Nom : service-contacts
  - Permission : full_access

Remarque : Le niveau de permission est spécifié lors de la création de la clé. Si vous avez besoin de modifier le niveau de permission d’une clé existante, consultez la documentation de gestion des clés API.

**Section sources**
- [README.md](file://README.md#L493-L502)
- [src/index.ts](file://src/index.ts#L319-L350)

## Bonnes pratiques de nommage
Pour améliorer la traçabilité et la sécurité, suivez ces bonnes pratiques de nommage des clés API :

- Utilisez des noms descriptifs et courts
- Indiquez le service ou l’application associé
- Mentionnez le niveau de permission (par exemple : service-marketing-sending-access)
- Évitez les mots-clés sensibles dans le nom
- Utilisez des tirets ou underscores pour séparer les parties du nom
- Limitez la longueur du nom à 50 caractères maximum

**Section sources**
- [README.md](file://README.md#L493-L502)

## Implications de sécurité
La gestion des clés API est cruciale pour la sécurité de votre compte Resend. Voici les implications de chaque niveau de permission :

- full_access
  - Risque élevé : toute opération est possible
  - Recommandation : à utiliser uniquement pour des outils d’administration ou des services ayant besoin de contrôler l’ensemble de l’API
  - Rotation régulière recommandée

- sending_access
  - Risque réduit : seul l’envoi d’emails est autorisé
  - Recommandation : idéal pour les services d’envoi de notifications, de newsletters, de rappels
  - Moins de rotation nécessaire mais toujours surveillé

Pratiques de sécurité générales :
- Stockez toujours les clés API dans des variables d’environnement
- Ne jamais inclure les clés API dans le code source
- Limitez l’accès physique et logique aux fichiers contenant les clés
- Effectuez des rotations régulières des clés
- Supprimez les clés inutilisées
- Utilisez des domaines restreints pour limiter l’utilisation des clés

**Section sources**
- [README.md](file://README.md#L493-L502)

## Gestion des clés API
Une fois créées, vous pouvez gérer vos clés API avec les outils supplémentaires fournis :

- list_api_keys : Lister toutes les clés API de votre compte
- delete_api_key : Supprimer une clé API existante

Ces outils vous permettent de surveiller l’état de vos clés, de les supprimer si nécessaire, et de maintenir un bon niveau de sécurité.

**Section sources**
- [src/index.ts](file://src/index.ts#L319-L350)
- [src/index.ts](file://src/index.ts#L1127-L1135)

## Conclusion
L’outil de création de clé API vous permet de générer des clés sécurisées avec des permissions adaptées à vos besoins. En utilisant le niveau de permission sending_access pour les services d’envoi d’emails, vous réduisez considérablement les risques liés à un éventuel compromis de clé. Combinez cette approche avec des bonnes pratiques de gestion des clés et de nommage pour assurer la sécurité de votre compte Resend.
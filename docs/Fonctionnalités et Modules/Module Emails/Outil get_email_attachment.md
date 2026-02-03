# Outil get_email_attachment

<cite>
**Fichiers référencés dans ce document**
- [README.md](file://README.md)
- [package.json](file://package.json)
- [src/index.ts](file://src/index.ts)
</cite>

## Sommaire
1. [Introduction](#introduction)
2. [Objectif de l’outil](#objectif-de-loutil)
3. [Prérequis et configuration](#prérequis-et-configuration)
4. [Description technique de l’outil](#description-technique-de-loutil)
5. [Format de la réponse](#format-de-la-réponse)
6. [Exemples d’utilisation](#exemples-dutilisation)
7. [Limitations et contraintes](#limitations-et-contraintes)
8. [Intégration dans des applications](#intégration-dans-des-applications)
9. [Gestion des erreurs](#gestion-des-erreurs)
10. [Conclusion](#conclusion)

## Introduction
Cet outil permet de récupérer une pièce jointe spécifique à partir d’un email envoyé via l’API Resend. Il fait partie d’un serveur Model Context Protocol (MCP) qui expose l’intégralité de l’API Resend sous forme d’outils invocables. L’outil get_email_attachment est conçu pour fonctionner avec des clients MCP compatibles (comme Claude Desktop, Continue, Cline, etc.).

## Objectif de l’outil
Récupérer le contenu d’une pièce jointe spécifique d’un email envoyé, identifié par son ID d’email et l’ID de la pièce jointe. Le contenu retourné est au format binaire encodé (typiquement Base64), ce qui permet de le stocker temporairement ou de le traiter dans des applications.

## Prérequis et configuration
- Une clé API Resend valide.
- Un environnement Node.js compatible (v18+).
- Un client MCP compatible configuré pour appeler le serveur Resend MCP.

**Section sources**
- [README.md](file://README.md#L127-L210)
- [package.json](file://package.json#L32-L43)

## Description technique de l’outil
- Nom de l’outil : get_email_attachment
- Module : Emails
- Description : Récupère une seule pièce jointe d’un email envoyé.
- Entrées attendues :
  - email_id : Identifiant de l’email contenant la pièce jointe.
  - attachment_id : Identifiant de la pièce jointe à récupérer.
- Méthode HTTP utilisée : GET
- Endpoint cible : /emails/{email_id}/attachments/{attachment_id}

Implémentation interne
- L’outil est défini dans la liste des outils MCP avec un schéma d’entrée précis.
- La gestion de l’appel est effectuée via un handler qui construit l’URL de l’API Resend et effectue une requête HTTP GET.
- La réponse est renvoyée sous forme de texte JSON contenant les données de la pièce jointe.

**Section sources**
- [src/index.ts](file://src/index.ts#L187-L198)
- [src/index.ts](file://src/index.ts#L1065-L1068)

## Format de la réponse
Le contenu de la pièce jointe est retourné au format binaire encodé (Base64). Voici comment cela se présente généralement dans la réponse JSON :

- content : Chaîne de caractères encodée en Base64 représentant le contenu binaire de la pièce jointe.
- filename : Nom original de la pièce jointe.
- content_type : Type MIME de la pièce jointe (par exemple application/pdf, image/png, etc.).
- size : Taille de la pièce jointe en octets.

Remarque importante : Le contenu est fourni encodé en Base64 pour garantir une transmission fiable dans le protocole MCP. Pour l’utiliser comme fichier brut, il faudra décoder ce contenu Base64 avant de le stocker ou de le traiter.

**Section sources**
- [src/index.ts](file://src/index.ts#L1065-L1068)

## Exemples d’utilisation
Voici quelques scénarios courants d’utilisation de l’outil get_email_attachment.

### Télécharger une pièce jointe dans un script
- Étapes :
  1. Obtenir l’email_id et l’attachment_id depuis la liste des pièces jointes de l’email.
  2. Appeler l’outil get_email_attachment avec ces deux identifiants.
  3. Déballer le contenu Base64 de la réponse.
  4. Écrire le contenu binaire dans un fichier local.

### Traiter une pièce jointe dans une application
- Étapes :
  1. Recevoir la réponse de l’outil.
  2. Extraire le champ content (Base64).
  3. Convertir le Base64 en buffer binaire.
  4. Utiliser le buffer pour générer un PDF, un document texte, ou une image selon le content_type.

### Stockage temporaire de la pièce jointe
- Étapes :
  1. Stocker le contenu Base64 reçu dans un cache mémoire ou un système de stockage temporaire.
  2. Si nécessaire, décoder le Base64 pour accéder au contenu brut.
  3. Libérer la mémoire après utilisation.

**Section sources**
- [README.md](file://README.md#L266-L444)

## Limitations et contraintes
- Encodage Base64 : Le contenu est toujours retourné encodé en Base64. Cela peut augmenter la taille des données transmises.
- Taille maximale : Aucune limite spécifique n’est imposée par l’outil lui-même, mais l’API Resend impose ses propres limites de taille de contenu. En cas de gros fichiers, il est recommandé de vérifier les quotas de l’abonnement Resend.
- Accès autorisé : Seuls les emails envoyés via votre compte Resend sont accessibles. Vous devez disposer des droits nécessaires pour accéder aux données de l’email concerné.
- Encodage des caractères : Le nom de fichier et le type MIME sont fournis tels qu’ils ont été définis lors de l’envoi de l’email.

**Section sources**
- [README.md](file://README.md#L518-L549)

## Intégration dans des applications
- Clients MCP compatibles : Configurez votre client MCP (Claude Desktop, Continue, Cline) pour appeler le serveur Resend MCP.
- Flux de travail typique :
  1. Appeler list_email_attachments pour obtenir la liste des pièces jointes d’un email.
  2. Pour chaque pièce jointe, appeler get_email_attachment pour récupérer son contenu.
  3. Stocker ou traiter le contenu selon les besoins de votre application.

- Bonnes pratiques :
  - Vérifiez le content_type avant de traiter le contenu.
  - Gérez le décodage Base64 dans votre application.
  - Mettez en place des logs pour tracer les appels et les erreurs.

**Section sources**
- [README.md](file://README.md#L211-L265)
- [src/index.ts](file://src/index.ts#L1056-L1068)

## Gestion des erreurs
- Erreurs d’authentification : Si la clé API est manquante ou invalide, l’outil retournera une erreur indiquant un problème d’autorisation.
- Erreurs de validation : Des paramètres incorrects (email_id ou attachment_id manquants) entraîneront une erreur de validation.
- Ressource introuvable : Si l’email ou la pièce jointe n’existe pas, une erreur Not Found sera retournée.
- Trop de requêtes : Si vous dépassez les limites de taux de requêtes de Resend, vous recevrez une erreur 429 Too Many Requests.

Mesures de récupération suggérées :
- Vérifiez que les identifiants fournis sont corrects.
- Réessayez avec un délai si vous rencontrez une erreur de type 429.
- Assurez-vous que votre clé API est bien configurée dans l’environnement.

**Section sources**
- [README.md](file://README.md#L528-L549)

## Conclusion
L’outil get_email_attachment permet de récupérer facilement une pièce jointe spécifique d’un email envoyé, en utilisant l’identifiant de l’email et l’identifiant de la pièce jointe. Le contenu est fourni encodé en Base64, ce qui garantit une transmission fiable. En respectant les bonnes pratiques de traitement et de stockage, vous pouvez intégrer cette fonctionnalité dans vos applications MCP pour automatiser la gestion des pièces jointes.
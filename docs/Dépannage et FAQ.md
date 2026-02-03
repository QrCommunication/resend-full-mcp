# Dépannage et FAQ

<cite>
**Fichiers référencés dans ce document**
- [README.md](file://README.md)
- [package.json](file://package.json)
- [src/index.ts](file://src/index.ts)
- [.env.example](file://.env.example)
</cite>

## Sommaire
1. [Introduction](#introduction)
2. [Problèmes d’authentification](#problèmes-dauthentification)
3. [Problèmes de configuration](#problèmes-de-configuration)
4. [Problèmes de réseau](#problèmes-de-réseau)
5. [Problèmes de quota et de limites](#problèmes-de-quota-et-de-limites)
6. [Diagnostic pas à pas](#diagnostic-pas-à-pas)
7. [Bonnes pratiques](#bonnes-pratiques)
8. [Questions fréquentes](#questions-fréquentes)
9. [Conclusion](#conclusion)

## Introduction
Ce document fournit un guide complet pour diagnostiquer et résoudre les problèmes fréquents liés au serveur MCP Resend Full. Il couvre les erreurs d’authentification, de configuration, de réseau, de quota, ainsi que des diagnostics et bonnes pratiques pour garantir un fonctionnement fiable avec des clients MCP (comme Claude Desktop, Continue, Cline, etc.).

## Problèmes d’authentification
Les erreurs d’authentification sont généralement dues à un problème de clé API ou à une mauvaise configuration de l’environnement.

- Symptômes typiques
  - Message d’erreur indiquant qu’une clé API est manquante ou invalide
  - Réponses 401 Unauthorized ou 403 Forbidden depuis l’API Resend
  - Échec de tous les appels d’outils MCP

- Causes possibles
  - Clé API non définie dans l’environnement
  - Clé API incorrecte ou expirée
  - Utilisation d’un token d’accès restreint sans autorisations suffisantes
  - Erreur de copie-coller de la clé (caractères invisibles, espaces)

- Solutions
  - Vérifiez que la variable d’environnement RESEND_API_KEY est présente et correcte
  - Utilisez un token avec les permissions nécessaires (ex. sending_access si vous ne faites que envoyer des emails)
  - Testez la clé en exécutant un appel simple via curl ou un outil de test HTTP
  - Pour les clients MCP, assurez-vous que la clé est transmise correctement dans la configuration du serveur MCP

**Section sources**
- [README.md](file://README.md#L553-L568)
- [src/index.ts](file://src/index.ts#L1571-L1577)

## Problèmes de configuration
Ces erreurs surviennent souvent lors de la mise en place initiale du serveur ou de la configuration des clients MCP.

- Symptômes typiques
  - Le serveur ne démarre pas
  - Erreurs “Unknown tool” ou “Tool execution failed”
  - Absence de réponse des outils MCP

- Causes possibles
  - Fichier .env absent ou mal rempli
  - Variables d’environnement non chargées (problème de chemin ou de droits)
  - Version de Node.js incompatible
  - Mauvaise configuration du client MCP (commande, arguments, variables d’environnement)

- Solutions
  - Copiez .env.example en .env et renseignez RESEND_API_KEY
  - Vérifiez que Node.js >= 18 est utilisé (la version recommandée est mentionnée dans le README)
  - Pour les clients MCP, vérifiez que la commande pointe vers le bon exécutable (npx @qrcommunication/resend-full-mcp) et que la clé API est transmise
  - Redémarrez le serveur MCP après toute modification de configuration

**Section sources**
- [README.md](file://README.md#L180-L210)
- [README.md](file://README.md#L127-L132)
- [package.json](file://package.json#L41-L43)
- [src/index.ts](file://src/index.ts#L1571-L1577)

## Problèmes de réseau
Les erreurs réseau peuvent survenir lors des appels HTTP vers l’API Resend, surtout en cas de connectivité instable ou de proxy.

- Symptômes typiques
  - Timeout des requêtes
  - Messages d’erreur réseau (ECONNREFUSED, ETIMEDOUT)
  - Réponse incomplète ou JSON invalide

- Causes possibles
  - Problèmes de connectivité Internet
  - Proxy bloquant l’accès à https://api.resend.com
  - Pare-feu local ou antivirus bloquant le trafic sortant
  - Serveur Resend temporairement indisponible

- Solutions
  - Testez la connectivité avec curl https://api.resend.com
  - Si vous êtes derrière un proxy, configurez les variables http_proxy/https_proxy
  - Désactivez temporairement le pare-feu ou antivirus pour tester
  - Réessayez plus tard si l’API Resend est en maintenance

**Section sources**
- [README.md](file://README.md#L547-L549)
- [src/index.ts](file://src/index.ts#L1011-L1015)

## Problèmes de quota et de limites
Le service Resend impose des limites de taux (rate limits) qui peuvent provoquer des erreurs 429 Too Many Requests.

- Symptômes typiques
  - Erreurs 429 Too Many Requests
  - Retards ou interruptions des appels
  - Retry automatique des requêtes

- Causes possibles
  - Dépassement de la limite de 2 requêtes/seconde (ou plus selon votre plan)
  - Envoi massif de mails sans temporisation
  - Utilisation de la méthode send_batch_emails sans respecter les limites

- Solutions
  - Respectez la limite de 2 requêtes/seconde (ou celle de votre plan)
  - Ajoutez des temporisations entre les appels
  - Utilisez send_batch_emails pour regrouper les envois
  - Mettez en place un système de backoff exponentiel en cas d’erreur 429
  - Passez à un plan supérieur si nécessaire

**Section sources**
- [README.md](file://README.md#L518-L526)
- [README.md](file://README.md#L544-L546)

## Diagnostic pas à pas
Voici une procédure à suivre pour diagnostiquer les problèmes courants.

- Étape 1 : Vérifier l’authentification
  - Vérifiez que RESEND_API_KEY est bien définie
  - Testez la clé via un appel curl simple à l’API Resend
  - Pour les clients MCP, vérifiez que la clé est transmise dans la configuration

- Étape 2 : Vérifier la configuration
  - Copiez .env.example en .env et renseignez RESEND_API_KEY
  - Vérifiez la version de Node.js
  - Redémarrez le serveur MCP

- Étape 3 : Tester le réseau
  - Exécutez curl https://api.resend.com pour valider la connectivité
  - Si vous êtes derrière un proxy, configurez http_proxy/https_proxy

- Étape 4 : Gérer les limites
  - Réduisez la fréquence des appels
  - Utilisez send_batch_emails pour les envois groupés
  - Implémentez un backoff en cas d’erreur 429

- Étape 5 : Consulter les logs
  - Activez le mode debug si disponible
  - Vérifiez les messages d’erreur renvoyés par le serveur MCP

**Section sources**
- [README.md](file://README.md#L180-L210)
- [README.md](file://README.md#L518-L526)
- [src/index.ts](file://src/index.ts#L1571-L1577)

## Bonnes pratiques
- Stockez toujours vos clés API dans des variables d’environnement
- N’utilisez pas de clés avec des permissions trop larges si cela n’est pas nécessaire
- Testez régulièrement la connectivité réseau
- Respectez les limites de taux imposées par Resend
- Documentez les paramètres de configuration de vos clients MCP
- Mettez à jour régulièrement le serveur MCP et ses dépendances

**Section sources**
- [README.md](file://README.md#L493-L517)
- [README.md](file://README.md#L518-L526)

## Questions fréquentes

### Comment puis-je vérifier que mon serveur MCP démarre correctement ?
- Vérifiez que le serveur affiche un message de démarrage et la liste des modules disponibles
- Utilisez tools/list pour confirmer que tous les outils sont disponibles

**Section sources**
- [src/index.ts](file://src/index.ts#L1579-L1596)

### J’ai une erreur “Unknown tool”. Que dois-je faire ?
- Vérifiez le nom de l’outil avec tools/list
- Assurez-vous que le nom est correct et qu’il existe dans la liste des outils

**Section sources**
- [README.md](file://README.md#L570-L572)

### Mon client MCP ne reçoit aucune réponse. Que faire ?
- Redémarrez le serveur MCP
- Vérifiez que la commande et les arguments sont corrects
- Confirmez que la clé API est transmise

**Section sources**
- [README.md](file://README.md#L211-L264)

### Je reçois des erreurs 429. Comment les résoudre ?
- Réduisez la fréquence des appels
- Utilisez send_batch_emails pour les envois groupés
- Implémentez un backoff en cas d’erreur 429

**Section sources**
- [README.md](file://README.md#L544-L546)
- [README.md](file://README.md#L518-L526)

### Comment puis-je activer le mode debug ?
- Définissez DEBUG=true dans votre fichier .env
- Redémarrez le serveur MCP

**Section sources**
- [README.md](file://README.md#L197-L207)

### Où trouver la documentation officielle ?
- Documentation Resend : https://resend.com/docs
- Référence API Resend : https://resend.com/docs/api-reference
- Documentation MCP : https://modelcontextprotocol.io

**Section sources**
- [README.md](file://README.md#L706-L708)

## Conclusion
En suivant ce guide de dépannage, vous devriez pouvoir identifier et résoudre la plupart des problèmes liés à l’utilisation du serveur MCP Resend Full. Pour des questions spécifiques, consultez la documentation officielle et les ressources communautaires mentionnées dans le README.
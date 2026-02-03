# Resend Expert Skill

> Expert en implementation de Resend pour applications web, mobile et backend. Guide complet des bonnes pratiques, patterns d'architecture et optimisations.

## Metadata

- **Version**: 1.0.0
- **Author**: QrCommunication
- **Tags**: resend, email, api, transactional, marketing, webhooks
- **Trigger**: Toute question concernant l'implementation de Resend dans une application

---

## 1. Fondamentaux Resend

### 1.1 Qu'est-ce que Resend ?

Resend est une plateforme d'envoi d'emails moderne construite pour les developpeurs. Elle offre:

- **API RESTful** simple et intuitive
- **SDKs** pour Node.js, Python, Go, Ruby, PHP, Elixir, Java
- **Deliverabilite** optimisee avec infrastructure dediee
- **Analytics** en temps reel (opens, clicks, bounces)
- **React Email** integration native pour templates

### 1.2 Concepts Cles

| Concept | Description |
|---------|-------------|
| **Transactional Email** | Emails declenches par actions utilisateur (confirmation, reset password) |
| **Marketing Email** | Emails de masse (newsletters, promotions) via Broadcasts |
| **Audience** | Liste de contacts pour envois marketing |
| **Segment** | Sous-ensemble filtre d'une audience |
| **Topic** | Categorie d'abonnement pour preference center |
| **Domain** | Domaine verifie pour envoi authentifie |
| **Webhook** | Notification temps reel des evenements email |

---

## 2. Configuration Initiale

### 2.1 Obtenir une API Key

```bash
# 1. Creer un compte sur https://resend.com
# 2. Aller dans Settings > API Keys
# 3. Creer une cle avec les permissions appropriees

# Permissions disponibles:
# - full_access: Acces complet a toutes les fonctionnalites
# - sending_access: Envoi uniquement (recommande pour production)
```

### 2.2 Configuration Domaine

**Etapes obligatoires pour production:**

1. **Ajouter le domaine** dans le dashboard Resend
2. **Configurer les enregistrements DNS**:

```dns
# SPF (TXT record)
@ TXT "v=spf1 include:_spf.resend.com ~all"

# DKIM (CNAME records - fournis par Resend)
resend._domainkey CNAME [valeur fournie]

# DMARC (recommande)
_dmarc TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@votredomaine.com"
```

3. **Verifier le domaine** via le dashboard ou API

### 2.3 Variables d'Environnement

```env
# .env - NE JAMAIS COMMIT

# API Key (OBLIGATOIRE)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx

# Configuration optionnelle
RESEND_FROM_EMAIL=noreply@votredomaine.com
RESEND_FROM_NAME="Votre App"
RESEND_REPLY_TO=support@votredomaine.com

# Rate limiting (defaut: 2 req/s)
RESEND_RATE_LIMIT=2

# Environnement
NODE_ENV=production
```

---

## 3. Architecture Recommandee

### 3.1 Pattern Service Email

```
src/
├── services/
│   └── email/
│       ├── index.ts           # Export principal
│       ├── client.ts          # Instance Resend
│       ├── templates/         # Templates email
│       │   ├── welcome.tsx
│       │   ├── reset-password.tsx
│       │   └── invoice.tsx
│       ├── types.ts           # Types TypeScript
│       └── utils.ts           # Helpers
├── jobs/
│   └── email-queue.ts         # Queue pour envois async
└── webhooks/
    └── resend.ts              # Handler webhooks
```

### 3.2 Client Singleton (TypeScript/Node.js)

```typescript
// src/services/email/client.ts
import { Resend } from 'resend';

class EmailClient {
  private static instance: Resend;
  
  static getInstance(): Resend {
    if (!EmailClient.instance) {
      const apiKey = process.env.RESEND_API_KEY;
      if (!apiKey) {
        throw new Error('RESEND_API_KEY is required');
      }
      EmailClient.instance = new Resend(apiKey);
    }
    return EmailClient.instance;
  }
}

export const resend = EmailClient.getInstance();
```

### 3.3 Types TypeScript

```typescript
// src/services/email/types.ts
export interface EmailConfig {
  from: string;
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  scheduledAt?: string;
  tags?: Array<{ name: string; value: string }>;
  headers?: Record<string, string>;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

export interface EmailResult {
  id: string;
  success: boolean;
  error?: string;
}

export type EmailEventType = 
  | 'email.sent'
  | 'email.delivered'
  | 'email.delivery_delayed'
  | 'email.complained'
  | 'email.bounced'
  | 'email.opened'
  | 'email.clicked';

export interface WebhookPayload {
  type: EmailEventType;
  created_at: string;
  data: {
    email_id: string;
    from: string;
    to: string[];
    subject: string;
    [key: string]: any;
  };
}
```

---

## 4. Implementation par Cas d'Usage

### 4.1 Email Transactionnel Simple

```typescript
// src/services/email/send.ts
import { resend } from './client';
import type { EmailConfig, EmailResult } from './types';

export async function sendEmail(config: EmailConfig): Promise<EmailResult> {
  try {
    const { data, error } = await resend.emails.send({
      from: config.from || process.env.RESEND_FROM_EMAIL!,
      to: Array.isArray(config.to) ? config.to : [config.to],
      subject: config.subject,
      html: config.html,
      text: config.text,
      reply_to: config.replyTo,
      cc: config.cc,
      bcc: config.bcc,
      scheduled_at: config.scheduledAt,
      tags: config.tags,
      headers: config.headers,
    });

    if (error) {
      console.error('[Email] Send failed:', error);
      return { id: '', success: false, error: error.message };
    }

    return { id: data!.id, success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[Email] Exception:', message);
    return { id: '', success: false, error: message };
  }
}
```

### 4.2 Email de Bienvenue (React Email)

```tsx
// src/services/email/templates/welcome.tsx
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface WelcomeEmailProps {
  username: string;
  loginUrl: string;
  unsubscribeUrl: string;
}

export function WelcomeEmail({ 
  username, 
  loginUrl, 
  unsubscribeUrl 
}: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Bienvenue sur notre plateforme, {username}!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src="https://votreapp.com/logo.png"
            width="150"
            height="50"
            alt="Logo"
            style={logo}
          />
          
          <Heading style={heading}>
            Bienvenue, {username}!
          </Heading>
          
          <Text style={paragraph}>
            Nous sommes ravis de vous compter parmi nous. Votre compte 
            a ete cree avec succes.
          </Text>
          
          <Section style={buttonContainer}>
            <Button style={button} href={loginUrl}>
              Commencer maintenant
            </Button>
          </Section>
          
          <Text style={footer}>
            Si vous n'avez pas cree ce compte,{' '}
            <Link href="mailto:support@votreapp.com">
              contactez-nous
            </Link>.
          </Text>
          
          <Text style={unsubscribe}>
            <Link href={unsubscribeUrl}>Se desabonner</Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Styles inline (requis pour compatibilite email)
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '560px',
};

const logo = {
  margin: '0 auto 20px',
  display: 'block',
};

const heading = {
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '0 0 20px',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#525f7f',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '30px 0',
};

const button = {
  backgroundColor: '#5469d4',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  padding: '12px 30px',
};

const footer = {
  fontSize: '14px',
  color: '#8898aa',
  marginTop: '30px',
};

const unsubscribe = {
  fontSize: '12px',
  color: '#8898aa',
  textAlign: 'center' as const,
  marginTop: '20px',
};

export default WelcomeEmail;
```

### 4.3 Envoi avec Template React

```typescript
// src/services/email/actions/send-welcome.ts
import { resend } from '../client';
import { WelcomeEmail } from '../templates/welcome';
import { render } from '@react-email/render';

interface SendWelcomeParams {
  email: string;
  username: string;
}

export async function sendWelcomeEmail({ email, username }: SendWelcomeParams) {
  const loginUrl = `${process.env.APP_URL}/login`;
  const unsubscribeUrl = `${process.env.APP_URL}/unsubscribe?email=${encodeURIComponent(email)}`;
  
  // Render React component to HTML
  const html = await render(
    WelcomeEmail({ username, loginUrl, unsubscribeUrl })
  );
  
  // Version text pour clients sans HTML
  const text = `
Bienvenue ${username}!

Nous sommes ravis de vous compter parmi nous.

Connectez-vous: ${loginUrl}

---
Pour vous desabonner: ${unsubscribeUrl}
  `.trim();
  
  const { data, error } = await resend.emails.send({
    from: `${process.env.RESEND_FROM_NAME} <${process.env.RESEND_FROM_EMAIL}>`,
    to: email,
    subject: `Bienvenue sur ${process.env.APP_NAME}, ${username}!`,
    html,
    text,
    tags: [
      { name: 'type', value: 'welcome' },
      { name: 'user_id', value: username },
    ],
  });

  if (error) {
    throw new Error(`Failed to send welcome email: ${error.message}`);
  }

  return data;
}
```

### 4.4 Reset Password

```typescript
// src/services/email/actions/send-reset-password.ts
import { resend } from '../client';

interface SendResetPasswordParams {
  email: string;
  resetToken: string;
  expiresIn: string; // ex: "1 hour"
}

export async function sendResetPasswordEmail({
  email,
  resetToken,
  expiresIn,
}: SendResetPasswordParams) {
  const resetUrl = `${process.env.APP_URL}/reset-password?token=${resetToken}`;
  
  const { data, error } = await resend.emails.send({
    from: `Security <security@${process.env.EMAIL_DOMAIN}>`,
    to: email,
    subject: 'Reinitialisation de votre mot de passe',
    html: `
      <h2>Reinitialisation de mot de passe</h2>
      <p>Vous avez demande a reinitialiser votre mot de passe.</p>
      <p>
        <a href="${resetUrl}" style="
          background-color: #dc3545;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 4px;
          display: inline-block;
        ">
          Reinitialiser mon mot de passe
        </a>
      </p>
      <p><small>Ce lien expire dans ${expiresIn}.</small></p>
      <p><small>Si vous n'avez pas fait cette demande, ignorez cet email.</small></p>
    `,
    text: `
Reinitialisation de mot de passe

Vous avez demande a reinitialiser votre mot de passe.

Cliquez ici: ${resetUrl}

Ce lien expire dans ${expiresIn}.

Si vous n'avez pas fait cette demande, ignorez cet email.
    `,
    tags: [
      { name: 'type', value: 'password_reset' },
      { name: 'priority', value: 'high' },
    ],
    headers: {
      'X-Priority': '1',
      'X-MSMail-Priority': 'High',
    },
  });

  if (error) {
    throw new Error(`Failed to send reset password email: ${error.message}`);
  }

  return data;
}
```

### 4.5 Email avec Pieces Jointes

```typescript
// src/services/email/actions/send-invoice.ts
import { resend } from '../client';
import { readFile } from 'fs/promises';
import path from 'path';

interface SendInvoiceParams {
  email: string;
  customerName: string;
  invoiceNumber: string;
  pdfPath: string;
}

export async function sendInvoiceEmail({
  email,
  customerName,
  invoiceNumber,
  pdfPath,
}: SendInvoiceParams) {
  // Lire le fichier PDF
  const pdfBuffer = await readFile(pdfPath);
  
  const { data, error } = await resend.emails.send({
    from: `Facturation <billing@${process.env.EMAIL_DOMAIN}>`,
    to: email,
    subject: `Facture ${invoiceNumber}`,
    html: `
      <h2>Votre facture ${invoiceNumber}</h2>
      <p>Bonjour ${customerName},</p>
      <p>Veuillez trouver ci-joint votre facture.</p>
      <p>Merci pour votre confiance.</p>
    `,
    attachments: [
      {
        filename: `facture-${invoiceNumber}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
    tags: [
      { name: 'type', value: 'invoice' },
      { name: 'invoice_number', value: invoiceNumber },
    ],
  });

  if (error) {
    throw new Error(`Failed to send invoice: ${error.message}`);
  }

  return data;
}
```

### 4.6 Envoi en Batch (jusqu'a 100 emails)

```typescript
// src/services/email/actions/send-batch.ts
import { resend } from '../client';

interface BatchEmail {
  to: string;
  subject: string;
  html: string;
  tags?: Array<{ name: string; value: string }>;
}

export async function sendBatchEmails(
  emails: BatchEmail[],
  fromEmail: string
) {
  // Resend limite a 100 emails par batch
  const BATCH_SIZE = 100;
  const results = [];

  for (let i = 0; i < emails.length; i += BATCH_SIZE) {
    const batch = emails.slice(i, i + BATCH_SIZE);
    
    const batchPayload = batch.map(email => ({
      from: fromEmail,
      to: email.to,
      subject: email.subject,
      html: email.html,
      tags: email.tags,
    }));

    const { data, error } = await resend.batch.send(batchPayload);
    
    if (error) {
      console.error(`Batch ${i / BATCH_SIZE + 1} failed:`, error);
      results.push({ batch: i / BATCH_SIZE + 1, error: error.message });
    } else {
      results.push({ batch: i / BATCH_SIZE + 1, data });
    }
    
    // Respecter le rate limiting (2 req/s par defaut)
    if (i + BATCH_SIZE < emails.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  return results;
}
```

### 4.7 Email Programme (Scheduled)

```typescript
// src/services/email/actions/schedule-email.ts
import { resend } from '../client';

interface ScheduleEmailParams {
  to: string;
  subject: string;
  html: string;
  scheduledAt: Date;
}

export async function scheduleEmail({
  to,
  subject,
  html,
  scheduledAt,
}: ScheduleEmailParams) {
  // Verifier que la date est dans le futur
  if (scheduledAt <= new Date()) {
    throw new Error('Scheduled time must be in the future');
  }
  
  // Verifier limite de 72h
  const maxScheduleTime = new Date();
  maxScheduleTime.setHours(maxScheduleTime.getHours() + 72);
  
  if (scheduledAt > maxScheduleTime) {
    throw new Error('Cannot schedule more than 72 hours in advance');
  }

  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to,
    subject,
    html,
    scheduled_at: scheduledAt.toISOString(),
    tags: [
      { name: 'type', value: 'scheduled' },
      { name: 'scheduled_for', value: scheduledAt.toISOString() },
    ],
  });

  if (error) {
    throw new Error(`Failed to schedule email: ${error.message}`);
  }

  return {
    emailId: data!.id,
    scheduledAt: scheduledAt.toISOString(),
  };
}

// Annuler un email programme
export async function cancelScheduledEmail(emailId: string) {
  const response = await fetch(
    `https://api.resend.com/emails/${emailId}/cancel`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to cancel email: ${error.message}`);
  }

  return { cancelled: true, emailId };
}
```

---

## 5. Webhooks

### 5.1 Configuration des Webhooks

```typescript
// src/webhooks/resend-config.ts
import { resend } from '../services/email/client';

export async function setupWebhooks() {
  const webhookUrl = `${process.env.APP_URL}/api/webhooks/resend`;
  
  const { data, error } = await resend.webhooks.create({
    url: webhookUrl,
    events: [
      'email.sent',
      'email.delivered',
      'email.delivery_delayed',
      'email.complained',
      'email.bounced',
      'email.opened',
      'email.clicked',
    ],
  });

  if (error) {
    throw new Error(`Failed to create webhook: ${error.message}`);
  }

  console.log('Webhook created:', data);
  return data;
}
```

### 5.2 Handler de Webhooks (Express)

```typescript
// src/webhooks/resend-handler.ts
import { Router } from 'express';
import crypto from 'crypto';
import type { WebhookPayload } from '../services/email/types';

const router = Router();

// Middleware de verification signature
function verifySignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}

router.post('/api/webhooks/resend', async (req, res) => {
  const signature = req.headers['resend-signature'] as string;
  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET!;
  
  // Verifier la signature (CRUCIAL pour la securite)
  const rawBody = JSON.stringify(req.body);
  if (!verifySignature(rawBody, signature, webhookSecret)) {
    console.error('[Webhook] Invalid signature');
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const event: WebhookPayload = req.body;
  
  try {
    switch (event.type) {
      case 'email.sent':
        await handleEmailSent(event.data);
        break;
        
      case 'email.delivered':
        await handleEmailDelivered(event.data);
        break;
        
      case 'email.bounced':
        await handleEmailBounced(event.data);
        break;
        
      case 'email.complained':
        await handleEmailComplained(event.data);
        break;
        
      case 'email.opened':
        await handleEmailOpened(event.data);
        break;
        
      case 'email.clicked':
        await handleEmailClicked(event.data);
        break;
        
      case 'email.delivery_delayed':
        await handleDeliveryDelayed(event.data);
        break;
        
      default:
        console.warn('[Webhook] Unknown event type:', event.type);
    }
    
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('[Webhook] Processing error:', error);
    res.status(500).json({ error: 'Processing failed' });
  }
});

// Handlers specifiques
async function handleEmailSent(data: any) {
  console.log('[Email] Sent:', data.email_id);
  // Mettre a jour le statut en base
}

async function handleEmailDelivered(data: any) {
  console.log('[Email] Delivered:', data.email_id);
  // Mettre a jour le statut en base
}

async function handleEmailBounced(data: any) {
  console.error('[Email] Bounced:', data.email_id, data.bounce);
  // IMPORTANT: Marquer l'email comme invalide
  // Eviter les futurs envois a cette adresse
  await markEmailAsBounced(data.to[0], data.bounce);
}

async function handleEmailComplained(data: any) {
  console.error('[Email] Spam complaint:', data.email_id);
  // CRITIQUE: Desabonner immediatement le contact
  await unsubscribeContact(data.to[0]);
}

async function handleEmailOpened(data: any) {
  console.log('[Email] Opened:', data.email_id);
  // Analytics: Enregistrer l'ouverture
}

async function handleEmailClicked(data: any) {
  console.log('[Email] Link clicked:', data.email_id, data.link);
  // Analytics: Enregistrer le clic
}

async function handleDeliveryDelayed(data: any) {
  console.warn('[Email] Delivery delayed:', data.email_id);
  // Alerter si necessaire
}

// Fonctions helper
async function markEmailAsBounced(email: string, bounceInfo: any) {
  // Implementation: Marquer en base
}

async function unsubscribeContact(email: string) {
  // Implementation: Desabonner le contact
}

export default router;
```

### 5.3 Handler Next.js (App Router)

```typescript
// app/api/webhooks/resend/route.ts
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  const signature = request.headers.get('resend-signature');
  const body = await request.text();
  
  // Verification signature
  const secret = process.env.RESEND_WEBHOOK_SECRET!;
  const expected = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');
    
  if (signature !== expected) {
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 401 }
    );
  }

  const event = JSON.parse(body);
  
  // Traitement asynchrone pour repondre rapidement
  processWebhookAsync(event);
  
  return NextResponse.json({ received: true });
}

async function processWebhookAsync(event: any) {
  // Traitement en background
  switch (event.type) {
    case 'email.bounced':
      // Logique bounce
      break;
    case 'email.complained':
      // Logique plainte spam
      break;
    // ... autres cas
  }
}
```

---

## 6. Gestion des Audiences et Contacts

### 6.1 Creer et Gerer une Audience

```typescript
// src/services/email/audiences.ts
import { resend } from './client';

export async function createAudience(name: string) {
  const { data, error } = await resend.audiences.create({ name });
  
  if (error) {
    throw new Error(`Failed to create audience: ${error.message}`);
  }
  
  return data;
}

export async function listAudiences() {
  const { data, error } = await resend.audiences.list();
  
  if (error) {
    throw new Error(`Failed to list audiences: ${error.message}`);
  }
  
  return data?.data || [];
}

export async function getAudience(audienceId: string) {
  const { data, error } = await resend.audiences.get(audienceId);
  
  if (error) {
    throw new Error(`Failed to get audience: ${error.message}`);
  }
  
  return data;
}
```

### 6.2 Gestion des Contacts

```typescript
// src/services/email/contacts.ts
import { resend } from './client';

interface CreateContactParams {
  audienceId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  unsubscribed?: boolean;
}

export async function addContact({
  audienceId,
  email,
  firstName,
  lastName,
  unsubscribed = false,
}: CreateContactParams) {
  const { data, error } = await resend.contacts.create({
    audienceId,
    email,
    firstName,
    lastName,
    unsubscribed,
  });

  if (error) {
    throw new Error(`Failed to add contact: ${error.message}`);
  }

  return data;
}

export async function updateContact(
  audienceId: string,
  contactId: string,
  updates: Partial<CreateContactParams>
) {
  const { data, error } = await resend.contacts.update({
    audienceId,
    id: contactId,
    ...updates,
  });

  if (error) {
    throw new Error(`Failed to update contact: ${error.message}`);
  }

  return data;
}

export async function removeContact(audienceId: string, contactId: string) {
  const { data, error } = await resend.contacts.remove({
    audienceId,
    id: contactId,
  });

  if (error) {
    throw new Error(`Failed to remove contact: ${error.message}`);
  }

  return data;
}

export async function unsubscribeContact(audienceId: string, email: string) {
  // Trouver le contact par email via l'API
  const response = await fetch(
    `https://api.resend.com/audiences/${audienceId}/contacts/${email}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ unsubscribed: true }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to unsubscribe: ${error.message}`);
  }

  return response.json();
}
```

### 6.3 Import Bulk de Contacts

```typescript
// src/services/email/bulk-import.ts
import { resend } from './client';

interface Contact {
  email: string;
  firstName?: string;
  lastName?: string;
}

export async function bulkImportContacts(
  audienceId: string,
  contacts: Contact[]
) {
  const results = {
    success: 0,
    failed: 0,
    errors: [] as Array<{ email: string; error: string }>,
  };

  // Traiter par lots de 50 pour eviter les timeouts
  const BATCH_SIZE = 50;

  for (let i = 0; i < contacts.length; i += BATCH_SIZE) {
    const batch = contacts.slice(i, i + BATCH_SIZE);
    
    const promises = batch.map(async (contact) => {
      try {
        await resend.contacts.create({
          audienceId,
          email: contact.email,
          firstName: contact.firstName,
          lastName: contact.lastName,
        });
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          email: contact.email,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    });

    await Promise.all(promises);
    
    // Rate limiting
    if (i + BATCH_SIZE < contacts.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return results;
}
```

---

## 7. Broadcasts (Envois Marketing)

### 7.1 Creer un Broadcast

```typescript
// src/services/email/broadcasts.ts
import { resend } from './client';

interface CreateBroadcastParams {
  name: string;
  segmentId: string;
  from: string;
  subject: string;
  html: string;
  text?: string;
  previewText?: string;
  replyTo?: string[];
  scheduledAt?: Date;
}

export async function createBroadcast({
  name,
  segmentId,
  from,
  subject,
  html,
  text,
  previewText,
  replyTo,
  scheduledAt,
}: CreateBroadcastParams) {
  const payload: any = {
    name,
    segment_id: segmentId,
    from,
    subject,
    html,
    send: false, // Creer comme brouillon
  };

  if (text) payload.text = text;
  if (previewText) payload.preview_text = previewText;
  if (replyTo) payload.reply_to = replyTo;

  const response = await fetch('https://api.resend.com/broadcasts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to create broadcast: ${error.message}`);
  }

  return response.json();
}

export async function sendBroadcast(
  broadcastId: string,
  scheduledAt?: Date
) {
  const payload: any = {};
  
  if (scheduledAt) {
    payload.scheduled_at = scheduledAt.toISOString();
  }

  const response = await fetch(
    `https://api.resend.com/broadcasts/${broadcastId}/send`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to send broadcast: ${error.message}`);
  }

  return response.json();
}
```

---

## 8. Integration Framework

### 8.1 Next.js (Server Actions)

```typescript
// app/actions/email.ts
'use server';

import { resend } from '@/lib/email/client';
import { z } from 'zod';

const ContactFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
});

export async function submitContactForm(formData: FormData) {
  const validatedFields = ContactFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  });

  if (!validatedFields.success) {
    return { error: 'Invalid form data' };
  }

  const { name, email, message } = validatedFields.data;

  try {
    // Email a l'equipe
    await resend.emails.send({
      from: 'Contact Form <contact@votreapp.com>',
      to: ['team@votreapp.com'],
      replyTo: email,
      subject: `Nouveau message de ${name}`,
      html: `
        <h2>Nouveau message de contact</h2>
        <p><strong>Nom:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    // Email de confirmation a l'utilisateur
    await resend.emails.send({
      from: 'VotreApp <noreply@votreapp.com>',
      to: email,
      subject: 'Nous avons bien recu votre message',
      html: `
        <h2>Merci ${name}!</h2>
        <p>Nous avons bien recu votre message et vous repondrons 
        dans les plus brefs delais.</p>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('[Contact Form] Error:', error);
    return { error: 'Failed to send message' };
  }
}
```

### 8.2 Express.js Middleware

```typescript
// src/middleware/email-queue.ts
import { Queue } from 'bullmq';
import { resend } from '../services/email/client';

const emailQueue = new Queue('emails', {
  connection: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },
});

// Worker pour traiter les emails
import { Worker } from 'bullmq';

const emailWorker = new Worker(
  'emails',
  async (job) => {
    const { to, subject, html, text, from } = job.data;
    
    const { data, error } = await resend.emails.send({
      from: from || process.env.RESEND_FROM_EMAIL!,
      to,
      subject,
      html,
      text,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },
  {
    connection: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
    },
    limiter: {
      max: 2, // 2 emails par seconde (rate limit Resend)
      duration: 1000,
    },
  }
);

emailWorker.on('completed', (job, result) => {
  console.log(`[Email Queue] Job ${job.id} completed:`, result.id);
});

emailWorker.on('failed', (job, error) => {
  console.error(`[Email Queue] Job ${job?.id} failed:`, error.message);
});

// Fonction pour ajouter a la queue
export async function queueEmail(data: {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  priority?: number;
}) {
  return emailQueue.add('send', data, {
    priority: data.priority || 5,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
  });
}
```

### 8.3 NestJS Service

```typescript
// src/email/email.service.ts
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService implements OnModuleInit {
  private readonly logger = new Logger(EmailService.name);
  private resend: Resend;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not configured');
    }
    this.resend = new Resend(apiKey);
    this.logger.log('Email service initialized');
  }

  async sendEmail(options: {
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
    from?: string;
  }) {
    const fromEmail = options.from || 
      this.configService.get<string>('RESEND_FROM_EMAIL');

    const { data, error } = await this.resend.emails.send({
      from: fromEmail!,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    if (error) {
      this.logger.error(`Failed to send email: ${error.message}`);
      throw new Error(error.message);
    }

    this.logger.log(`Email sent: ${data.id}`);
    return data;
  }

  async sendVerificationEmail(email: string, token: string) {
    const verifyUrl = `${this.configService.get('APP_URL')}/verify?token=${token}`;
    
    return this.sendEmail({
      to: email,
      subject: 'Verifiez votre adresse email',
      html: `
        <h1>Verification de votre email</h1>
        <p>Cliquez sur le lien ci-dessous pour verifier votre adresse email:</p>
        <a href="${verifyUrl}">Verifier mon email</a>
      `,
    });
  }
}
```

---

## 9. Integration Mobile

### 9.1 React Native (via API Backend)

```typescript
// mobile/services/api.ts
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function requestPasswordReset(email: string) {
  const response = await fetch(`${API_URL}/auth/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error('Failed to request password reset');
  }

  return response.json();
}

export async function subscribeToNewsletter(email: string) {
  const response = await fetch(`${API_URL}/newsletter/subscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error('Failed to subscribe');
  }

  return response.json();
}
```

### 9.2 Backend pour Mobile

```typescript
// server/routes/mobile-email.ts
import { Router } from 'express';
import { resend } from '../services/email/client';
import { rateLimit } from 'express-rate-limit';

const router = Router();

// Rate limiting pour eviter les abus
const emailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requetes par IP
  message: { error: 'Too many requests' },
});

router.post('/auth/reset-password', emailLimiter, async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Email required' });
  }

  // Toujours repondre OK pour eviter enumeration
  res.json({ message: 'If the email exists, a reset link will be sent' });
  
  // Traitement async
  try {
    const user = await findUserByEmail(email);
    if (user) {
      const token = await generateResetToken(user.id);
      await resend.emails.send({
        from: 'Security <security@votreapp.com>',
        to: email,
        subject: 'Reset your password',
        html: `...`,
      });
    }
  } catch (error) {
    console.error('[Mobile Reset] Error:', error);
  }
});

export default router;
```

---

## 10. Bonnes Pratiques

### 10.1 Securite

| Pratique | Description |
|----------|-------------|
| **Variables d'environnement** | JAMAIS stocker les cles API dans le code |
| **Verification webhook** | TOUJOURS verifier la signature des webhooks |
| **Rate limiting** | Implementer cote serveur pour eviter les abus |
| **Permissions minimales** | Utiliser `sending_access` si pas besoin de full_access |
| **Rotation des cles** | Changer les API keys regulierement |

### 10.2 Deliverabilite

| Pratique | Description |
|----------|-------------|
| **SPF/DKIM/DMARC** | Configurer les 3 pour authentification complete |
| **Double opt-in** | Pour listes marketing, confirmer l'inscription |
| **List-Unsubscribe** | Inclure header pour faciliter desabonnement |
| **Bounce handling** | Retirer les emails bounces de la liste |
| **Complaint handling** | Desabonner immediatement sur plainte spam |

### 10.3 Performance

```typescript
// Pattern de retry avec backoff exponentiel
async function sendWithRetry(
  emailConfig: EmailConfig,
  maxRetries = 3
) {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await sendEmail(emailConfig);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown');
      
      // Ne pas retry sur erreurs client (4xx)
      if (lastError.message.includes('400') || 
          lastError.message.includes('401') ||
          lastError.message.includes('403')) {
        throw lastError;
      }
      
      // Backoff exponentiel
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}
```

### 10.4 Monitoring

```typescript
// Metriques a suivre
interface EmailMetrics {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  complained: number;
}

// Alertes recommandees
const ALERT_THRESHOLDS = {
  bounceRate: 0.05,    // > 5% = alerte
  complaintRate: 0.001, // > 0.1% = alerte critique
  deliveryRate: 0.95,  // < 95% = alerte
};
```

---

## 11. Erreurs Courantes et Solutions

### 11.1 Tableau des Erreurs

| Code | Erreur | Cause | Solution |
|------|--------|-------|----------|
| 401 | Unauthorized | API key invalide | Verifier RESEND_API_KEY |
| 403 | Forbidden | Permissions insuffisantes | Utiliser cle full_access |
| 404 | Not Found | Ressource inexistante | Verifier l'ID |
| 422 | Validation Error | Donnees invalides | Verifier le payload |
| 429 | Rate Limited | Trop de requetes | Implementer backoff |

### 11.2 Debugging

```typescript
// Mode debug pour development
if (process.env.NODE_ENV === 'development') {
  console.log('[Email Debug] Payload:', JSON.stringify(payload, null, 2));
}

// Logging structure pour production
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
});

function logEmailEvent(event: string, data: Record<string, any>) {
  logger.info({
    event,
    ...data,
    timestamp: new Date().toISOString(),
  });
}

// Usage
logEmailEvent('email.sent', { 
  emailId: result.id, 
  to: recipient,
  type: 'welcome' 
});
```

---

## 12. Checklist de Production

### Pre-deploiement

- [ ] Domaine verifie avec SPF/DKIM/DMARC
- [ ] API key avec permissions appropriees
- [ ] Variables d'environnement configurees
- [ ] Webhooks configures avec signature
- [ ] Rate limiting implemente
- [ ] Gestion des bounces en place
- [ ] Gestion des complaints en place
- [ ] Templates testes sur differents clients email

### Monitoring

- [ ] Logs structures en place
- [ ] Alertes configurees (bounce rate, delivery rate)
- [ ] Dashboard de suivi des metriques
- [ ] Retention des logs configuree

### Conformite

- [ ] Lien de desabonnement present
- [ ] Double opt-in pour marketing
- [ ] Politique de confidentialite a jour
- [ ] RGPD/CAN-SPAM conforme

---

## 13. Resources

- [Documentation officielle Resend](https://resend.com/docs)
- [API Reference](https://resend.com/docs/api-reference)
- [React Email](https://react.email)
- [Resend SDK Node.js](https://github.com/resend/resend-node)
- [Status Page](https://status.resend.com)

---

## Changelog

### v1.0.0
- Initial release avec couverture complete des fonctionnalites Resend
- Patterns d'implementation pour web, mobile, backend
- Exemples pour Next.js, Express, NestJS
- Guide webhooks complet
- Bonnes pratiques securite et deliverabilite

import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// =============================================================================
// MCP SERVER TYPES & INTERFACES
// =============================================================================

interface MCPTool {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
}

interface MCPRequest {
  method: string;
  params: {
    name?: string;
    arguments?: Record<string, any>;
  };
}

interface MCPResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
}

// =============================================================================
// TOOL DEFINITIONS
// =============================================================================

const tools: MCPTool[] = [
  // ===== EMAILS =====
  {
    name: 'send_email',
    description: 'Send a single email. Supports HTML/text content, attachments, templates, scheduling, and custom headers.',
    inputSchema: {
      type: 'object',
      properties: {
        from: { type: 'string', description: 'Sender email address (e.g., "Your Name <sender@domain.com>")' },
        to: { 
          type: 'array', 
          items: { type: 'string' },
          description: 'Recipient email address(es). Max 50.' 
        },
        subject: { type: 'string', description: 'Email subject' },
        html: { type: 'string', description: 'HTML version of the message' },
        text: { type: 'string', description: 'Plain text version of the message' },
        bcc: { 
          type: 'array', 
          items: { type: 'string' },
          description: 'BCC recipient(s)' 
        },
        cc: { 
          type: 'array', 
          items: { type: 'string' },
          description: 'CC recipient(s)' 
        },
        reply_to: { 
          type: 'array', 
          items: { type: 'string' },
          description: 'Reply-to email address(es)' 
        },
        scheduled_at: { type: 'string', description: 'Schedule email for later (ISO 8601 format)' },
        attachments: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              filename: { type: 'string' },
              content: { type: 'string', description: 'Base64 encoded content' },
              path: { type: 'string', description: 'Path to attachment file' },
              content_type: { type: 'string' }
            }
          }
        },
        tags: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              value: { type: 'string' }
            }
          }
        },
        headers: { type: 'object', description: 'Custom email headers' }
      },
      required: ['from', 'to', 'subject']
    }
  },
  {
    name: 'send_batch_emails',
    description: 'Send up to 100 emails at once in a batch.',
    inputSchema: {
      type: 'object',
      properties: {
        emails: {
          type: 'array',
          description: 'Array of email objects to send',
          items: {
            type: 'object',
            properties: {
              from: { type: 'string' },
              to: { type: 'array', items: { type: 'string' } },
              subject: { type: 'string' },
              html: { type: 'string' },
              text: { type: 'string' }
            },
            required: ['from', 'to', 'subject']
          }
        }
      },
      required: ['emails']
    }
  },
  {
    name: 'list_emails',
    description: 'Retrieve a list of sent emails with pagination support.',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Number of items to return (1-100)' },
        after: { type: 'string', description: 'Return items after this cursor' },
        before: { type: 'string', description: 'Return items before this cursor' }
      }
    }
  },
  {
    name: 'get_email',
    description: 'Retrieve details of a single sent email by its ID.',
    inputSchema: {
      type: 'object',
      properties: {
        email_id: { type: 'string', description: 'The email ID' }
      },
      required: ['email_id']
    }
  },
  {
    name: 'update_email',
    description: 'Update a scheduled email (reschedule or modify).',
    inputSchema: {
      type: 'object',
      properties: {
        email_id: { type: 'string', description: 'The email ID' },
        scheduled_at: { type: 'string', description: 'New schedule time (ISO 8601 format)' }
      },
      required: ['email_id']
    }
  },
  {
    name: 'cancel_email',
    description: 'Cancel a scheduled email before it is sent.',
    inputSchema: {
      type: 'object',
      properties: {
        email_id: { type: 'string', description: 'The email ID to cancel' }
      },
      required: ['email_id']
    }
  },
  {
    name: 'list_email_attachments',
    description: 'Retrieve a list of attachments for a sent email.',
    inputSchema: {
      type: 'object',
      properties: {
        email_id: { type: 'string', description: 'The email ID' },
        limit: { type: 'number', description: 'Max number of attachments to return' },
        after: { type: 'string', description: 'Pagination cursor' },
        before: { type: 'string', description: 'Pagination cursor' }
      },
      required: ['email_id']
    }
  },
  {
    name: 'get_email_attachment',
    description: 'Retrieve a single attachment from a sent email.',
    inputSchema: {
      type: 'object',
      properties: {
        email_id: { type: 'string', description: 'The email ID' },
        attachment_id: { type: 'string', description: 'The attachment ID' }
      },
      required: ['email_id', 'attachment_id']
    }
  },

  // ===== RECEIVING EMAILS =====
  {
    name: 'list_received_emails',
    description: 'Retrieve a list of received emails.',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Max number of received emails to return' },
        after: { type: 'string', description: 'Pagination cursor' },
        before: { type: 'string', description: 'Pagination cursor' }
      }
    }
  },
  {
    name: 'get_received_email',
    description: 'Retrieve details of a single received email.',
    inputSchema: {
      type: 'object',
      properties: {
        email_id: { type: 'string', description: 'The received email ID' }
      },
      required: ['email_id']
    }
  },
  {
    name: 'list_received_email_attachments',
    description: 'Retrieve attachments for a received email.',
    inputSchema: {
      type: 'object',
      properties: {
        email_id: { type: 'string', description: 'The received email ID' },
        limit: { type: 'number' },
        after: { type: 'string' },
        before: { type: 'string' }
      },
      required: ['email_id']
    }
  },
  {
    name: 'get_received_email_attachment',
    description: 'Retrieve a single attachment from a received email.',
    inputSchema: {
      type: 'object',
      properties: {
        email_id: { type: 'string', description: 'The received email ID' },
        attachment_id: { type: 'string', description: 'The attachment ID' }
      },
      required: ['email_id', 'attachment_id']
    }
  },

  // ===== DOMAINS =====
  {
    name: 'create_domain',
    description: 'Add a new domain to your Resend account.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'The domain name (e.g., "example.com")' },
        region: { type: 'string', description: 'Domain region (us-east-1, eu-west-1, sa-east-1)' }
      },
      required: ['name']
    }
  },
  {
    name: 'list_domains',
    description: 'Retrieve all domains in your account.',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'get_domain',
    description: 'Retrieve details of a specific domain.',
    inputSchema: {
      type: 'object',
      properties: {
        domain_id: { type: 'string', description: 'The domain ID' }
      },
      required: ['domain_id']
    }
  },
  {
    name: 'update_domain',
    description: 'Update domain settings (e.g., enable/disable tracking).',
    inputSchema: {
      type: 'object',
      properties: {
        domain_id: { type: 'string', description: 'The domain ID' },
        open_tracking: { type: 'boolean', description: 'Enable/disable open tracking' },
        click_tracking: { type: 'boolean', description: 'Enable/disable click tracking' }
      },
      required: ['domain_id']
    }
  },
  {
    name: 'delete_domain',
    description: 'Remove a domain from your account.',
    inputSchema: {
      type: 'object',
      properties: {
        domain_id: { type: 'string', description: 'The domain ID to delete' }
      },
      required: ['domain_id']
    }
  },
  {
    name: 'verify_domain',
    description: 'Verify domain DNS records.',
    inputSchema: {
      type: 'object',
      properties: {
        domain_id: { type: 'string', description: 'The domain ID to verify' }
      },
      required: ['domain_id']
    }
  },

  // ===== API KEYS =====
  {
    name: 'create_api_key',
    description: 'Create a new API key for your account.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Name for the API key' },
        permission: { type: 'string', description: 'Permission level (full_access, sending_access)' }
      },
      required: ['name']
    }
  },
  {
    name: 'list_api_keys',
    description: 'Retrieve all API keys in your account.',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'delete_api_key',
    description: 'Revoke an API key.',
    inputSchema: {
      type: 'object',
      properties: {
        api_key_id: { type: 'string', description: 'The API key ID to delete' }
      },
      required: ['api_key_id']
    }
  },

  // ===== AUDIENCES =====
  {
    name: 'create_audience',
    description: 'Create a new contact audience (mailing list).',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Name of the audience' }
      },
      required: ['name']
    }
  },
  {
    name: 'list_audiences',
    description: 'Retrieve all audiences in your account.',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'get_audience',
    description: 'Retrieve details of a specific audience.',
    inputSchema: {
      type: 'object',
      properties: {
        audience_id: { type: 'string', description: 'The audience ID' }
      },
      required: ['audience_id']
    }
  },
  {
    name: 'delete_audience',
    description: 'Delete an audience.',
    inputSchema: {
      type: 'object',
      properties: {
        audience_id: { type: 'string', description: 'The audience ID to delete' }
      },
      required: ['audience_id']
    }
  },

  // ===== CONTACTS =====
  {
    name: 'create_contact',
    description: 'Add a new contact to an audience.',
    inputSchema: {
      type: 'object',
      properties: {
        audience_id: { type: 'string', description: 'The audience ID' },
        email: { type: 'string', description: 'Contact email address' },
        first_name: { type: 'string', description: 'Contact first name' },
        last_name: { type: 'string', description: 'Contact last name' },
        unsubscribed: { type: 'boolean', description: 'Unsubscribed status' }
      },
      required: ['audience_id', 'email']
    }
  },
  {
    name: 'list_contacts',
    description: 'Retrieve all contacts in an audience.',
    inputSchema: {
      type: 'object',
      properties: {
        audience_id: { type: 'string', description: 'The audience ID' }
      },
      required: ['audience_id']
    }
  },
  {
    name: 'get_contact_by_email',
    description: 'Retrieve a contact by email address.',
    inputSchema: {
      type: 'object',
      properties: {
        audience_id: { type: 'string', description: 'The audience ID' },
        email: { type: 'string', description: 'The contact email' }
      },
      required: ['audience_id', 'email']
    }
  },
  {
    name: 'get_contact_by_id',
    description: 'Retrieve a contact by ID.',
    inputSchema: {
      type: 'object',
      properties: {
        audience_id: { type: 'string', description: 'The audience ID' },
        contact_id: { type: 'string', description: 'The contact ID' }
      },
      required: ['audience_id', 'contact_id']
    }
  },
  {
    name: 'update_contact_by_email',
    description: 'Update a contact by email address.',
    inputSchema: {
      type: 'object',
      properties: {
        audience_id: { type: 'string', description: 'The audience ID' },
        email: { type: 'string', description: 'The contact email' },
        first_name: { type: 'string' },
        last_name: { type: 'string' },
        unsubscribed: { type: 'boolean' }
      },
      required: ['audience_id', 'email']
    }
  },
  {
    name: 'update_contact_by_id',
    description: 'Update a contact by ID.',
    inputSchema: {
      type: 'object',
      properties: {
        audience_id: { type: 'string', description: 'The audience ID' },
        contact_id: { type: 'string', description: 'The contact ID' },
        first_name: { type: 'string' },
        last_name: { type: 'string' },
        unsubscribed: { type: 'boolean' }
      },
      required: ['audience_id', 'contact_id']
    }
  },
  {
    name: 'delete_contact_by_email',
    description: 'Delete a contact by email address.',
    inputSchema: {
      type: 'object',
      properties: {
        audience_id: { type: 'string', description: 'The audience ID' },
        email: { type: 'string', description: 'The contact email to delete' }
      },
      required: ['audience_id', 'email']
    }
  },
  {
    name: 'delete_contact_by_id',
    description: 'Delete a contact by ID.',
    inputSchema: {
      type: 'object',
      properties: {
        audience_id: { type: 'string', description: 'The audience ID' },
        contact_id: { type: 'string', description: 'The contact ID to delete' }
      },
      required: ['audience_id', 'contact_id']
    }
  },
  {
    name: 'add_contact_to_segment',
    description: 'Add a contact to a specific segment.',
    inputSchema: {
      type: 'object',
      properties: {
        audience_id: { type: 'string', description: 'The audience ID' },
        contact_id: { type: 'string', description: 'The contact ID' },
        segment_id: { type: 'string', description: 'The segment ID' }
      },
      required: ['audience_id', 'contact_id', 'segment_id']
    }
  },
  {
    name: 'remove_contact_from_segment',
    description: 'Remove a contact from a segment.',
    inputSchema: {
      type: 'object',
      properties: {
        audience_id: { type: 'string', description: 'The audience ID' },
        contact_id: { type: 'string', description: 'The contact ID' },
        segment_id: { type: 'string', description: 'The segment ID' }
      },
      required: ['audience_id', 'contact_id', 'segment_id']
    }
  },
  {
    name: 'list_contact_segments',
    description: 'List all segments a contact belongs to.',
    inputSchema: {
      type: 'object',
      properties: {
        audience_id: { type: 'string', description: 'The audience ID' },
        contact_id: { type: 'string', description: 'The contact ID' },
        limit: { type: 'number' },
        after: { type: 'string' },
        before: { type: 'string' }
      },
      required: ['audience_id', 'contact_id']
    }
  },
  {
    name: 'get_contact_topics',
    description: 'Retrieve topic subscriptions for a contact.',
    inputSchema: {
      type: 'object',
      properties: {
        audience_id: { type: 'string', description: 'The audience ID' },
        contact_id: { type: 'string', description: 'The contact ID' },
        limit: { type: 'number' },
        after: { type: 'string' },
        before: { type: 'string' }
      },
      required: ['audience_id', 'contact_id']
    }
  },
  {
    name: 'update_contact_topics',
    description: 'Update a contact\'s topic subscriptions.',
    inputSchema: {
      type: 'object',
      properties: {
        audience_id: { type: 'string', description: 'The audience ID' },
        contact_id: { type: 'string', description: 'The contact ID' },
        topics: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              subscribed: { type: 'boolean' }
            }
          }
        }
      },
      required: ['audience_id', 'contact_id', 'topics']
    }
  },

  // ===== TEMPLATES =====
  {
    name: 'create_template',
    description: 'Create a new email template.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Template name' },
        alias: { type: 'string', description: 'Template alias' },
        from: { type: 'string', description: 'Default sender email' },
        subject: { type: 'string', description: 'Email subject' },
        reply_to: { type: 'array', items: { type: 'string' } },
        html: { type: 'string', description: 'HTML content' },
        text: { type: 'string', description: 'Plain text content' },
        variables: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              key: { type: 'string' },
              type: { type: 'string' },
              fallback_value: {}
            }
          }
        }
      },
      required: ['name', 'html']
    }
  },
  {
    name: 'list_templates',
    description: 'Retrieve all email templates.',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number' },
        after: { type: 'string' },
        before: { type: 'string' }
      }
    }
  },
  {
    name: 'get_template',
    description: 'Retrieve a specific template by ID or alias.',
    inputSchema: {
      type: 'object',
      properties: {
        template_id: { type: 'string', description: 'Template ID or alias' }
      },
      required: ['template_id']
    }
  },
  {
    name: 'update_template',
    description: 'Update an existing template.',
    inputSchema: {
      type: 'object',
      properties: {
        template_id: { type: 'string', description: 'Template ID or alias' },
        name: { type: 'string' },
        alias: { type: 'string' },
        from: { type: 'string' },
        subject: { type: 'string' },
        reply_to: { type: 'array', items: { type: 'string' } },
        html: { type: 'string' },
        text: { type: 'string' }
      },
      required: ['template_id']
    }
  },
  {
    name: 'delete_template',
    description: 'Delete a template.',
    inputSchema: {
      type: 'object',
      properties: {
        template_id: { type: 'string', description: 'Template ID or alias to delete' }
      },
      required: ['template_id']
    }
  },
  {
    name: 'publish_template',
    description: 'Publish a draft template.',
    inputSchema: {
      type: 'object',
      properties: {
        template_id: { type: 'string', description: 'Template ID or alias to publish' }
      },
      required: ['template_id']
    }
  },
  {
    name: 'duplicate_template',
    description: 'Duplicate an existing template.',
    inputSchema: {
      type: 'object',
      properties: {
        template_id: { type: 'string', description: 'Template ID or alias to duplicate' }
      },
      required: ['template_id']
    }
  },

  // ===== BROADCASTS =====
  {
    name: 'create_broadcast',
    description: 'Create a new email broadcast campaign.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Broadcast name' },
        segment_id: { type: 'string', description: 'Segment ID to send to' },
        from: { type: 'string', description: 'Sender email' },
        subject: { type: 'string', description: 'Email subject' },
        reply_to: { type: 'array', items: { type: 'string' } },
        preview_text: { type: 'string' },
        html: { type: 'string' },
        text: { type: 'string' },
        send: { type: 'boolean', description: 'Send immediately or keep as draft' },
        scheduled_at: { type: 'string', description: 'Schedule time (ISO 8601)' }
      },
      required: ['from', 'subject', 'segment_id']
    }
  },
  {
    name: 'list_broadcasts',
    description: 'Retrieve all broadcasts.',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'get_broadcast',
    description: 'Retrieve details of a specific broadcast.',
    inputSchema: {
      type: 'object',
      properties: {
        broadcast_id: { type: 'string', description: 'The broadcast ID' }
      },
      required: ['broadcast_id']
    }
  },
  {
    name: 'update_broadcast',
    description: 'Update a draft broadcast.',
    inputSchema: {
      type: 'object',
      properties: {
        broadcast_id: { type: 'string', description: 'The broadcast ID' },
        name: { type: 'string' },
        segment_id: { type: 'string' },
        from: { type: 'string' },
        subject: { type: 'string' },
        reply_to: { type: 'array', items: { type: 'string' } },
        preview_text: { type: 'string' },
        html: { type: 'string' },
        text: { type: 'string' }
      },
      required: ['broadcast_id']
    }
  },
  {
    name: 'delete_broadcast',
    description: 'Delete a draft broadcast.',
    inputSchema: {
      type: 'object',
      properties: {
        broadcast_id: { type: 'string', description: 'The broadcast ID to delete' }
      },
      required: ['broadcast_id']
    }
  },
  {
    name: 'send_broadcast',
    description: 'Send or schedule a broadcast.',
    inputSchema: {
      type: 'object',
      properties: {
        broadcast_id: { type: 'string', description: 'The broadcast ID' },
        scheduled_at: { type: 'string', description: 'Schedule time (ISO 8601)' }
      },
      required: ['broadcast_id']
    }
  },

  // ===== WEBHOOKS =====
  {
    name: 'create_webhook',
    description: 'Create a new webhook endpoint.',
    inputSchema: {
      type: 'object',
      properties: {
        endpoint: { type: 'string', description: 'Webhook URL' },
        events: { 
          type: 'array', 
          items: { type: 'string' },
          description: 'Events to subscribe to (e.g., email.sent, email.delivered)'
        }
      },
      required: ['endpoint', 'events']
    }
  },
  {
    name: 'list_webhooks',
    description: 'Retrieve all webhooks.',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number' },
        after: { type: 'string' },
        before: { type: 'string' }
      }
    }
  },
  {
    name: 'get_webhook',
    description: 'Retrieve details of a specific webhook.',
    inputSchema: {
      type: 'object',
      properties: {
        webhook_id: { type: 'string', description: 'The webhook ID' }
      },
      required: ['webhook_id']
    }
  },
  {
    name: 'update_webhook',
    description: 'Update a webhook configuration.',
    inputSchema: {
      type: 'object',
      properties: {
        webhook_id: { type: 'string', description: 'The webhook ID' },
        endpoint: { type: 'string' },
        events: { type: 'array', items: { type: 'string' } },
        status: { type: 'string', description: 'enabled or disabled' }
      },
      required: ['webhook_id']
    }
  },
  {
    name: 'delete_webhook',
    description: 'Delete a webhook.',
    inputSchema: {
      type: 'object',
      properties: {
        webhook_id: { type: 'string', description: 'The webhook ID to delete' }
      },
      required: ['webhook_id']
    }
  },

  // ===== SEGMENTS =====
  {
    name: 'create_segment',
    description: 'Create a new audience segment.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Segment name' },
        audience_id: { type: 'string', description: 'Audience ID' },
        filter: { type: 'object', description: 'Filter conditions' }
      },
      required: ['name', 'audience_id']
    }
  },
  {
    name: 'list_segments',
    description: 'Retrieve all segments.',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number' },
        after: { type: 'string' },
        before: { type: 'string' }
      }
    }
  },
  {
    name: 'get_segment',
    description: 'Retrieve details of a specific segment.',
    inputSchema: {
      type: 'object',
      properties: {
        segment_id: { type: 'string', description: 'The segment ID' }
      },
      required: ['segment_id']
    }
  },
  {
    name: 'delete_segment',
    description: 'Delete a segment.',
    inputSchema: {
      type: 'object',
      properties: {
        segment_id: { type: 'string', description: 'The segment ID to delete' }
      },
      required: ['segment_id']
    }
  },

  // ===== TOPICS =====
  {
    name: 'create_topic',
    description: 'Create a new subscription topic.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Topic name' },
        audience_id: { type: 'string', description: 'Audience ID' }
      },
      required: ['name', 'audience_id']
    }
  },
  {
    name: 'list_topics',
    description: 'Retrieve all topics.',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number' },
        after: { type: 'string' },
        before: { type: 'string' }
      }
    }
  },
  {
    name: 'get_topic',
    description: 'Retrieve details of a specific topic.',
    inputSchema: {
      type: 'object',
      properties: {
        topic_id: { type: 'string', description: 'The topic ID' }
      },
      required: ['topic_id']
    }
  },
  {
    name: 'update_topic',
    description: 'Update a topic name.',
    inputSchema: {
      type: 'object',
      properties: {
        topic_id: { type: 'string', description: 'The topic ID' },
        name: { type: 'string', description: 'New topic name' }
      },
      required: ['topic_id', 'name']
    }
  },
  {
    name: 'delete_topic',
    description: 'Delete a topic.',
    inputSchema: {
      type: 'object',
      properties: {
        topic_id: { type: 'string', description: 'The topic ID to delete' }
      },
      required: ['topic_id']
    }
  },

  // ===== CONTACT PROPERTIES =====
  {
    name: 'create_contact_property',
    description: 'Create a new custom contact property.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Property name' },
        type: { type: 'string', description: 'Property type (string, number, boolean, date)' },
        description: { type: 'string' }
      },
      required: ['name', 'type']
    }
  },
  {
    name: 'list_contact_properties',
    description: 'Retrieve all contact properties.',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number' },
        after: { type: 'string' },
        before: { type: 'string' }
      }
    }
  },
  {
    name: 'get_contact_property',
    description: 'Retrieve details of a specific contact property.',
    inputSchema: {
      type: 'object',
      properties: {
        property_id: { type: 'string', description: 'The contact property ID' }
      },
      required: ['property_id']
    }
  },
  {
    name: 'update_contact_property',
    description: 'Update a contact property.',
    inputSchema: {
      type: 'object',
      properties: {
        property_id: { type: 'string', description: 'The contact property ID' },
        name: { type: 'string' },
        description: { type: 'string' }
      },
      required: ['property_id']
    }
  },
  {
    name: 'delete_contact_property',
    description: 'Delete a contact property.',
    inputSchema: {
      type: 'object',
      properties: {
        property_id: { type: 'string', description: 'The contact property ID to delete' }
      },
      required: ['property_id']
    }
  }
];

// =============================================================================
// TOOL HANDLERS
// =============================================================================

async function handleToolCall(name: string, args: Record<string, any>): Promise<any> {
  try {
    // Direct API calls using fetch for endpoints not covered by SDK
    const API_BASE = 'https://api.resend.com';
    const headers = {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    };

    switch (name) {
      // ===== EMAILS =====
      case 'send_email':
        return await resend.emails.send(args as any);
      
      case 'send_batch_emails':
        return await resend.batch.send(args.emails);
      
      case 'list_emails': {
        const params = new URLSearchParams();
        if (args.limit) params.append('limit', args.limit.toString());
        if (args.after) params.append('after', args.after);
        if (args.before) params.append('before', args.before);
        const response = await fetch(`${API_BASE}/emails?${params}`, { headers });
        return await response.json();
      }
      
      case 'get_email': {
        const response = await fetch(`${API_BASE}/emails/${args.email_id}`, { headers });
        return await response.json();
      }
      
      case 'update_email': {
        const response = await fetch(`${API_BASE}/emails/${args.email_id}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify({ scheduled_at: args.scheduled_at })
        });
        return await response.json();
      }
      
      case 'cancel_email': {
        const response = await fetch(`${API_BASE}/emails/${args.email_id}/cancel`, {
          method: 'POST',
          headers
        });
        return await response.json();
      }
      
      case 'list_email_attachments': {
        const params = new URLSearchParams();
        if (args.limit) params.append('limit', args.limit.toString());
        if (args.after) params.append('after', args.after);
        if (args.before) params.append('before', args.before);
        const response = await fetch(`${API_BASE}/emails/${args.email_id}/attachments?${params}`, { headers });
        return await response.json();
      }
      
      case 'get_email_attachment': {
        const response = await fetch(`${API_BASE}/emails/${args.email_id}/attachments/${args.attachment_id}`, { headers });
        return await response.json();
      }

      // ===== RECEIVING EMAILS =====
      case 'list_received_emails': {
        const params = new URLSearchParams();
        if (args.limit) params.append('limit', args.limit.toString());
        if (args.after) params.append('after', args.after);
        if (args.before) params.append('before', args.before);
        const response = await fetch(`${API_BASE}/emails/receiving?${params}`, { headers });
        return await response.json();
      }
      
      case 'get_received_email': {
        const response = await fetch(`${API_BASE}/emails/receiving/${args.email_id}`, { headers });
        return await response.json();
      }
      
      case 'list_received_email_attachments': {
        const params = new URLSearchParams();
        if (args.limit) params.append('limit', args.limit.toString());
        if (args.after) params.append('after', args.after);
        if (args.before) params.append('before', args.before);
        const response = await fetch(`${API_BASE}/emails/receiving/${args.email_id}/attachments?${params}`, { headers });
        return await response.json();
      }
      
      case 'get_received_email_attachment': {
        const response = await fetch(`${API_BASE}/emails/receiving/${args.email_id}/attachments/${args.attachment_id}`, { headers });
        return await response.json();
      }

      // ===== DOMAINS =====
      case 'create_domain':
        return await resend.domains.create(args as any);
      
      case 'list_domains':
        return await resend.domains.list();
      
      case 'get_domain':
        return await resend.domains.get(args.domain_id);
      
      case 'update_domain': {
        const response = await fetch(`${API_BASE}/domains/${args.domain_id}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify({
            open_tracking: args.open_tracking,
            click_tracking: args.click_tracking
          })
        });
        return await response.json();
      }
      
      case 'delete_domain':
        return await resend.domains.remove(args.domain_id);
      
      case 'verify_domain':
        return await resend.domains.verify(args.domain_id);

      // ===== API KEYS =====
      case 'create_api_key':
        return await resend.apiKeys.create(args as any);
      
      case 'list_api_keys':
        return await resend.apiKeys.list();
      
      case 'delete_api_key':
        return await resend.apiKeys.remove(args.api_key_id);

      // ===== AUDIENCES =====
      case 'create_audience':
        return await resend.audiences.create(args as any);
      
      case 'list_audiences':
        return await resend.audiences.list();
      
      case 'get_audience':
        return await resend.audiences.get(args.audience_id);
      
      case 'delete_audience':
        return await resend.audiences.remove(args.audience_id);

      // ===== CONTACTS =====
      case 'create_contact':
        return await resend.contacts.create({
          audienceId: args.audience_id,
          email: args.email,
          firstName: args.first_name,
          lastName: args.last_name,
          unsubscribed: args.unsubscribed
        });
      
      case 'list_contacts':
        return await resend.contacts.list(args.audience_id);
      
      case 'get_contact_by_email': {
        const response = await fetch(`${API_BASE}/audiences/${args.audience_id}/contacts/${args.email}`, { headers });
        return await response.json();
      }
      
      case 'get_contact_by_id': {
        const response = await fetch(`${API_BASE}/audiences/${args.audience_id}/contacts/${args.contact_id}`, { headers });
        return await response.json();
      }
      
      case 'update_contact_by_email': {
        const response = await fetch(`${API_BASE}/audiences/${args.audience_id}/contacts/${args.email}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify({
            first_name: args.first_name,
            last_name: args.last_name,
            unsubscribed: args.unsubscribed
          })
        });
        return await response.json();
      }
      
      case 'update_contact_by_id':
        return await resend.contacts.update({
          audienceId: args.audience_id,
          id: args.contact_id,
          firstName: args.first_name,
          lastName: args.last_name,
          unsubscribed: args.unsubscribed
        });
      
      case 'delete_contact_by_email': {
        const response = await fetch(`${API_BASE}/audiences/${args.audience_id}/contacts/${args.email}`, {
          method: 'DELETE',
          headers
        });
        return await response.json();
      }
      
      case 'delete_contact_by_id':
        return await resend.contacts.remove({
          audienceId: args.audience_id,
          id: args.contact_id
        });
      
      case 'add_contact_to_segment': {
        const response = await fetch(`${API_BASE}/audiences/${args.audience_id}/contacts/${args.contact_id}/segments`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ segment_id: args.segment_id })
        });
        return await response.json();
      }
      
      case 'remove_contact_from_segment': {
        const response = await fetch(`${API_BASE}/audiences/${args.audience_id}/contacts/${args.contact_id}/segments/${args.segment_id}`, {
          method: 'DELETE',
          headers
        });
        return await response.json();
      }
      
      case 'list_contact_segments': {
        const params = new URLSearchParams();
        if (args.limit) params.append('limit', args.limit.toString());
        if (args.after) params.append('after', args.after);
        if (args.before) params.append('before', args.before);
        const response = await fetch(`${API_BASE}/audiences/${args.audience_id}/contacts/${args.contact_id}/segments?${params}`, { headers });
        return await response.json();
      }
      
      case 'get_contact_topics': {
        const params = new URLSearchParams();
        if (args.limit) params.append('limit', args.limit.toString());
        if (args.after) params.append('after', args.after);
        if (args.before) params.append('before', args.before);
        const response = await fetch(`${API_BASE}/audiences/${args.audience_id}/contacts/${args.contact_id}/topics?${params}`, { headers });
        return await response.json();
      }
      
      case 'update_contact_topics': {
        const response = await fetch(`${API_BASE}/audiences/${args.audience_id}/contacts/${args.contact_id}/topics`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify({ topics: args.topics })
        });
        return await response.json();
      }

      // ===== TEMPLATES =====
      case 'create_template': {
        const response = await fetch(`${API_BASE}/templates`, {
          method: 'POST',
          headers,
          body: JSON.stringify(args)
        });
        return await response.json();
      }
      
      case 'list_templates': {
        const params = new URLSearchParams();
        if (args.limit) params.append('limit', args.limit.toString());
        if (args.after) params.append('after', args.after);
        if (args.before) params.append('before', args.before);
        const response = await fetch(`${API_BASE}/templates?${params}`, { headers });
        return await response.json();
      }
      
      case 'get_template': {
        const response = await fetch(`${API_BASE}/templates/${args.template_id}`, { headers });
        return await response.json();
      }
      
      case 'update_template': {
        const { template_id, ...updateData } = args;
        const response = await fetch(`${API_BASE}/templates/${template_id}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify(updateData)
        });
        return await response.json();
      }
      
      case 'delete_template': {
        const response = await fetch(`${API_BASE}/templates/${args.template_id}`, {
          method: 'DELETE',
          headers
        });
        return await response.json();
      }
      
      case 'publish_template': {
        const response = await fetch(`${API_BASE}/templates/${args.template_id}/publish`, {
          method: 'POST',
          headers
        });
        return await response.json();
      }
      
      case 'duplicate_template': {
        const response = await fetch(`${API_BASE}/templates/${args.template_id}/duplicate`, {
          method: 'POST',
          headers
        });
        return await response.json();
      }

      // ===== BROADCASTS =====
      case 'create_broadcast': {
        const response = await fetch(`${API_BASE}/broadcasts`, {
          method: 'POST',
          headers,
          body: JSON.stringify(args)
        });
        return await response.json();
      }
      
      case 'list_broadcasts': {
        const response = await fetch(`${API_BASE}/broadcasts`, { headers });
        return await response.json();
      }
      
      case 'get_broadcast': {
        const response = await fetch(`${API_BASE}/broadcasts/${args.broadcast_id}`, { headers });
        return await response.json();
      }
      
      case 'update_broadcast': {
        const { broadcast_id, ...updateData } = args;
        const response = await fetch(`${API_BASE}/broadcasts/${broadcast_id}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify(updateData)
        });
        return await response.json();
      }
      
      case 'delete_broadcast': {
        const response = await fetch(`${API_BASE}/broadcasts/${args.broadcast_id}`, {
          method: 'DELETE',
          headers
        });
        return await response.json();
      }
      
      case 'send_broadcast': {
        const response = await fetch(`${API_BASE}/broadcasts/${args.broadcast_id}/send`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ scheduled_at: args.scheduled_at })
        });
        return await response.json();
      }

      // ===== WEBHOOKS =====
      case 'create_webhook': {
        const response = await fetch(`${API_BASE}/webhooks`, {
          method: 'POST',
          headers,
          body: JSON.stringify(args)
        });
        return await response.json();
      }
      
      case 'list_webhooks': {
        const params = new URLSearchParams();
        if (args.limit) params.append('limit', args.limit.toString());
        if (args.after) params.append('after', args.after);
        if (args.before) params.append('before', args.before);
        const response = await fetch(`${API_BASE}/webhooks?${params}`, { headers });
        return await response.json();
      }
      
      case 'get_webhook': {
        const response = await fetch(`${API_BASE}/webhooks/${args.webhook_id}`, { headers });
        return await response.json();
      }
      
      case 'update_webhook': {
        const { webhook_id, ...updateData } = args;
        const response = await fetch(`${API_BASE}/webhooks/${webhook_id}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify(updateData)
        });
        return await response.json();
      }
      
      case 'delete_webhook': {
        const response = await fetch(`${API_BASE}/webhooks/${args.webhook_id}`, {
          method: 'DELETE',
          headers
        });
        return await response.json();
      }

      // ===== SEGMENTS =====
      case 'create_segment': {
        const response = await fetch(`${API_BASE}/segments`, {
          method: 'POST',
          headers,
          body: JSON.stringify(args)
        });
        return await response.json();
      }
      
      case 'list_segments': {
        const params = new URLSearchParams();
        if (args.limit) params.append('limit', args.limit.toString());
        if (args.after) params.append('after', args.after);
        if (args.before) params.append('before', args.before);
        const response = await fetch(`${API_BASE}/segments?${params}`, { headers });
        return await response.json();
      }
      
      case 'get_segment': {
        const response = await fetch(`${API_BASE}/segments/${args.segment_id}`, { headers });
        return await response.json();
      }
      
      case 'delete_segment': {
        const response = await fetch(`${API_BASE}/segments/${args.segment_id}`, {
          method: 'DELETE',
          headers
        });
        return await response.json();
      }

      // ===== TOPICS =====
      case 'create_topic': {
        const response = await fetch(`${API_BASE}/topics`, {
          method: 'POST',
          headers,
          body: JSON.stringify(args)
        });
        return await response.json();
      }
      
      case 'list_topics': {
        const params = new URLSearchParams();
        if (args.limit) params.append('limit', args.limit.toString());
        if (args.after) params.append('after', args.after);
        if (args.before) params.append('before', args.before);
        const response = await fetch(`${API_BASE}/topics?${params}`, { headers });
        return await response.json();
      }
      
      case 'get_topic': {
        const response = await fetch(`${API_BASE}/topics/${args.topic_id}`, { headers });
        return await response.json();
      }
      
      case 'update_topic': {
        const { topic_id, ...updateData } = args;
        const response = await fetch(`${API_BASE}/topics/${topic_id}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify(updateData)
        });
        return await response.json();
      }
      
      case 'delete_topic': {
        const response = await fetch(`${API_BASE}/topics/${args.topic_id}`, {
          method: 'DELETE',
          headers
        });
        return await response.json();
      }

      // ===== CONTACT PROPERTIES =====
      case 'create_contact_property': {
        const response = await fetch(`${API_BASE}/contact-properties`, {
          method: 'POST',
          headers,
          body: JSON.stringify(args)
        });
        return await response.json();
      }
      
      case 'list_contact_properties': {
        const params = new URLSearchParams();
        if (args.limit) params.append('limit', args.limit.toString());
        if (args.after) params.append('after', args.after);
        if (args.before) params.append('before', args.before);
        const response = await fetch(`${API_BASE}/contact-properties?${params}`, { headers });
        return await response.json();
      }
      
      case 'get_contact_property': {
        const response = await fetch(`${API_BASE}/contact-properties/${args.property_id}`, { headers });
        return await response.json();
      }
      
      case 'update_contact_property': {
        const { property_id, ...updateData } = args;
        const response = await fetch(`${API_BASE}/contact-properties/${property_id}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify(updateData)
        });
        return await response.json();
      }
      
      case 'delete_contact_property': {
        const response = await fetch(`${API_BASE}/contact-properties/${args.property_id}`, {
          method: 'DELETE',
          headers
        });
        return await response.json();
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    throw new Error(`Tool execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// =============================================================================
// MCP SERVER IMPLEMENTATION
// =============================================================================

const server = {
  name: 'resend-full-mcp',
  version: '1.0.0',
  
  async listTools(): Promise<{ tools: MCPTool[] }> {
    return { tools };
  },
  
  async callTool(request: MCPRequest): Promise<MCPResponse> {
    const toolName = request.params.name;
    const args = request.params.arguments || {};
    
    if (!toolName) {
      throw new Error('Tool name is required');
    }
    
    try {
      const result = await handleToolCall(toolName, args);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(result, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            error: error instanceof Error ? error.message : 'Unknown error occurred',
            tool: toolName,
            arguments: args
          }, null, 2)
        }]
      };
    }
  }
};

// =============================================================================
// START SERVER
// =============================================================================

async function main() {
  if (!process.env.RESEND_API_KEY) {
    console.error('Error: RESEND_API_KEY environment variable is not set');
    console.error('Please create a .env file with your Resend API key:');
    console.error('RESEND_API_KEY=re_your_api_key_here');
    process.exit(1);
  }
  
  console.log('🚀 Resend Full MCP Server Started');
  console.log(`📧 Loaded ${tools.length} tools covering all Resend API features`);
  console.log('');
  console.log('Available modules:');
  console.log('  • Emails (8 tools)');
  console.log('  • Receiving Emails (4 tools)');
  console.log('  • Domains (6 tools)');
  console.log('  • API Keys (3 tools)');
  console.log('  • Audiences (4 tools)');
  console.log('  • Contacts (13 tools)');
  console.log('  • Templates (7 tools)');
  console.log('  • Broadcasts (6 tools)');
  console.log('  • Webhooks (5 tools)');
  console.log('  • Segments (4 tools)');
  console.log('  • Topics (5 tools)');
  console.log('  • Contact Properties (5 tools)');
  console.log('');
  console.log('Server ready to accept requests via stdio');
  
  // Handle stdio communication
  process.stdin.on('data', async (data) => {
    try {
      const request = JSON.parse(data.toString());
      let response;
      
      if (request.method === 'tools/list') {
        response = await server.listTools();
      } else if (request.method === 'tools/call') {
        response = await server.callTool(request);
      } else {
        response = { error: 'Unknown method' };
      }
      
      process.stdout.write(JSON.stringify(response) + '\n');
    } catch (error) {
      process.stdout.write(JSON.stringify({
        error: error instanceof Error ? error.message : 'Request processing failed'
      }) + '\n');
    }
  });
}

// Start the server
main().catch(console.error);

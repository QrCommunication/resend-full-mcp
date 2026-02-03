# Resend Full MCP Server

A comprehensive Model Context Protocol (MCP) server that provides 100% coverage of the Resend API, enabling AI assistants to send emails, manage domains, configure webhooks, handle contacts and audiences, and more.

## Overview

This MCP server exposes the complete Resend API functionality through the Model Context Protocol, allowing AI assistants and LLM applications to seamlessly integrate with Resend's powerful email infrastructure. Whether you need to send transactional emails, manage broadcast campaigns, or configure domain settings, this server provides all the tools you need.

## Features

### 🎯 100% API Coverage

This MCP server implements **all** endpoints from the Resend API:

#### 📧 Email Operations
- **Send Email** - Send individual transactional or marketing emails
- **Batch Send** - Send up to 100 emails in a single request
- **List Emails** - Retrieve sent emails with pagination
- **Get Email** - Fetch status and details of a specific email
- **Update Email** - Modify email properties
- **Cancel Email** - Cancel a scheduled email before it's sent
- **Schedule Email** - Schedule emails to be sent at a specific time

#### 🌐 Domain Management
- **Create Domain** - Add and configure new sending domains
- **List Domains** - View all configured domains
- **Get Domain** - Retrieve details for a specific domain
- **Update Domain** - Modify domain settings
- **Delete Domain** - Remove a domain from your account
- **Verify Domain** - Verify DNS records for domain authentication
- **Receiving Domains** - Configure domains for inbound email processing

#### 🔔 Webhook Management
- **Create Webhook** - Set up webhooks for email events
- **List Webhooks** - View all configured webhooks
- **Get Webhook** - Retrieve webhook configuration details
- **Update Webhook** - Modify webhook settings
- **Delete Webhook** - Remove a webhook
- **Event Types Supported**:
  - `email.sent` - Email was accepted by Resend
  - `email.delivered` - Email was successfully delivered
  - `email.delivery_delayed` - Delivery was delayed
  - `email.complained` - Recipient marked email as spam
  - `email.bounced` - Email bounced
  - `email.opened` - Recipient opened the email
  - `email.clicked` - Recipient clicked a link
  - `email.received` - Inbound email received

#### 👥 Contact & Audience Management
- **Create Contact** - Add contacts to an audience
- **List Contacts** - View all contacts in an audience
- **Get Contact** - Retrieve individual contact details
- **Update Contact** - Modify contact information
- **Delete Contact** - Remove a contact
- **Create Audience** - Create new audience segments
- **List Audiences** - View all audiences
- **Get Audience** - Retrieve audience details
- **Delete Audience** - Remove an audience

#### 📢 Broadcast Operations
- **Create Broadcast** - Set up email broadcast campaigns
- **List Broadcasts** - View all broadcasts
- **Get Broadcast** - Retrieve broadcast details
- **Update Broadcast** - Modify broadcast settings
- **Delete Broadcast** - Remove a broadcast
- **Send Broadcast** - Execute a broadcast campaign to an audience

#### 🔑 API Key Management
- **Create API Key** - Generate new API keys with specific permissions
- **List API Keys** - View all API keys
- **Delete API Key** - Revoke an API key

### 🛠️ MCP Capabilities

- **Tools**: All Resend API operations exposed as invocable tools
- **Resources**: Access to email templates and configurations
- **Prompts**: Pre-configured prompts for common email operations
- **Error Handling**: Comprehensive error messages and validation
- **Rate Limiting**: Respects Resend's rate limits (2 requests/second default)

## Installation

### Prerequisites

- Node.js 18+ or Python 3.10+
- A Resend API key (get one at [resend.com](https://resend.com))
- An MCP-compatible client (Claude Desktop, Continue, etc.)

### Using npm/npx

```bash
# Install globally
npm install -g @qrcommunication/resend-full-mcp

# Or use directly with npx
npx @qrcommunication/resend-full-mcp
```

### Using Python

```bash
# Install from PyPI
pip install resend-full-mcp

# Run the server
resend-mcp
```

### From Source

```bash
# Clone the repository
git clone https://github.com/QrCommunication/resend-full-mcp.git
cd resend-full-mcp

# Install dependencies
npm install  # or: pip install -e .

# Build the project
npm run build  # or: python -m build

# Run the server
npm start  # or: python -m resend_full_mcp
```

## Configuration

### Environment Variables

The server requires the following environment variable:

```bash
# Required: Your Resend API key
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
```

Optional configuration:

```bash
# API base URL (default: https://api.resend.com)
RESEND_API_BASE_URL=https://api.resend.com

# Enable debug logging (default: false)
DEBUG=true

# Custom rate limit (requests per second, default: 2)
RATE_LIMIT=2
```

### MCP Client Configuration

#### Claude Desktop

Add to your `claude_desktop_config.json`:

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

#### Continue.dev

Add to your `config.json`:

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

#### Cline

Add to your MCP settings:

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

## Usage

Once configured, you can use the server through your MCP client. Here are some example interactions:

### Sending an Email

```
AI: Can you send an email to john@example.com about our new product launch?

Response: I'll send that email using the send_email tool...
```

### Batch Email Sending

```
AI: Send a welcome email to these 50 new users: [list of emails]

Response: I'll use the batch_send_emails tool to send all 50 emails efficiently...
```

### Managing Domains

```
AI: Add my domain example.com and show me the DNS records I need to configure

Response: I'll create the domain and retrieve the verification records...
```

### Setting Up Webhooks

```
AI: Set up a webhook to notify me when emails are delivered or bounced

Response: I'll create a webhook for email.delivered and email.bounced events...
```

### Working with Broadcasts

```
AI: Create a broadcast for our monthly newsletter to the "customers" audience

Response: I'll set up the broadcast campaign...
```

## API Reference

### Email Tools

#### `send_email`
Send a single email.

**Parameters:**
- `from` (string, required) - Sender email address
- `to` (string|string[], required) - Recipient email address(es)
- `subject` (string, required) - Email subject
- `html` (string) - HTML content
- `text` (string) - Plain text content
- `cc` (string|string[]) - CC recipients
- `bcc` (string|string[]) - BCC recipients
- `reply_to` (string|string[]) - Reply-to address(es)
- `attachments` (array) - File attachments
- `headers` (object) - Custom email headers
- `tags` (array) - Email tags for tracking
- `scheduled_at` (string) - ISO 8601 timestamp for scheduling

**Returns:** Email ID and status

#### `batch_send_emails`
Send up to 100 emails in a single request.

**Parameters:**
- `emails` (array, required) - Array of email objects (same structure as send_email)

**Returns:** Array of email IDs and statuses

#### `list_emails`
List sent emails with pagination.

**Parameters:**
- `limit` (number) - Number of results per page (default: 100)
- `offset` (number) - Pagination offset

**Returns:** Array of email objects with metadata

#### `get_email`
Get details of a specific email.

**Parameters:**
- `email_id` (string, required) - The email ID

**Returns:** Email object with full details

#### `update_email`
Update email properties.

**Parameters:**
- `email_id` (string, required) - The email ID
- `scheduled_at` (string) - New scheduled time

**Returns:** Updated email object

#### `cancel_email`
Cancel a scheduled email.

**Parameters:**
- `email_id` (string, required) - The email ID

**Returns:** Cancellation confirmation

### Domain Tools

#### `create_domain`
Create a new sending domain.

**Parameters:**
- `name` (string, required) - Domain name (e.g., "example.com")
- `region` (string) - Region: "us-east-1", "eu-west-1", or "sa-east-1"

**Returns:** Domain object with DNS records

#### `list_domains`
List all configured domains.

**Returns:** Array of domain objects

#### `get_domain`
Get details of a specific domain.

**Parameters:**
- `domain_id` (string, required) - The domain ID

**Returns:** Domain object with verification status

#### `update_domain`
Update domain settings.

**Parameters:**
- `domain_id` (string, required) - The domain ID
- `click_tracking` (boolean) - Enable/disable click tracking
- `open_tracking` (boolean) - Enable/disable open tracking

**Returns:** Updated domain object

#### `delete_domain`
Delete a domain.

**Parameters:**
- `domain_id` (string, required) - The domain ID

**Returns:** Deletion confirmation

#### `verify_domain`
Verify domain DNS records.

**Parameters:**
- `domain_id` (string, required) - The domain ID

**Returns:** Verification status

### Webhook Tools

#### `create_webhook`
Create a new webhook.

**Parameters:**
- `url` (string, required) - Webhook endpoint URL
- `events` (string[], required) - Array of event types to subscribe to

**Returns:** Webhook object with secret

#### `list_webhooks`
List all configured webhooks.

**Returns:** Array of webhook objects

#### `get_webhook`
Get details of a specific webhook.

**Parameters:**
- `webhook_id` (string, required) - The webhook ID

**Returns:** Webhook object

#### `update_webhook`
Update webhook configuration.

**Parameters:**
- `webhook_id` (string, required) - The webhook ID
- `url` (string) - New webhook URL
- `events` (string[]) - New event types

**Returns:** Updated webhook object

#### `delete_webhook`
Delete a webhook.

**Parameters:**
- `webhook_id` (string, required) - The webhook ID

**Returns:** Deletion confirmation

### Contact Tools

#### `create_contact`
Add a contact to an audience.

**Parameters:**
- `audience_id` (string, required) - The audience ID
- `email` (string, required) - Contact email
- `first_name` (string) - First name
- `last_name` (string) - Last name
- `unsubscribed` (boolean) - Subscription status

**Returns:** Contact object

#### `list_contacts`
List contacts in an audience.

**Parameters:**
- `audience_id` (string, required) - The audience ID

**Returns:** Array of contact objects

#### `get_contact`
Get contact details.

**Parameters:**
- `contact_id` (string, required) - The contact ID

**Returns:** Contact object

#### `update_contact`
Update contact information.

**Parameters:**
- `contact_id` (string, required) - The contact ID
- `email` (string) - New email
- `first_name` (string) - New first name
- `last_name` (string) - New last name
- `unsubscribed` (boolean) - New subscription status

**Returns:** Updated contact object

#### `delete_contact`
Delete a contact.

**Parameters:**
- `contact_id` (string, required) - The contact ID

**Returns:** Deletion confirmation

### Audience Tools

#### `create_audience`
Create a new audience.

**Parameters:**
- `name` (string, required) - Audience name

**Returns:** Audience object

#### `list_audiences`
List all audiences.

**Returns:** Array of audience objects

#### `get_audience`
Get audience details.

**Parameters:**
- `audience_id` (string, required) - The audience ID

**Returns:** Audience object with contact count

#### `delete_audience`
Delete an audience.

**Parameters:**
- `audience_id` (string, required) - The audience ID

**Returns:** Deletion confirmation

### Broadcast Tools

#### `create_broadcast`
Create a new broadcast.

**Parameters:**
- `name` (string, required) - Broadcast name
- `audience_id` (string, required) - Target audience ID
- `from` (string, required) - Sender email
- `subject` (string, required) - Email subject
- `html` (string) - HTML content
- `text` (string) - Plain text content

**Returns:** Broadcast object

#### `list_broadcasts`
List all broadcasts.

**Returns:** Array of broadcast objects

#### `get_broadcast`
Get broadcast details.

**Parameters:**
- `broadcast_id` (string, required) - The broadcast ID

**Returns:** Broadcast object with stats

#### `update_broadcast`
Update broadcast settings.

**Parameters:**
- `broadcast_id` (string, required) - The broadcast ID
- `name` (string) - New name
- `subject` (string) - New subject
- `html` (string) - New HTML content

**Returns:** Updated broadcast object

#### `delete_broadcast`
Delete a broadcast.

**Parameters:**
- `broadcast_id` (string, required) - The broadcast ID

**Returns:** Deletion confirmation

#### `send_broadcast`
Send a broadcast to its configured audience.

**Parameters:**
- `broadcast_id` (string, required) - The broadcast ID
- `scheduled_at` (string) - Optional: Schedule for later

**Returns:** Send confirmation with stats

### API Key Tools

#### `create_api_key`
Create a new API key.

**Parameters:**
- `name` (string, required) - API key name
- `permission` (string) - "full_access" or "sending_access"
- `domain_id` (string) - Restrict to specific domain

**Returns:** API key object (includes the actual key - save it!)

#### `list_api_keys`
List all API keys.

**Returns:** Array of API key objects (without actual keys)

#### `delete_api_key`
Delete an API key.

**Parameters:**
- `api_key_id` (string, required) - The API key ID

**Returns:** Deletion confirmation

## Security

### API Key Management

- Store your Resend API key securely in environment variables
- Never commit API keys to version control
- Use restricted API keys when possible (sending_access only)
- Rotate API keys regularly
- Limit API keys to specific domains for production use

### Webhook Security

- Always validate webhook signatures
- Use HTTPS endpoints for webhooks
- Implement webhook secret validation
- Rate limit webhook endpoints
- Log webhook events for auditing

### Data Privacy

- This MCP server does not store any email content or recipient data
- All data is processed in real-time and sent directly to Resend
- Follow GDPR and other privacy regulations when handling contact data
- Implement proper unsubscribe mechanisms

## Rate Limiting

Resend enforces rate limits to ensure service quality:

- **Default**: 2 requests per second
- **Bursting**: Up to 10 requests in short bursts
- **Upgrades**: Higher limits available on paid plans

The server automatically handles rate limiting and will retry requests when appropriate.

## Error Handling

The server provides detailed error messages for common issues:

### Authentication Errors
- `401 Unauthorized` - Invalid or missing API key
- `403 Forbidden` - Insufficient permissions

### Validation Errors
- `400 Bad Request` - Invalid parameters or missing required fields
- `422 Unprocessable Entity` - Valid syntax but invalid data

### Resource Errors
- `404 Not Found` - Resource doesn't exist
- `409 Conflict` - Resource already exists or conflict

### Rate Limiting
- `429 Too Many Requests` - Rate limit exceeded

### Server Errors
- `500 Internal Server Error` - Resend service issue
- `503 Service Unavailable` - Temporary service disruption

## Development

### Project Structure

```
resend-full-mcp/
├── src/
│   ├── index.ts/py          # Main entry point
│   ├── server.ts/py         # MCP server implementation
│   ├── tools/               # Tool implementations
│   │   ├── emails.ts/py
│   │   ├── domains.ts/py
│   │   ├── webhooks.ts/py
│   │   ├── contacts.ts/py
│   │   ├── audiences.ts/py
│   │   ├── broadcasts.ts/py
│   │   └── api-keys.ts/py
│   ├── types.ts/py          # Type definitions
│   └── utils.ts/py          # Helper functions
├── tests/                   # Test suite
├── package.json / setup.py
├── tsconfig.json / pyproject.toml
├── README.md
└── LICENSE
```

### Building from Source

```bash
# TypeScript/Node.js
npm install
npm run build
npm test

# Python
pip install -e ".[dev]"
python -m pytest
```

### Running Tests

```bash
# Unit tests
npm test  # or: pytest

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e
```

### Code Quality

```bash
# Linting
npm run lint  # or: flake8 src/

# Formatting
npm run format  # or: black src/

# Type checking
npm run typecheck  # or: mypy src/
```

## Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork the repository** and create a feature branch
2. **Follow the existing code style** and conventions
3. **Write tests** for new functionality
4. **Update documentation** as needed
5. **Submit a pull request** with a clear description

### Development Setup

1. Clone your fork
2. Install dependencies: `npm install` or `pip install -e ".[dev]"`
3. Create a `.env` file with your Resend API key
4. Run tests: `npm test` or `pytest`
5. Make your changes
6. Ensure all tests pass and linting is clean
7. Submit a PR

### Reporting Issues

When reporting issues, please include:

- Detailed description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node/Python version, MCP client)
- Relevant error messages or logs

## Roadmap

Future enhancements planned:

- [ ] Resource caching for improved performance
- [ ] Advanced email templates support
- [ ] Built-in email validation
- [ ] Webhook event simulation for testing
- [ ] Analytics and reporting tools
- [ ] Batch operations for domains and contacts
- [ ] Custom retry strategies
- [ ] Streaming support for large operations

## Changelog

### v1.0.0 (2026-02-03)
- Initial release
- 100% Resend API coverage
- All email operations (send, batch, schedule, cancel)
- Complete domain management
- Webhook configuration and management
- Contact and audience management
- Broadcast operations
- API key management
- Comprehensive error handling
- Rate limiting support

## License

MIT License - see [LICENSE](LICENSE) file for details.

Copyright (c) 2026 Qr Communication

## Acknowledgments

- [Resend](https://resend.com) - For providing an excellent email API
- [Model Context Protocol](https://modelcontextprotocol.io) - For the MCP specification
- [Anthropic](https://anthropic.com) - For Claude and MCP development tools

## Support

- **Documentation**: [https://github.com/QrCommunication/resend-full-mcp](https://github.com/QrCommunication/resend-full-mcp)
- **Issues**: [https://github.com/QrCommunication/resend-full-mcp/issues](https://github.com/QrCommunication/resend-full-mcp/issues)
- **Resend Docs**: [https://resend.com/docs](https://resend.com/docs)
- **MCP Docs**: [https://modelcontextprotocol.io](https://modelcontextprotocol.io)

## Related Projects

- [Resend Node SDK](https://github.com/resend/resend-node)
- [Resend Python SDK](https://github.com/resend/resend-python)
- [Model Context Protocol SDK](https://github.com/modelcontextprotocol/sdk)

---

**Made with ❤️ by [Qr Communication](https://github.com/QrCommunication)**

*This MCP server provides complete coverage of the Resend API, enabling seamless email operations through AI assistants and LLM applications.*

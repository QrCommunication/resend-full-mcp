# Resend Full MCP Server

A comprehensive **Model Context Protocol (MCP)** server that provides 100% coverage of the **Resend API**. This implementation enables AI assistants to seamlessly integrate with Resend's powerful email infrastructure, covering all 12 modules and 70+ tools available in the Resend email platform.

## 🚀 Overview

This MCP server exposes the complete Resend API functionality through the Model Context Protocol, allowing AI assistants and LLM applications to handle everything from sending transactional emails to managing broadcast campaigns and configuring domain settings.

## ✨ Features

### 🎯 Complete API Coverage

This MCP server implements **all** endpoints from the Resend API across 12 comprehensive modules:

#### 📧 **Emails** (8 tools)
- **send_email** - Send individual transactional or marketing emails with HTML/text, attachments, and templates
- **send_batch_emails** - Send up to 100 emails in a single request
- **list_emails** - Retrieve sent emails with pagination
- **get_email** - Fetch status and details of a specific email
- **update_email** - Modify email properties and scheduled emails
- **cancel_email** - Cancel a scheduled email before it's sent
- **list_email_attachments** - List attachments for sent emails
- **get_email_attachment** - Retrieve specific attachment

#### 📨 **Receiving Emails** (4 tools)
- **list_received_emails** - List received emails
- **get_received_email** - Get received email details
- **list_received_email_attachments** - List attachments from received emails
- **get_received_email_attachment** - Get specific received email attachment

#### 🌐 **Domain Management** (6 tools)
- **create_domain** - Add and configure new sending domains
- **list_domains** - View all configured domains
- **get_domain** - Retrieve details for a specific domain
- **update_domain** - Modify domain settings (click tracking, open tracking)
- **delete_domain** - Remove a domain from your account
- **verify_domain** - Verify DNS records for domain authentication

#### 🔑 **API Key Management** (3 tools)
- **create_api_key** - Generate new API keys with specific permissions
- **list_api_keys** - View all API keys
- **delete_api_key** - Revoke an API key

#### 👥 **Audiences** (4 tools)
- **create_audience** - Create new audience segments/mailing lists
- **list_audiences** - View all audiences
- **get_audience** - Retrieve audience details with contact count
- **delete_audience** - Remove an audience

#### 📇 **Contacts** (13 tools)
- **create_contact** - Add contacts to an audience
- **list_contacts** - View all contacts in an audience
- **get_contact_by_email** - Get contact by email address
- **get_contact_by_id** - Get contact by ID
- **update_contact_by_email** - Update contact information by email
- **update_contact_by_id** - Update contact information by ID
- **delete_contact_by_email** - Remove a contact by email
- **delete_contact_by_id** - Remove a contact by ID
- **add_contact_to_segment** - Add contact to segment
- **remove_contact_from_segment** - Remove contact from segment
- **list_contact_segments** - List contact's segments
- **get_contact_topics** - Get contact topic subscriptions
- **update_contact_topics** - Update contact topic subscriptions

#### 📝 **Templates** (7 tools)
- **create_template** - Create email template
- **list_templates** - List all templates
- **get_template** - Get template details
- **update_template** - Update template
- **delete_template** - Delete template
- **publish_template** - Publish draft template
- **duplicate_template** - Duplicate existing template

#### 📢 **Broadcast Operations** (6 tools)
- **create_broadcast** - Set up email broadcast campaigns
- **list_broadcasts** - View all broadcasts
- **get_broadcast** - Retrieve broadcast details with stats
- **update_broadcast** - Modify broadcast settings
- **delete_broadcast** - Remove a broadcast
- **send_broadcast** - Execute a broadcast campaign to an audience

#### 🪝 **Webhook Management** (5 tools)
- **create_webhook** - Set up webhooks for email events
- **list_webhooks** - View all configured webhooks
- **get_webhook** - Retrieve webhook configuration details
- **update_webhook** - Modify webhook settings
- **delete_webhook** - Remove a webhook

**Supported Webhook Events:**
- `email.sent` - Email was accepted by Resend
- `email.delivered` - Email was successfully delivered
- `email.delivery_delayed` - Delivery was delayed
- `email.complained` - Recipient marked email as spam
- `email.bounced` - Email bounced
- `email.opened` - Recipient opened the email
- `email.clicked` - Recipient clicked a link
- `email.received` - Inbound email received

#### 🎯 **Segments** (4 tools)
- **create_segment** - Create audience segment
- **list_segments** - List all segments
- **get_segment** - Get segment details
- **delete_segment** - Delete segment

#### 🏷️ **Topics** (5 tools)
- **create_topic** - Create subscription topic
- **list_topics** - List all topics
- **get_topic** - Get topic details
- **update_topic** - Update topic
- **delete_topic** - Delete topic

#### 🔧 **Contact Properties** (5 tools)
- **create_contact_property** - Create custom contact property
- **list_contact_properties** - List all contact properties
- **get_contact_property** - Get property details
- **update_contact_property** - Update property
- **delete_contact_property** - Delete property

### 🛠️ MCP Capabilities

- **Tools**: All Resend API operations exposed as invocable tools (70+ tools)
- **Resources**: Access to email templates and configurations
- **Prompts**: Pre-configured prompts for common email operations
- **Error Handling**: Comprehensive error messages and validation
- **Rate Limiting**: Respects Resend's rate limits (2 requests/second default)

## 📋 Prerequisites

- **Node.js** 18+ (recommended: v20 or later)
- **TypeScript** 5+
- A **Resend API key** ([Get one here](https://resend.com))
- An **MCP-compatible client** (Claude Desktop, Continue, Cline, etc.)

## 🛠️ Installation

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
npm install

# Build the project
npm run build

# Start the server
npm start
```

### Development Mode

```bash
# Start with auto-reload
npm run dev
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the project root:

```bash
# Copy the example file
cp .env.example .env
```

**Required:**
```env
# Your Resend API key from the dashboard
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
```

**Optional:**
```env
# API base URL (default: https://api.resend.com)
RESEND_API_BASE_URL=https://api.resend.com

# Enable debug logging (default: false)
DEBUG=true

# Custom rate limit (requests per second, default: 2)
RATE_LIMIT=2
```

> **Security Note**: Never commit your `.env` file to version control. It's already included in `.gitignore`.

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

## 📖 Usage

Once configured, you can use the server through your MCP client. Here are some example interactions:

### Sending an Email

**AI Interaction:**
```
You: Can you send an email to john@example.com about our new product launch?

AI: I'll send that email using the send_email tool...
```

**Direct Tool Call:**
```json
{
  "method": "tools/call",
  "params": {
    "name": "send_email",
    "arguments": {
      "from": "Your Name <onboarding@yourdomain.com>",
      "to": ["john@example.com"],
      "subject": "New Product Launch",
      "html": "<p>We're excited to announce our <strong>new product</strong>!</p>",
      "text": "We're excited to announce our new product!"
    }
  }
}
```

### Batch Email Sending

**AI Interaction:**
```
You: Send a welcome email to these 50 new users: [list of emails]

AI: I'll use the send_batch_emails tool to send all 50 emails efficiently...
```

**Direct Tool Call:**
```json
{
  "method": "tools/call",
  "params": {
    "name": "send_batch_emails",
    "arguments": {
      "emails": [
        {
          "from": "team@yourdomain.com",
          "to": ["user1@example.com"],
          "subject": "Welcome!",
          "html": "<p>Welcome to our service!</p>"
        },
        {
          "from": "team@yourdomain.com",
          "to": ["user2@example.com"],
          "subject": "Welcome!",
          "html": "<p>Welcome to our service!</p>"
        }
      ]
    }
  }
}
```

### Managing Domains

**AI Interaction:**
```
You: Add my domain example.com and show me the DNS records I need to configure

AI: I'll create the domain and retrieve the verification records...
```

**Direct Tool Call:**
```json
{
  "method": "tools/call",
  "params": {
    "name": "create_domain",
    "arguments": {
      "name": "example.com",
      "region": "us-east-1"
    }
  }
}
```

### Setting Up Webhooks

**AI Interaction:**
```
You: Set up a webhook to notify me when emails are delivered or bounced

AI: I'll create a webhook for email.delivered and email.bounced events...
```

**Direct Tool Call:**
```json
{
  "method": "tools/call",
  "params": {
    "name": "create_webhook",
    "arguments": {
      "endpoint": "https://yourapp.com/webhooks/resend",
      "events": ["email.delivered", "email.bounced"]
    }
  }
}
```

### Working with Audiences and Contacts

**Creating an Audience:**
```json
{
  "method": "tools/call",
  "params": {
    "name": "create_audience",
    "arguments": {
      "name": "Newsletter Subscribers"
    }
  }
}
```

**Adding a Contact:**
```json
{
  "method": "tools/call",
  "params": {
    "name": "create_contact",
    "arguments": {
      "audience_id": "your_audience_id",
      "email": "subscriber@example.com",
      "first_name": "John",
      "last_name": "Doe"
    }
  }
}
```

### Creating and Sending Broadcasts

**AI Interaction:**
```
You: Create a broadcast for our monthly newsletter to the "customers" audience

AI: I'll set up the broadcast campaign...
```

**Direct Tool Call:**
```json
{
  "method": "tools/call",
  "params": {
    "name": "create_broadcast",
    "arguments": {
      "name": "Monthly Newsletter",
      "segment_id": "your_segment_id",
      "from": "newsletter@yourdomain.com",
      "subject": "This Month's Updates",
      "html": "<h1>Monthly Updates</h1><p>Here's what happened this month...</p>",
      "send": false
    }
  }
}
```

### Listing All Available Tools

```json
{
  "method": "tools/list",
  "params": {}
}
```

This will return all 70+ tools with their descriptions and input schemas.

## 🏗️ Project Structure

```
resend-full-mcp/
├── src/
│   └── index.ts          # Main MCP server implementation
├── dist/                 # Compiled JavaScript (generated)
├── package.json          # Project dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── .env                  # Environment variables (not in git)
├── .env.example          # Environment template
├── .gitignore            # Git ignore rules
├── LICENSE               # MIT License
└── README.md             # This file
```

## 🔒 Security

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

## ⚡ Rate Limiting

Resend enforces rate limits to ensure service quality:

- **Default**: 2 requests per second
- **Bursting**: Up to 10 requests in short bursts
- **Upgrades**: Higher limits available on paid plans

The server automatically handles rate limiting and will retry requests when appropriate.

## 🔧 Error Handling

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

## 🐛 Troubleshooting

### Error: "RESEND_API_KEY environment variable is not set"

**Solution**: Create a `.env` file with your Resend API key:
```bash
echo "RESEND_API_KEY=re_your_key_here" > .env
```

### Error: "Tool execution failed"

**Possible causes**:
- Invalid API key
- Missing required parameters
- API rate limits exceeded
- Network connectivity issues

**Solution**: Check the error message details and verify your API key and parameters.

### Error: "Unknown tool"

**Solution**: Verify the tool name using the `tools/list` method to see all available tools.

## 🛠️ Development

### Building from Source

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests (if available)
npm test
```

### Running in Development Mode

```bash
# Start with auto-reload
npm run dev
```

### Code Quality

```bash
# Linting
npm run lint

# Formatting
npm run format

# Type checking
npm run typecheck
```

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork the repository** and create a feature branch
2. **Follow the existing code style** and conventions
3. **Write tests** for new functionality
4. **Update documentation** as needed
5. **Submit a pull request** with a clear description

### Development Setup

1. Clone your fork: `git clone https://github.com/YOUR_USERNAME/resend-full-mcp.git`
2. Install dependencies: `npm install`
3. Create a `.env` file with your Resend API key
4. Run tests: `npm test`
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

## 🗺️ Roadmap

Future enhancements planned:

- [ ] Resource caching for improved performance
- [ ] Advanced email templates support
- [ ] Built-in email validation
- [ ] Webhook event simulation for testing
- [ ] Analytics and reporting tools
- [ ] Batch operations for domains and contacts
- [ ] Custom retry strategies
- [ ] Streaming support for large operations

## 📝 Changelog

### v1.0.0 (2026-02-03)
- Initial release
- 100% Resend API coverage (70+ tools across 12 modules)
- All email operations (send, batch, schedule, cancel)
- Complete domain management
- Webhook configuration and management
- Contact and audience management
- Broadcast operations
- API key management
- Templates support
- Segments and topics management
- Contact properties support
- Comprehensive error handling
- Rate limiting support

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

Copyright (c) 2026 Qr Communication

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## 🙏 Acknowledgments

- [Resend](https://resend.com) - For providing an excellent email API
- [Model Context Protocol](https://modelcontextprotocol.io) - For the MCP specification
- [Anthropic](https://anthropic.com) - For Claude and MCP development tools
- The Model Context Protocol community
- All contributors to this project

## 📞 Support

- **Documentation**: [GitHub Repository](https://github.com/QrCommunication/resend-full-mcp)
- **Issues**: [GitHub Issues](https://github.com/QrCommunication/resend-full-mcp/issues)
- **Discussions**: [GitHub Discussions](https://github.com/QrCommunication/resend-full-mcp/discussions)
- **Resend Docs**: [https://resend.com/docs](https://resend.com/docs)
- **Resend API Reference**: [https://resend.com/docs/api-reference](https://resend.com/docs/api-reference)
- **MCP Docs**: [https://modelcontextprotocol.io](https://modelcontextprotocol.io)

## 🔗 Related Projects

- [Resend Node SDK](https://github.com/resend/resend-node)
- [Resend Python SDK](https://github.com/resend/resend-python)
- [Model Context Protocol SDK](https://github.com/modelcontextprotocol/sdk)

---

**Made with ❤️ by [Qr Communication](https://github.com/QrCommunication)**

*This MCP server provides complete coverage of the Resend API, enabling seamless email operations through AI assistants and LLM applications.*

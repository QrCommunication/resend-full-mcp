# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-03

### Added
- **Complete MCP Server** with 100% Resend API coverage
- **70+ MCP tools** across 12 modules:
  - Emails (8 tools): send, batch, list, get, update, cancel, attachments
  - Receiving Emails (4 tools): list, get, attachments
  - Domains (6 tools): create, list, get, update, delete, verify
  - API Keys (3 tools): create, list, delete
  - Audiences (4 tools): create, list, get, delete
  - Contacts (13 tools): full CRUD, segments, topics subscriptions
  - Templates (7 tools): create, list, get, update, delete, publish, duplicate
  - Broadcasts (6 tools): create, list, get, update, delete, send
  - Webhooks (5 tools): create, list, get, update, delete
  - Segments (4 tools): create, list, get, delete
  - Topics (5 tools): create, list, get, update, delete
  - Contact Properties (5 tools): create, list, get, update, delete

- **Resend Expert Skill** (1644 lines)
  - Architecture patterns for web, mobile, and backend
  - Complete React Email templates with best practices
  - Webhook implementation with signature verification
  - Framework integrations (Next.js, Express, NestJS, React Native)
  - Security best practices (SPF, DKIM, DMARC)
  - Performance optimization with queues and batch operations
  - Auto-installation to multiple AI CLI directories:
    - `~/.claude/skills/` (Claude Code, Claude CLI)
    - `~/.agents/skills/` (Cursor, Windsurf, other AI agents)
    - `~/.config/ai/skills/` (Generic AI config)

- **MCP Protocol Implementation**
  - stdin/stdout communication
  - `tools/list` and `tools/call` methods
  - Comprehensive error handling
  - Rate limiting support (2 req/s default)

- **Installation Methods**
  - NPM global: `npm install -g @qrcommunication/resend-full-mcp`
  - NPX direct: `npx @qrcommunication/resend-full-mcp`
  - From source with build scripts

- **Client Configuration Examples**
  - Claude Desktop
  - Cursor
  - Windsurf
  - Continue.dev
  - Cline
  - Generic MCP clients

- **Complete Documentation**
  - README with full API coverage
  - Environment configuration (.env.example)
  - TypeScript types and interfaces
  - Security guidelines
  - Troubleshooting guide

### Security
- Environment-based API key management
- No storage of email content or recipient data
- Real-time processing with direct Resend API calls
- Webhook signature validation patterns
- Rate limiting compliance

### Technical
- TypeScript 5.3+ with full type safety
- Node.js 18+ compatibility
- Resend SDK ^3.2.0
- dotenv for environment configuration
- Compiled output with source maps

[1.0.0]: https://github.com/QrCommunication/resend-full-mcp/releases/tag/v1.0.0

# WhatsApp API

Baileys is a simple, fast and easy to use WhatsApp Web API written in TypeScript. It is designed to be simple to use and is optimized for usage in Node.js.

An implementation of [@WhiskeySockets/Baileys](https://github.com/WhiskeySockets/Baileys) as a simple REST API with multiple device support

Project continued from [@ookamiiixd/baileys-api](https://github.com/ookamiiixd/baileys-api/)

## Requirements

-   NodeJS version 18.19.0 or higher (Recommended version 20 and above)
-   Prisma [supported databases](https://www.prisma.io/docs/reference/database-reference/supported-databases). Tested on MySQL and PostgreSQL

## Installation

1. Download [latest release](https://github.com/nizarfadlan/baileys-api/releases/latest). If you want to skip the build step, you can download the release (file with the `baileys-api.tgz` name pattern) from the release page
2. Enter to the project directory
3. Install the dependencies

```sh
npm install
```

4. Build the project using the `build` script

```sh
npm run build
```

You can skip this part if you're using the prebuilt one from the release page

## Setup

1. Copy the `.env.example` file and rename it into `.env`, then update your [connection url](https://www.prisma.io/docs/reference/database-reference/connection-urls) in the `DATABASE_URL` field
2. Update your [provider](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#fields) in the `prisma/schema.prisma` file if you're using database other than MySQL
3. Run your [migration](https://www.prisma.io/docs/reference/api-reference/command-reference#prisma-migrate)

```sh
npx prisma migrate (dev|deploy)
```

or push the schema

```sh
npx prisma db push
```

Don't forget to always re-run those whenever there's a change on the `prisma/schema.prisma` file

## `.env` Configurations

```env
# Listening Port HTTP and Socket.io
PORT="3000"

# Project Mode (development|production)
NODE_ENV="development"

# Global URL Webhook
URL_WEBHOOK="http://localhost:3000/webhook"

# Enable Webhook
ENABLE_WEBHOOK="true"

# Enable websocket
ENABLE_WEBSOCKET="true"

# Name browser bot
BOT_NAME="Whatsapp Bot"

# Database Connection URL
DATABASE_URL="mysql://root:@localhost:3306/baileys_api"

# Pino Logger Level
LOG_LEVEL="debug"

# Reconnect Interval (in Milliseconds)
RECONNECT_INTERVAL="5000"

# Maximum Reconnect Attempts
MAX_RECONNECT_RETRIES="5"

# Maximum SSE QR Generation Attempts
SSE_MAX_QR_GENERATION="10"

# Name session config
SESSION_CONFIG_ID="session-config"

# API Key (for Authorization Header and Socket.io Token)
API_KEY="a6bc226axxxxxxxxxxxxxx"
```

## Usage

1. Make sure you have completed the **Installation** and **Setup** step
1. You can then start the app using the `dev` for development and `start` script for production

```sh
# Development
npm run dev

# Production
npm run start
```

1. Now the endpoint should be available according to your environment variables configuration. Default is at `http://localhost:3000`

## API Docs

The API Documentation can fork **Postman Collection** in your workspace Postman

[<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">](https://app.getpostman.com/run-collection/14456337-fb3349c5-de0e-40ec-b909-3922f4a95b7a?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D14456337-fb3349c5-de0e-40ec-b909-3922f4a95b7a%26entityType%3Dcollection%26workspaceId%3Dfbd81f05-e0e1-42cb-b893-60063cf8bcd1)

## Troubleshooting

### WhatsApp Version Compatibility Issues

One of the most common issues with this API is related to WhatsApp version compatibility. The Baileys library frequently updates the WhatsApp Web version it supports, and using an outdated version can cause the service to fail in production.

#### Symptoms

-   Service suddenly stops working in production
-   Connection failures when creating WhatsApp sessions
-   Authentication errors
-   QR code generation failures

#### Common Causes

1. **Hardcoded version outdated**: The WhatsApp version specified in the code becomes obsolete
2. **External version file unavailable**: References to external version files (like GitHub raw files) that may be moved, renamed, or deleted
3. **Baileys library updates**: New versions of Baileys may change how version handling works

#### Solutions

##### 1. Update WhatsApp Version Manually

If the service fails due to version issues, you can manually update the version in `/src/whatsapp/service.ts`:

```typescript
// Find this line in the makeWASocket configuration:
version: [2, 3000, 1023223821], // Update these numbers

// Replace with the latest version from Baileys repository
```

##### 2. Get Latest Version from Baileys Repository

To find the current WhatsApp version supported by Baileys:

1. Go to the [Baileys GitHub repository](https://github.com/WhiskeySockets/Baileys)
2. Navigate to `src/Defaults/baileys-version.ts` (or similar file)
3. Look for the version array, example:

    ```typescript
    export const DEFAULT_VERSION: [number, number, number] = [2, 3000, 1023223821];
    ```

4. Copy these numbers to your service.ts file

##### 3. Remove External Version Fetching

If your code attempts to fetch version from external sources (like GitHub raw files), consider removing this dependency:

```typescript
// Remove or comment out code like this:
/* const version = (await fetch(
	"https://raw.githubusercontent.com/WhiskeySockets/Baileys/master/src/Defaults/baileys-version.json",
).then((res) => res.json())) as unknown as {
	version: [number, number, number];
}; */

// And use a hardcoded version instead:
version: [2, 3000, 1023223821],
```

##### 4. Monitor Baileys Updates

-   Subscribe to the [Baileys repository](https://github.com/WhiskeySockets/Baileys) for updates
-   Check the releases page regularly
-   Test version updates in development before deploying to production

#### Prevention Tips

1. **Pin specific versions**: Use exact versions in package.json instead of ranges
2. **Regular testing**: Test your WhatsApp integration regularly in staging
3. **Monitor logs**: Set up proper logging to catch version-related errors early
4. **Fallback mechanisms**: Implement retry logic and error handling for connection failures

#### Emergency Fix

If your production service is down due to version issues:

1. Check the current Baileys version: `npm list baileys`
2. Visit the Baileys GitHub repository
3. Find the latest supported WhatsApp version in their source code
4. Update the version array in your `service.ts`
5. Restart your service

Remember: WhatsApp Web frequently updates their protocol, so staying updated with Baileys releases is crucial for maintaining service stability.

## Notes

-   I only provide a simple authentication method, please modify according to your own needs.

## Notice

This project is intended for learning purpose only, don't use it for spamming or any activities that's prohibited by **WhatsApp**

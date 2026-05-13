# Tien Dat Wedding Platform

Tien Dat Wedding Platform is a React + Vite web app for:

- browsing sample invitation products
- designing wedding invitations
- saving invitation drafts to the cloud
- chatting with admin for consultation

The project is deployed with Azure Static Web Apps, uses Azure Functions for API endpoints, and stores cloud data in Azure Table Storage.

## Current Features

### 1. Landing Page

The home page currently keeps the flow simple:

- `Hero`
- `Ordering Process`
- `Consultation Chat`

### 2. Sample Product Page

There is a separate page for viewing sample invitation products.

Users can open it from:

- the `Hero` button
- the `Header`

This page is useful for browsing invitation styles before moving into the chat or designer flow.

### 3. Wedding Card Designer

The invitation designer now supports:

- fixed `5x7` card ratio only
- bilingual setup options: Vietnamese, English, or Bilingual
- multiple color palettes
- multiple visual style presets
- multiple background styles
- invitation event types
- decorative items such as:
  - wax seal
  - ribbon wrap
  - venue map
  - monogram
  - photo panel
  - QR RSVP

The preview card is intentionally simplified:

- all key details stay inside the card
- no long quote block
- no message text fields for Vietnamese / English invitation copy
- layout focuses on the main invitation data only

### 4. Cloud Save

Signed-in users can save invitation drafts to the cloud.

Saved data includes:

- bride / groom names
- parent information
- venue
- date
- time
- palette
- background
- style preset
- invitation language mode
- event type
- dress code
- RSVP contact
- embellishment items

### 5. Consultation Chat

The consultation section has been converted into a Messenger-style chat UI.

Users can:

- sign in with Google
- enter phone number
- send the first consultation message
- continue chatting in the same thread

All chat messages are stored in the cloud.

### 6. Admin Inbox

Admin can:

- view all user conversations
- open a specific thread
- reply to users
- close or reopen a conversation

Default admin email:

`kim1801x5@gmail.com`

The app still supports setting admin emails through environment variables, but if not provided it falls back to this Gmail address.

### 7. Consult Button Flow

Inside the wedding card designer, the `Tu van dat ngay` / `Consult & Order` button now sends the user back to the home page and scrolls directly to the consultation chat section.

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS
- Authentication: Google Identity Services
- Hosting: Azure Static Web Apps
- API: Azure Functions
- Cloud storage: Azure Table Storage
- CI/CD: GitHub Actions

## Project Structure

```text
src/
  app/
    components/
      AdminChatPage.tsx
      Contact.tsx
      Footer.tsx
      Header.tsx
      Hero.tsx
      LoginPage.tsx
      Process.tsx
      SamplesPage.tsx
      WeddingCardDesigner.tsx
    contexts/
      AuthContext.tsx
      LanguageContext.tsx
    services/
      cardsApi.ts
      chatApi.ts
      googleSession.ts
    types/
      chat.ts
      weddingCard.ts

api/
  cards/
  cards-item/
  chat-conversations/
  chat-conversation-item/
  chat-messages/
  shared/
    cardsRepository.js
    cardsValidation.js
    chatRepository.js
    chatValidation.js
    googleAuth.js
    http.js
```

## User Flows

### Normal User Flow

1. Open home page
2. Browse sample invitation page if needed
3. Open wedding invitation designer
4. Sign in with Google if cloud save is needed
5. Save a draft to the cloud
6. Click `Consult & Order` to jump to the consultation chat
7. Send a message to admin

### Admin Flow

1. Sign in with Google using an allowed admin email
2. Open `Admin chat` from the header
3. View all user conversations
4. Open a conversation
5. Reply to the user

## Data Model

## A. Wedding Card Drafts

Stored through:

- `GET /api/cards`
- `POST /api/cards`
- `GET /api/cards/{id}`
- `PUT /api/cards/{id}`
- `DELETE /api/cards/{id}`

Each record is stored in Azure Table Storage using:

- `PartitionKey = userId`
- `RowKey = designId`

The `cardData` model currently includes:

- `brideName`
- `groomName`
- `brideParents`
- `groomParents`
- `venue`
- `date`
- `time`
- `colorScheme`
- `background`
- `stylePreset`
- `cardFormat`
- `contentLanguage`
- `eventType`
- `dressCode`
- `rsvpContact`
- `embellishments`

Note:

- `cardFormat` is now locked to `portrait` for the fixed `5x7` layout

## B. Chat Conversations

Stored through:

- `GET /api/chat/conversations`
- `POST /api/chat/conversations`
- `GET /api/chat/conversations/{id}`
- `PUT /api/chat/conversations/{id}`

Conversation fields include:

- `userId`
- `userEmail`
- `userName`
- `contactPhone`
- `status`
- `lastMessage`
- `lastSenderRole`
- `unreadForAdmin`
- `unreadForUser`
- `createdAt`
- `updatedAt`

## C. Chat Messages

Stored through:

- `GET /api/chat/conversations/{id}/messages`
- `POST /api/chat/conversations/{id}/messages`

Message fields include:

- `conversationId`
- `senderId`
- `senderName`
- `senderRole`
- `content`
- `createdAt`

## Authentication

The app uses Google Identity Services.

### Frontend

- user signs in on `LoginPage`
- Google ID token is stored locally
- frontend sends the token to the backend through:

`Authorization: Bearer <google-id-token>`

and also:

`X-Google-Id-Token`

### Backend

Azure Functions verify the Google ID token and extract:

- `userId`
- `userEmail`
- `userName`

### Admin Permission Logic

Admin access is checked in both frontend and backend.

Priority order:

1. Use `VITE_ADMIN_EMAILS` and `ADMIN_EMAILS` if provided
2. If not provided, fallback to:

`kim1801x5@gmail.com`

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Create `.env`

Create `.env` from `.env.example`.

Example:

```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
VITE_ADMIN_EMAILS=kim1801x5@gmail.com
```

### 3. Run frontend

```bash
npm run dev
```

### 4. Build check

```bash
npm run build
```

## Azure Functions Local Settings

If you want to run the Azure Functions side locally later:

1. Copy:

`api/local.settings.sample.json`

to:

`api/local.settings.json`

2. Fill in real values

Example:

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "GOOGLE_CLIENT_ID": "your-google-client-id.apps.googleusercontent.com",
    "AZURE_STORAGE_CONNECTION_STRING": "your-real-storage-connection-string",
    "AZURE_TABLE_NAME": "WeddingCardDesigns",
    "AZURE_CHAT_CONVERSATIONS_TABLE_NAME": "ConsultationConversations",
    "AZURE_CHAT_MESSAGES_TABLE_NAME": "ConsultationMessages",
    "ADMIN_EMAILS": "kim1801x5@gmail.com"
  }
}
```

## Environment Variables

### Frontend

- `VITE_GOOGLE_CLIENT_ID`
- `VITE_ADMIN_EMAILS`

### API / Azure Functions

- `GOOGLE_CLIENT_ID`
- `AZURE_STORAGE_CONNECTION_STRING`
- `AZURE_TABLE_NAME`
- `AZURE_CHAT_CONVERSATIONS_TABLE_NAME`
- `AZURE_CHAT_MESSAGES_TABLE_NAME`
- `ADMIN_EMAILS`

## Azure Manual Setup

This is the main manual part after coding.

### 1. Create Storage Account

In Azure:

- create a `Storage Account`
- copy its `Connection String`

### 2. Configure Azure Static Web Apps environment variables

Add:

- `VITE_GOOGLE_CLIENT_ID`
- `VITE_ADMIN_EMAILS`
- `GOOGLE_CLIENT_ID`
- `AZURE_STORAGE_CONNECTION_STRING`
- `AZURE_TABLE_NAME`
- `AZURE_CHAT_CONVERSATIONS_TABLE_NAME`
- `AZURE_CHAT_MESSAGES_TABLE_NAME`
- `ADMIN_EMAILS`

Recommended values:

- `VITE_ADMIN_EMAILS=kim1801x5@gmail.com`
- `ADMIN_EMAILS=kim1801x5@gmail.com`
- `AZURE_TABLE_NAME=WeddingCardDesigns`
- `AZURE_CHAT_CONVERSATIONS_TABLE_NAME=ConsultationConversations`
- `AZURE_CHAT_MESSAGES_TABLE_NAME=ConsultationMessages`

### 3. Redeploy

After saving environment variables:

- save configuration
- redeploy the application

## GitHub Actions

Workflow file:

[.github/workflows/azure-static-web-apps-orange-hill-077720b00.yml](/abs/path/d:/Y3S2/Cloud/BTL/.github/workflows/azure-static-web-apps-orange-hill-077720b00.yml:1)

Current frontend build secrets used by the workflow:

- `VITE_GOOGLE_CLIENT_ID`
- `VITE_ADMIN_EMAILS`

### Recommended GitHub Secrets

- `AZURE_STATIC_WEB_APPS_API_TOKEN_ORANGE_HILL_077720B00`
- `VITE_GOOGLE_CLIENT_ID`
- `VITE_ADMIN_EMAILS`

Backend secrets such as:

- `GOOGLE_CLIENT_ID`
- `AZURE_STORAGE_CONNECTION_STRING`
- `ADMIN_EMAILS`

should usually be configured directly inside Azure Static Web Apps rather than passed through the frontend build workflow.

## Important Files

### Frontend - Chat

- [src/app/components/Contact.tsx](/abs/path/d:/Y3S2/Cloud/BTL/src/app/components/Contact.tsx:1)
- [src/app/components/AdminChatPage.tsx](/abs/path/d:/Y3S2/Cloud/BTL/src/app/components/AdminChatPage.tsx:1)
- [src/app/services/chatApi.ts](/abs/path/d:/Y3S2/Cloud/BTL/src/app/services/chatApi.ts:1)
- [src/app/contexts/AuthContext.tsx](/abs/path/d:/Y3S2/Cloud/BTL/src/app/contexts/AuthContext.tsx:1)

### Frontend - Designer

- [src/app/components/WeddingCardDesigner.tsx](/abs/path/d:/Y3S2/Cloud/BTL/src/app/components/WeddingCardDesigner.tsx:1)
- [src/app/types/weddingCard.ts](/abs/path/d:/Y3S2/Cloud/BTL/src/app/types/weddingCard.ts:1)
- [src/app/App.tsx](/abs/path/d:/Y3S2/Cloud/BTL/src/app/App.tsx:1)

### Backend

- [api/cards/index.js](/abs/path/d:/Y3S2/Cloud/BTL/api/cards/index.js:1)
- [api/cards-item/index.js](/abs/path/d:/Y3S2/Cloud/BTL/api/cards-item/index.js:1)
- [api/chat-conversations/index.js](/abs/path/d:/Y3S2/Cloud/BTL/api/chat-conversations/index.js:1)
- [api/chat-conversation-item/index.js](/abs/path/d:/Y3S2/Cloud/BTL/api/chat-conversation-item/index.js:1)
- [api/chat-messages/index.js](/abs/path/d:/Y3S2/Cloud/BTL/api/chat-messages/index.js:1)
- [api/shared/cardsValidation.js](/abs/path/d:/Y3S2/Cloud/BTL/api/shared/cardsValidation.js:1)
- [api/shared/chatRepository.js](/abs/path/d:/Y3S2/Cloud/BTL/api/shared/chatRepository.js:1)
- [api/shared/googleAuth.js](/abs/path/d:/Y3S2/Cloud/BTL/api/shared/googleAuth.js:1)

## Current Limitations

- chat still uses polling every 5 seconds instead of realtime sockets
- no image upload in chat
- no push notifications
- no conversation pagination
- no detailed seen/read receipt
- sample page and invitation designer are still single-view React state pages, not URL-based routes

## Suggested Next Improvements

- replace polling with SignalR or WebSocket
- add search for admin conversations
- allow sending sample images in chat
- add seen/read state
- add dedicated frontend routing with React Router
- add front/back invitation preview pages
- add export to image or PDF for invitation drafts

## Quick Manual Checklist

Before demo or deployment, verify:

1. `.env` exists
2. `VITE_GOOGLE_CLIENT_ID` is correct
3. `VITE_ADMIN_EMAILS` contains `kim1801x5@gmail.com`
4. Azure has `AZURE_STORAGE_CONNECTION_STRING`
5. Azure has `GOOGLE_CLIENT_ID`
6. Azure has `ADMIN_EMAILS`
7. app has been redeployed after environment changes
8. admin is signed in with the correct Gmail

## Notes

- guest mode does not provide a cloud token, so full cloud chat and cloud save are not available there
- if admin does not sign in with an allowed email, admin inbox will not be available
- admin fallback is currently `kim1801x5@gmail.com`, but setting explicit environment variables is still recommended

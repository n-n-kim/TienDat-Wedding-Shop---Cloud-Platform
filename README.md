# Tien Dat Wedding Platform

Frontend wedding platform built with React, TypeScript, and Vite. The project is deployed on Azure Static Web Apps, supports Google Sign-In, and now includes a cloud-ready wedding card save/load flow backed by Azure Functions and Azure Table Storage.

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS
- Authentication: Google Identity Services
- CI/CD: GitHub Actions
- Hosting: Azure Static Web Apps
- API: Azure Functions
- Cloud data store: Azure Table Storage

## Run Frontend Locally

1. Install dependencies:
   `npm install`
2. Create `.env` from `.env.example` and set `VITE_GOOGLE_CLIENT_ID`.
3. Start the app:
   `npm run dev`

## Cloud Save Architecture

- The frontend designer keeps a local draft in `localStorage`.
- Signed-in users can save designs to `/api/cards`.
- Azure Functions persist design JSON into Azure Table Storage.
- Each user design uses:
  - `PartitionKey = userId`
  - `RowKey = designId`

## API Contract

- `GET /api/cards`
- `POST /api/cards`
- `GET /api/cards/{id}`
- `PUT /api/cards/{id}`
- `DELETE /api/cards/{id}`

Every request must include:

- `Authorization: Bearer <google-id-token>`

## Manual Azure Setup

1. In Azure, create a `Storage Account`.
2. Inside that storage account, create a table named `WeddingCardDesigns` or another table name of your choice.
3. Copy the storage account connection string.
4. In Azure Static Web Apps, open `Environment variables` and add:
   - `VITE_GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_ID`
   - `AZURE_STORAGE_CONNECTION_STRING`
   - `AZURE_TABLE_NAME`
5. Save the variables and redeploy the app.

## Local Function Settings

If you want to run Functions locally later, copy:

- `api/local.settings.sample.json` -> `api/local.settings.json`

Then replace the placeholder storage values with your real connection string.

Also add your Google OAuth client id to:

- `GOOGLE_CLIENT_ID`

## Notes

- The frontend sends the Google ID token in the `Authorization` header.
- Azure Functions verify that token and derive `userId`, `userEmail`, and `userName` from it before reading or writing user-specific designs.

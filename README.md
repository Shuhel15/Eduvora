# Eduvora

Eduvora is an AI-powered career guidance platform for students in classes 10 and 12. It combines an academic assessment, subject marks, and quiz responses to suggest suitable courses and career paths. Students can also compare courses and find nearby colleges.

## Features

- Email/password and Google authentication
- Email OTP verification and password recovery
- Class 10 and class 12 assessment flows
- Marks and quiz collection with persisted assessment history
- AI-generated assessment results using Google Gemini
- Course discovery and course comparison
- Nearby-college search using OpenRouteService
- Redis-backed OTP and short-lived application data
- Responsive UI with light/dark theme support

## Tech stack

- [Next.js](https://nextjs.org/) 16 App Router and React 19
- TypeScript and Tailwind CSS 4
- NextAuth.js for authentication
- Prisma 7 with PostgreSQL
- Redis via `ioredis`
- Google Gemini via `@google/genai`
- Nodemailer for email delivery
- Zod and React Hook Form for validation and forms

## Requirements

- Node.js 20 or newer
- npm
- PostgreSQL database
- Redis instance
- Google OAuth credentials (optional if Google sign-in is not needed)
- SMTP account for OTP and password-reset email
- Google Gemini API key
- OpenRouteService API key for nearby-college search

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root. Do not commit it. Use the following variable names:

```dotenv
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
DIRECT_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"

AUTH_SECRET="a-long-random-secret"
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"

REDIS_URL="rediss://USER:PASSWORD@HOST:6379"

SMTP_HOST="smtp.example.com"
SMTP_PORT="465"
SMTP_USER="your-smtp-user"
SMTP_PASSWORD="your-smtp-password"
# Optional: SMTP_FROM="Eduvora <no-reply@example.com>"

GEMINI_API_KEY_1="your-gemini-key"
# Optional fallback key:
GEMINI_API_KEY_2="your-second-gemini-key"

OPENROUTESERVICE_API_KEY="your-openrouteservice-key"
```

`DATABASE_URL` is used by the application and Prisma migrations. `DIRECT_URL` is useful for providers that expose separate pooled and direct PostgreSQL endpoints. The application expects TLS-enabled Redis and SMTP credentials when OTP or password recovery is used.

### 3. Prepare the database

Generate the Prisma client and apply the checked-in migrations:

```bash
npx prisma generate
npx prisma migrate deploy
```

For local schema development, use `npx prisma migrate dev --name describe-your-change` instead of editing the database manually.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server after a build |
| `npm run lint` | Run ESLint |
| `npx prisma generate` | Generate the Prisma client |
| `npx prisma migrate deploy` | Apply existing migrations |
| `npx prisma migrate dev --name <name>` | Create and apply a development migration |
| `npx prisma studio` | Open the Prisma database browser |

## User flow

1. A student creates an account or signs in with Google.
2. Email-based flows verify the account with an OTP.
3. The student selects class 10 or class 12 and completes the assessment.
4. Subject marks and quiz answers are saved to an assessment.
5. Gemini generates a personalized result, which is stored with the assessment.
6. The student can review recommendations, compare courses, and search for nearby colleges.

## Project structure

```text
src/
├── app/                 Next.js routes, pages, and API endpoints
├── components/          Reusable UI and feature components
├── data/quiz/           Class-specific quiz questions
├── lib/                 Prisma, Redis, mail, Gemini, and shared utilities
├── types/               Shared TypeScript types
└── validations/         Zod schemas for request and form validation
prisma/
├── schema.prisma        PostgreSQL data model
└── migrations/          Versioned database migrations
```

The main persisted entities are `User`, `Assessment`, `Mark`, and `QuizAnswer`. Assessment results are stored as JSON on `Assessment.aiResult`.

## Deployment

Build and run the application in a production environment with:

```bash
npm run build
npm run start
```

Before deploying, configure all required environment variables in the hosting provider, run `npx prisma migrate deploy` against the production database, and ensure the deployment URL is registered with the Google OAuth client. Never expose server-only keys in client components or `NEXT_PUBLIC_*` variables.

## Security notes

- Keep `.env` out of source control; use a secret manager in production.
- Rotate any database, OAuth, Redis, SMTP, Gemini, or OpenRouteService credentials that have been exposed or committed.
- Use a unique, randomly generated `AUTH_SECRET` for each environment.
- Restrict OAuth redirect URLs and SMTP permissions to the deployment that needs them.

## Troubleshooting

- **Database connection errors:** verify `DATABASE_URL`, TLS settings, and that migrations have been applied.
- **OTP emails are not sent:** check `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, and the provider's SMTP restrictions.
- **AI results fail:** verify `GEMINI_API_KEY_1` and, if configured, the fallback key and quota.
- **Nearby colleges fail:** verify `OPENROUTESERVICE_API_KEY` and browser location permissions.
- **Authentication redirects fail:** confirm `AUTH_SECRET`, Google credentials, and the provider's callback URL.

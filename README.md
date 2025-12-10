# Space

## Prerequisites

- **Bun** (>1.3.3) - Required as both package manager and runtime
  - Install from [bun.sh](https://bun.sh)
- **PostgreSQL** - Database server (local or cloud instance)

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd space
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

## Environment Setup

1. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

2. Configure the following environment variables in `.env`:

   ### `DATABASE_URL`

   PostgreSQL connection string.

   Format: `postgresql://username:password@host:port/database`

   Example for local PostgreSQL:

   ```
   DATABASE_URL=postgresql://postgres:password@localhost:5432/space
   ```

   ### `AUTH_SECRET`

   Secret key used for JWT token signing. Generate a secure random string:

   ```bash
   openssl rand -base64 32
   ```

   Example:

   ```
   AUTH_SECRET=your-generated-secret-key-here
   ```

   ### `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`

   Credentials from your GitHub OAuth App.
   1. Go to GitHub Settings → Developer settings → OAuth Apps
   2. Create a new OAuth App
   3. Set Authorization callback URL to: `http://localhost:8008/api/auth/callback/github`
   4. Copy the Client ID and Client Secret to your `.env` file

   Example:

   ```
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   ```

   ### `ADMIN_EMAIL`

   Email address of the user who will have access to the application. **Only this user will be able to authenticate and access the application** - all other users will be denied access.

   Example:

   ```
   ADMIN_EMAIL=admin@example.com
   ```

## Database Setup

1. Push the database schema:
   ```bash
   bun run db:push
   ```

## Running the Project

Start the development server:

```bash
bun run dev
```

The application will be available at [http://localhost:8008](http://localhost:8008).

## Available Scripts

- `bun run dev` - Start development server on port 8008
- `bun run build` - Build the application for production
- `bun run start` - Start production server
- `bun run lint` - Run ESLint
- `bun run type-check` - Run TypeScript type checking
- `bun run format` - Format code with Prettier
- `bun run db:push` - Push database schema changes
- `bun run db:pull` - Pull database schema
- `bun run db:studio` - Open Drizzle Studio for database management

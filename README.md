# Ikonik - Spanish Real Estate Investment Advisor

Ikonik is an AI-powered real estate investment advisor focused on Spanish properties. It provides personalized recommendations based on location, budget, property type, and user preferences.

## Features

- 🏠 Property type analysis and recommendations
- 💰 Budget-based investment advice
- 📍 Location-specific insights for Spanish regions
- 🎓 Education and amenities analysis
- 📈 Property appreciation intelligence
- 🔍 Multi-location comparison tools
- 👤 User interaction tracking and analytics
- 🔐 Secure admin panel with JWT authentication

## Tech Stack

- **Frontend**: React with TanStack Router (SPA)
- **Backend**: tRPC for type-safe API endpoints
- **Database**: PostgreSQL with Prisma ORM
- **AI**: OpenAI integration for intelligent recommendations
- **Styling**: Tailwind CSS
- **State Management**: Zustand, React Query
- **Build Tool**: Vinxi
- **Container**: Docker & Docker Compose

## Prerequisites

- Node.js 18+ and pnpm
- Docker and Docker Compose
- OpenAI API key
- PostgreSQL (via Docker or local installation)

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/lclifforda/Ikonik.git
cd Ikonik
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
# Application
APP_NAME=ikonik
NODE_ENV=development
PORT=8000

# Authentication
ADMIN_PASSWORD=your_secure_admin_password
JWT_SECRET=your_jwt_secret_key

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/app

# OpenAI
OPENAI_API_KEY=your_openai_api_key
```

### 4. Start Docker services

```bash
./scripts/docker-compose up -d
```

This will start:
- PostgreSQL database (port 5432)
- Redis cache
- MinIO object storage
- Nginx reverse proxy
- Adminer database UI (port 8080)

### 5. Set up the database

```bash
# Generate Prisma client
pnpm prisma generate

# Run database migrations
pnpm db:migrate

# (Optional) Seed the database
pnpm db:seed
```

### 6. Generate TypeScript routes

```bash
pnpm tsr generate
```

### 7. Start the development server

```bash
pnpm dev
```

The application will be available at http://localhost:3000

## Development

### Available Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server

# Database
pnpm db:generate  # Generate Prisma migrations
pnpm db:migrate   # Apply migrations
pnpm db:push      # Push schema changes
pnpm db:studio    # Open Prisma Studio GUI

# Code Quality
pnpm typecheck    # Run TypeScript type checking
pnpm lint         # Run ESLint
pnpm format       # Format code with Prettier

# Docker
./scripts/docker-compose up    # Start all services
./scripts/run                  # Run the application
./scripts/stop                 # Stop services
```

### Project Structure

```
Ikonik/
├── src/
│   ├── components/       # React components
│   ├── routes/          # TanStack Router routes
│   ├── lib/             # Utility functions and libraries
│   ├── server/          # Server-side code and tRPC routers
│   └── styles/          # Global styles
├── prisma/
│   └── schema.prisma    # Database schema
├── docker/              # Docker configuration
├── public/              # Static assets
└── scripts/             # Utility scripts
```

### Key Components

- **RealEstateForm**: Main form for user inputs
- **Admin Panel**: Located at `/admin` (password protected)
- **API Routes**: Type-safe tRPC endpoints in `src/server/routers/`
- **Database Models**: UserInteraction, QueryLog, UserPreference

## Production Deployment

### Using Docker

1. Build the Docker image:

```bash
docker build -f docker/Dockerfile -t ikonik .
```

2. Run with Docker Compose:

```bash
docker-compose -f docker/compose.yaml up -d
```

### Manual Deployment

1. Build the application:

```bash
pnpm build
```

2. Set production environment variables
3. Run database migrations:

```bash
NODE_ENV=production pnpm db:migrate
```

4. Start the production server:

```bash
NODE_ENV=production pnpm start
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `APP_NAME` | Application name | Yes |
| `NODE_ENV` | Environment (development/production) | Yes |
| `PORT` | Server port | Yes |
| `ADMIN_PASSWORD` | Admin panel password | Yes |
| `JWT_SECRET` | JWT secret for authentication | Yes |
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `OPENAI_API_KEY` | OpenAI API key for AI features | Yes |

## Troubleshooting

### Database connection issues

Ensure PostgreSQL is running and the `DATABASE_URL` is correct:

```bash
# Check Docker containers
docker ps

# View database logs
docker-compose logs postgres
```

### Port conflicts

If port 3000 or 8000 is already in use, update the `PORT` in `.env` and restart.

### Prisma issues

```bash
# Regenerate Prisma client
pnpm prisma generate

# Reset database (WARNING: This will delete all data)
pnpm prisma db push --force-reset
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.

## Support

For issues and questions, please open an issue on GitHub or contact the development team.
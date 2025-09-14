## Project Structure (Clean Architecture)
```
KANBAN-BOARD-SYSTEM
├── docs/                  # Project documentation
├── logs/                  # Application logs
├── node_modules/          # Installed npm dependencies
├── prisma/                # Prisma ORM setup
│   ├── migrations/        # Database migration files
│   ├── schema.prisma      # Prisma schema definition
│   └── seed.js            # Script to seed initial data
├── src/                   # Main application source code
│   ├── api/               # API layer
│   │   ├── controllers/   # Handle request/response logic
│   │   ├── middlewares/   # Express middlewares (auth, logging, etc.)
│   │   └── routes/        # API routes
│   ├── config/            # Application configuration (DB, JWT, etc.)
│   ├── repositories/      # Database access layer (queries, persistence)
│   ├── schemas/           # Data validation schemas (Joi/Zod, etc.)
│   ├── services/          # Business logic layer
│   └── app.js             # Express app setup
├── server.js              # Application entry point
├── .env                   # Environment variables
├── .gitignore             # Git ignore configuration
├── docker-compose.yml     # Docker Compose setup
├── dockerfile             # Docker file setup
├── package.json           # Project dependencies and scripts
├── package-lock.json      # Locked dependency versions
└── README.md              # Project documentation
```
## Setup Instructions

### 1.Clone the repo

```bash
git clone https://github.com/Thanthiti/Kanban-Board-System.git
cd Kanban-Board-System
```

### 2.Setup Environment Variables for docker
```bash
#App
DATABASE_URL="postgresql://myuser:kanbanpassword@db:5432/kanban?schema=public"
PORT=3000

#Database
POSTGRES_USER=myuser
POSTGRES_PASSWORD=kanbanpassword
POSTGRES_DB=kanban
PGADMIN_DEFAULT_EMAIL=admin@admin.com
PGADMIN_DEFAULT_PASSWORD=1234
DB_PORT=5433
PGADMIN_PORT=5050

#JWT
JWT_SECRET="secretKey"
JWT_EXPIRES_IN="1d"
```


### 3. Start the App with Docker Compose
```bash
docker-compose up --build
```
### 4.Run Prisma Migration (inside container) 
```bash
docker compose exec app npx prisma migrate dev --name init
````
### 5. Run Seed Data (inside container)
```bash
docker compose exec app npx prisma db seed
```
### 6. Verify the Results

Open pgAdmin in your browser:
👉 http://localhost:5050

Login using the email/password you defined in your .env file.

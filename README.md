# JWT Authentication + Node.js Project

# Getting started

1. Download project
2. Install all depend
3. Install all dependencies:
   ```bash
   cd jwt-auth-node
   pnpm install
   ```
4. Create `.env` file:

   ```env
   PORT=3000
   MONGODB_USERNAME=jwtweb
   MONGODB_PASSWORD=pwd123
   MONGODB_DATABASE=jwtAuth

   ACCESS_TOKEN_EXPIRES_IN=15
   ACCESS_TOKEN_PRIVATE_KEY=your-private-key
   ACCESS_TOKEN_PUBLIC_KEY=your-public-key
   ```

5. Create the database with `docker-compose.yaml`:
   ```bash
   docker compose up -d
   ```
6. Start the server
   ```bash
   pnpm dev
   ```

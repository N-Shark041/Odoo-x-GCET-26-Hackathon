
# OdooDo Backend Setup

Run these commands in your terminal to start the server:

1. **Install all dependencies**
   ```bash
   npm install
   ```

2. **Setup Database (SQLite) and Prisma Client**
   ```bash
   npx prisma db push
   ```

3. **Start the server in development mode**
   ```bash
   npm run dev
   ```

## Testing the API

- **Health Check:** `GET http://localhost:3000/`
- **Sign Up:** `POST http://localhost:3000/api/signup`
  - Body (JSON):
    ```json
    {
      "name": "Jane Doe",
      "email": "jane@example.com",
      "password": "StrongPassword123"
    }
    ```

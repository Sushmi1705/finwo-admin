# Deployment Guide for Render

This guide will help you deploy the Admin Panel to Render with separate frontend and backend services.

## Prerequisites

1. Push your code to GitHub (already done ✓)
2. Create a Render account at https://render.com

## Step 1: Deploy Backend

1. Go to Render Dashboard → **New** → **Web Service**
2. Connect your GitHub repository: `Sushmi1705/finwo-admin`
3. Configure the backend service:
   - **Name**: `finwo-admin-backend` (or your choice)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npx prisma generate`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

4. Add Environment Variables:
   - Click **Advanced** → **Add Environment Variable**
   - Add these variables:
     ```
     DATABASE_URL=<your-postgres-url>
     PORT=5000
     JWT_SECRET=<your-secret-key>
     ```
   
5. **Important**: For the database, you have two options:
   - **Option A (Recommended)**: Add a PostgreSQL database in Render
     - Go to **New** → **PostgreSQL**
     - Copy the **Internal Database URL**
     - Use it as `DATABASE_URL` in your backend
     - **Note**: You'll need to update `schema.prisma` to use PostgreSQL instead of SQLite
   
   - **Option B**: Keep SQLite (requires paid plan for persistent disk)

6. Click **Create Web Service**
7. Wait for deployment to complete
8. **Copy your backend URL**: `https://finwo-admin-backend.onrender.com` (example)

## Step 2: Deploy Frontend

1. Go to Render Dashboard → **New** → **Static Site**
2. Connect the same GitHub repository
3. Configure the frontend:
   - **Name**: `finwo-admin-frontend` (or your choice)
   - **Root Directory**: Leave empty (root of repo)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. Add Environment Variable:
   - Click **Advanced** → **Add Environment Variable**
   - Add:
     ```
     VITE_API_URL=https://finwo-admin-backend.onrender.com/api
     ```
     (Replace with your actual backend URL from Step 1)

5. Click **Create Static Site**
6. Wait for deployment to complete

## Step 3: Update Database Schema (If using PostgreSQL)

If you chose PostgreSQL in Step 1, you need to update the schema:

1. Edit `backend/prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. Commit and push:
   ```bash
   git add backend/prisma/schema.prisma
   git commit -m "Update schema for PostgreSQL"
   git push origin main
   ```

3. Render will automatically redeploy

## Step 4: Run Database Migrations

After the backend is deployed:

1. Go to your backend service in Render
2. Click **Shell** (in the top right)
3. Run:
   ```bash
   npx prisma db push
   ```

## Testing

1. Visit your frontend URL: `https://finwo-admin-frontend.onrender.com`
2. Test all features:
   - Categories CRUD
   - Shops CRUD with category filtering
   - Menus CRUD with shop selection

## Troubleshooting

### CORS Issues
If you see CORS errors, ensure your backend's `server.js` has:
```javascript
app.use(cors({
    origin: 'https://finwo-admin-frontend.onrender.com',
    credentials: true
}));
```

### Database Connection Issues
- Check that `DATABASE_URL` is correctly set
- Ensure you've run `npx prisma db push`
- Check Render logs for errors

### Build Failures
- Check build logs in Render dashboard
- Ensure all dependencies are in `package.json`
- Verify build commands are correct

## Notes

- Free tier services sleep after 15 minutes of inactivity
- First request after sleep may take 30-60 seconds
- Consider upgrading for production use

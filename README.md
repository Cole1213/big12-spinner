# Big 12 Wheel Spinner

A biased wheel spinner that declares BYU the best Big 12 team 85% of the time! 🏈

## Features
- Interactive spinning wheel animation
- Persistent results stored in Vercel Postgres
- Real-time statistics and charts
- Responsive design
- Serverless architecture

## Deployment to Vercel

### Quick Deploy (5 minutes)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/big12-wheel-spinner.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Click "Deploy"

3. **Add Vercel Postgres**
   - After deployment, go to your project dashboard
   - Click "Storage" tab
   - Click "Create Database"
   - Select "Postgres"
   - Choose "Continue" (Hobby plan is free)
   - Click "Create"

4. **Redeploy (Important!)**
   - Go to "Deployments" tab
   - Click the three dots on the latest deployment
   - Click "Redeploy"
   - This ensures the database connection is properly configured

5. **Done!** Your app is live! 🎉
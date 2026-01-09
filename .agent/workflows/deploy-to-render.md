---
description: Deploy AutoFlag to Render
---

# Deploy to Render

This workflow guides you through deploying the AutoFlag compiler optimization API to Render.

## Prerequisites

- A Render account (sign up at https://render.com)
- Git repository pushed to GitHub/GitLab/Bitbucket
- GCC compiler support (available in Render's environment)

## Deployment Steps

### 1. Prepare Your Repository

Ensure your code is pushed to a Git repository:

```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### 2. Create render.yaml Configuration

The `render.yaml` file in your repository root defines your service configuration. It's already created for you.

### 3. Deploy to Render

**Option A: Using Render Dashboard (Recommended)**

1. Log in to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect your Git repository
4. Render will auto-detect the `render.yaml` configuration
5. Click "Apply" to create the service
6. Wait for the build and deployment to complete

**Option B: Using Render Blueprint**

1. Log in to https://dashboard.render.com
2. Click "New +" → "Blueprint"
3. Connect your Git repository
4. Render will detect `render.yaml` and create all defined services
5. Review and click "Apply"

### 4. Configure Environment Variables (Optional)

If you need custom environment variables:

1. Go to your service in Render Dashboard
2. Navigate to "Environment" tab
3. Add variables like:
   - `PYTHON_VERSION` (default: 3.10)
   - `PORT` (default: 8000)

### 5. Monitor Deployment

1. Check the "Logs" tab to monitor the build process
2. Once deployed, your service URL will be shown at the top
3. Access your API at: `https://your-service-name.onrender.com`

### 6. Verify Deployment

Test your deployed API:

```bash
curl https://your-service-name.onrender.com/health
```

You should see:
```json
{
  "status": "healthy",
  "timestamp": "2026-01-09T...",
  "jobs_count": 0,
  "active_jobs": 0
}
```

### 7. Access the Web Interface

Open your browser and navigate to:
- Web UI: `https://your-service-name.onrender.com`
- API Docs: `https://your-service-name.onrender.com/docs`

## Important Notes

### Build Time
The first deployment may take 5-10 minutes as Render installs all dependencies.

### Free Tier Limitations
- Your service will spin down after 15 minutes of inactivity
- It will take 30-60 seconds to wake up on the next request
- Consider upgrading to a paid plan for production use

### Persistence
- The `uploads/` and `results/` directories are **ephemeral** on Render's free tier
- Files will be lost when the service restarts
- For production, consider using Render's Persistent Disks or external storage (S3, etc.)

### Custom Domain
To use a custom domain:
1. Go to "Settings" → "Custom Domain"
2. Add your domain
3. Update your DNS records as instructed

## Troubleshooting

### Build Fails
- Check the "Logs" tab for error messages
- Ensure `requirements.txt` is complete
- Verify Python version compatibility

### Service Won't Start
- Check that port 8000 is correctly configured
- Review startup logs for errors
- Ensure uvicorn is properly installed

### GCC Not Found
Render's environment includes GCC by default. If you encounter issues:
1. Add to `render.yaml`:
```yaml
buildCommand: "apt-get update && apt-get install -y gcc && pip install -r requirements.txt"
```

## Updating Your Deployment

Render automatically deploys when you push to your connected branch:

```bash
git add .
git commit -m "Update application"
git push origin main
```

Watch the "Events" tab in Render Dashboard to see the new deployment.

## Cost Optimization

For the free tier:
- Service spins down after inactivity (saves resources)
- 750 hours/month of runtime included
- Perfect for testing and development

For production:
- Upgrade to Starter ($7/month) or higher
- Always-on service with faster builds
- More memory and CPU

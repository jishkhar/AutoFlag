# Deployment Guide for AutoFlag

This guide covers deploying the AutoFlag Compiler Optimization Platform to various cloud providers.

## 📋 Table of Contents

- [Deployment Options](#deployment-options)
- [Render Deployment (Recommended)](#render-deployment-recommended)
- [Vercel Deployment (Frontend Only)](#vercel-deployment-frontend-only)
- [Hybrid Deployment](#hybrid-deployment-best-for-production)
- [Other Platforms](#other-deployment-platforms)

---

## Deployment Options

### Comparison Table

| Platform | Backend Support | Build Time | Free Tier | Best For | Complexity |
|----------|----------------|------------|-----------|----------|------------|
| **Render** | ✅ Full | ~5-10 min | 750h/mo | Complete app | ⭐⭐ Easy |
| **Vercel** | ❌ Limited | ~2-5 min | Unlimited | Frontend only | ⭐⭐⭐ Medium |
| **Railway** | ✅ Full | ~3-7 min | $5 credit | Complete app | ⭐⭐ Easy |
| **Fly.io** | ✅ Full | ~5-10 min | 3 VMs | Docker apps | ⭐⭐⭐⭐ Advanced |

### Why Render is Recommended

✅ **Pros:**
- Supports long-running Python applications
- GCC compiler available out-of-the-box
- Persistent disk storage for uploads/results
- Simple configuration with `render.yaml`
- Free tier includes 750 hours/month
- Automatic HTTPS and custom domains

❌ **Why Not Vercel:**
- Serverless functions have strict timeouts (10s-900s max)
- No GCC compiler in serverless environment
- Read-only filesystem (except /tmp)
- Not designed for long-running optimization jobs

---

## Render Deployment (Recommended)

### Prerequisites
- Render account (https://render.com)
- Git repository (GitHub/GitLab/Bitbucket)

### Quick Start

**1. Push to Git:**
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

**2. Deploy via Render Dashboard:**

1. Visit https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your Git repository
4. Render auto-detects `render.yaml` configuration
5. Click **"Apply"**
6. Wait for build (~5-10 minutes)

**3. Access Your Application:**

Your app will be available at:
- **Web UI**: `https://your-service-name.onrender.com`
- **API Docs**: `https://your-service-name.onrender.com/docs`

### Configuration Details

The `render.yaml` file in your repository configures:
- Python 3.10 runtime
- Automatic dependency installation
- Health check endpoint `/health`
- 1GB persistent disk for uploads/results
- Auto-deploy on git push

### Environment Variables

Optional variables you can set in Render Dashboard:

| Variable | Default | Purpose |
|----------|---------|---------|
| `PYTHON_VERSION` | 3.10 | Python version |
| `PORT` | 8000 | Server port |

### Monitoring

**Check Deployment Status:**
1. Go to your service in Render Dashboard
2. View **"Logs"** tab for real-time output
3. Check **"Events"** tab for deployment history

**Health Check:**
```bash
curl https://your-service-name.onrender.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2026-01-09T12:00:00",
  "jobs_count": 0,
  "active_jobs": 0
}
```

### Important Notes

**Free Tier Behavior:**
- Service spins down after 15 minutes of inactivity
- First request after spin-down takes ~30-60 seconds
- 750 hours/month included (enough for constant uptime)

**Persistent Storage:**
- Disk persists across deployments
- Located at `/opt/render/project/src/data`
- Update code to use this path for production persistence

**Upgrading:**
- Starter plan ($7/mo): Always-on, faster builds
- Professional ($25/mo): Team features, priority support

### Custom Domain

1. Go to **Settings** → **Custom Domain**
2. Add your domain (e.g., `api.yourdomain.com`)
3. Update DNS with provided CNAME record
4. Automatic HTTPS via Let's Encrypt

### Troubleshooting

**Build fails:**
```bash
# Check logs in Render Dashboard
# Common issues:
# - Ensure requirements.txt is complete
# - Verify Python version compatibility
```

**Service won't start:**
```bash
# Check that:
# - Port 8000 is configured correctly
# - uvicorn is in requirements.txt
# - api.py has no syntax errors
```

---

## Vercel Deployment (Frontend Only)

⚠️ **Important**: Vercel cannot run the full AutoFlag backend due to serverless limitations. Use this for **frontend only** or in **hybrid setup**.

### What You Can Deploy

✅ **Static Web Interface** (HTML/CSS/JS)  
❌ **Python Backend** (optimization API)

### Quick Deploy

**1. Prepare Frontend:**
```bash
# Ensure static files are ready
ls static/
# Should show: index.html, script.js, style.css
```

**2. Update API Endpoint:**

Edit `static/script.js` to point to your backend (e.g., Render):
```javascript
const API_BASE_URL = 'https://your-backend.onrender.com';
```

**3. Deploy:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

**4. Access:**
Your frontend will be at: `https://your-project.vercel.app`

### Configuration

The `vercel.json` file configures:
- Static file serving from `/static`
- Proper routing for SPA
- CORS headers
- URL rewrites

---

## Hybrid Deployment (Best for Production)

Combine Vercel's global CDN for frontend with Render's backend capabilities.

### Architecture

```
┌──────────────────┐
│   Vercel         │  ← Global CDN
│   (Frontend)     │  ← Fast static serving
│   static files   │  ← Automatic HTTPS
└────────┬─────────┘
         │
         │ HTTPS API Calls
         │
         ▼
┌──────────────────┐
│   Render         │  ← Python FastAPI
│   (Backend)      │  ← Optimization jobs
│   api.py + GCC   │  ← Persistent storage
└──────────────────┘
```

### Setup Steps

**1. Deploy Backend to Render:**
```bash
# Follow Render deployment steps above
# Note your API URL: https://autoflag-api.onrender.com
```

**2. Configure Frontend for Vercel:**

Edit `static/script.js`:
```javascript
const API_BASE_URL = 'https://autoflag-api.onrender.com';
```

**3. Update CORS on Backend:**

In `api.py`, update for production:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-frontend.vercel.app",
        "http://localhost:8000"  # for local development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**4. Deploy Frontend to Vercel:**
```bash
vercel --prod
```

**5. Test Integration:**
```bash
# Visit your Vercel URL
# Submit an optimization job
# Monitor in Render logs
```

### Benefits

✅ Fast global frontend delivery via Vercel CDN  
✅ Full backend functionality on Render  
✅ Separate scaling for frontend/backend  
✅ Cost-effective (both have free tiers)

---

## Other Deployment Platforms

### Railway

**Pros**: Similar to Render, $5 free credit, simple setup  
**Deploy**: Connect Git repo, Railway auto-detects Python

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Fly.io

**Pros**: Docker support, 3 free VMs, global deployment  
**Cons**: Requires Dockerfile

```dockerfile
# Dockerfile (create this)
FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN apt-get update && apt-get install -y gcc
RUN pip install -r requirements.txt
COPY . .
CMD ["python3", "api.py"]
```

```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Deploy
fly launch
fly deploy
```

### DigitalOcean App Platform

**Pros**: Managed service, predictable pricing  
**Deploy**: Connect repo, configure Python runtime

---

## Comparison: Free Tier Limits

| Feature | Render Free | Vercel Hobby | Railway | Fly.io |
|---------|-------------|--------------|---------|--------|
| **Compute** | 750h/month | ∞ (serverless) | $5 credit | 3 VMs (256MB) |
| **Bandwidth** | 100 GB/mo | 100 GB/mo | ∞ | 160 GB/mo |
| **Build Time** | 500 min/mo | ∞ | ∞ | ∞ |
| **Storage** | 1 GB disk | 100 GB | $5 credit | 3 GB |
| **Timeout** | No limit | 10s-900s | No limit | No limit |

---

## Recommended Workflow

### For Development & Testing
```bash
# Local development
python3 api.py

# Test locally at http://localhost:8000
```

### For Production

**Option 1: Simple (Render Only)**
```bash
git push origin main
# Auto-deploys to Render
```

**Option 2: Hybrid (Faster Frontend)**
```bash
# Deploy backend to Render (automatic on push)
git push origin main

# Deploy frontend to Vercel
vercel --prod
```

---

## Monitoring & Logs

### Render
```bash
# View in Dashboard or CLI
npm install -g render-cli
render logs -s your-service-name -f
```

### Vercel
```bash
vercel logs
```

---

## Cost Optimization

### Free Tier Strategy
- Use Render free tier for backend (750h/mo)
- Use Vercel free tier for frontend (unlimited)
- Total cost: **$0/month**

### Production Strategy
- Render Starter: $7/mo (always-on backend)
- Vercel Hobby: $0 (frontend)
- Total cost: **$7/month**

---

## Security Considerations

### For Production Deployment

1. **Environment Variables**: Store secrets in platform dashboards
2. **CORS**: Restrict origins to your frontend domain
3. **Rate Limiting**: Add rate limiting middleware
4. **Authentication**: Implement API keys for optimization endpoints
5. **HTTPS**: Both Render and Vercel provide automatic HTTPS

Example rate limiting:
```bash
pip install slowapi
```

```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@app.post("/optimize/autoflag")
@limiter.limit("5/minute")
async def optimize_autoflag(...):
    ...
```

---

## Getting Help

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **FastAPI Docs**: https://fastapi.tiangolo.com
- **Project README**: [README.md](README.md)
- **API Docs**: [API_README.md](API_README.md)

---

## Quick Reference: Deployment Commands

```bash
# Render (via Dashboard)
# 1. Push to Git
git push origin main
# 2. Deploy via https://dashboard.render.com

# Vercel (CLI)
vercel --prod

# Railway
railway up

# Fly.io
fly deploy

# Test deployment
curl https://your-app-url.com/health
```

---

**Need more help?** Check the detailed workflow files:
- [Deploy to Render](.agent/workflows/deploy-to-render.md)
- [Deploy to Vercel](.agent/workflows/deploy-to-vercel.md)

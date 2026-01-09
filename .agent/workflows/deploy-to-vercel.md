---
description: Deploy AutoFlag to Vercel
---

# Deploy to Vercel

This workflow guides you through deploying the AutoFlag compiler optimization API to Vercel using serverless functions.

## ⚠️ Important Limitations

Vercel is primarily designed for **frontend applications and serverless functions**. Your AutoFlag application has specific requirements that make Vercel **challenging** for full deployment:

### Why Vercel May Not Be Ideal

1. **Long-Running Processes**: Optimization jobs can take minutes/hours
   - Vercel serverless functions have a 10-second timeout (Hobby)
   - Pro plan: 60 seconds, Enterprise: 900 seconds
   - Your optimizations may exceed these limits

2. **GCC Compiler**: Your app needs GCC for compiling C code
   - Vercel's serverless environment doesn't include GCC
   - Would require custom Docker images (Enterprise only)

3. **File System**: Jobs write to `uploads/` and `results/`
   - Vercel's filesystem is read-only except `/tmp`
   - `/tmp` is cleared between invocations

### Recommended Alternatives

**For Full Application:**
- **Render** (recommended) - supports long-running processes and GCC
- **Railway** - similar to Render with easy Python deployment
- **Fly.io** - supports Docker containers with full control
- **DigitalOcean App Platform** - supports long-running workers

**For Static Frontend Only:**
- You can deploy the web interface to Vercel
- Connect it to a backend API hosted on Render/Railway

## Deployment Option 1: Static Frontend Only (Recommended)

Deploy only the web UI to Vercel and connect to a backend hosted elsewhere.

### Steps

1. **Create a Vercel-specific branch or directory structure**

```bash
# Create a new directory for Vercel deployment
mkdir -p vercel-frontend
cp -r static/* vercel-frontend/
```

2. **Update API endpoints in the frontend**

Edit `vercel-frontend/script.js` to point to your Render/Railway API:

```javascript
const API_BASE_URL = 'https://your-backend.onrender.com';
```

3. **Create vercel.json**

Already created in your project root.

4. **Deploy to Vercel**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd vercel-frontend
vercel
```

Follow the prompts:
- Set up and deploy: Yes
- Which scope: Your account
- Link to existing project: No
- Project name: autoflag-frontend
- Directory: ./
- Override settings: No

5. **Access Your Deployed Frontend**

Vercel will provide a URL like: `https://autoflag-frontend.vercel.app`

## Deployment Option 2: Serverless API (Limited Functionality)

Deploy a **limited version** with short-running endpoints only.

### Limitations
- Cannot run full optimizations (too long)
- Can only serve:
  - Health checks
  - List benchmarks
  - Serve static files
  - Job status lookups (if using external database)

### Steps

1. **Restructure for Vercel Functions**

Create `api/` directory:
```bash
mkdir -p api
```

2. **Create serverless function files**

See the created `api/health.py` and `api/benchmarks.py` files.

3. **Deploy**

```bash
vercel
```

4. **Test**

```bash
curl https://your-project.vercel.app/api/health
```

## Deployment Option 3: Hybrid Approach (Best of Both Worlds)

1. **Vercel**: Host the static frontend
2. **Render/Railway**: Host the full Python API with optimization capabilities

### Architecture

```
┌─────────────────┐
│  Vercel         │
│  (Frontend)     │
│  - index.html   │
│  - script.js    │
│  - style.css    │
└────────┬────────┘
         │
         │ API Calls
         │
         ▼
┌─────────────────┐
│  Render         │
│  (Backend API)  │
│  - FastAPI      │
│  - Optimizers   │
│  - GCC          │
└─────────────────┘
```

### Setup Steps

1. **Deploy Backend to Render**
```bash
# Follow the Render deployment workflow
# Get your API URL: https://autoflag-api.onrender.com
```

2. **Update Frontend for Vercel**

Edit `static/script.js`:
```javascript
const API_BASE_URL = 'https://autoflag-api.onrender.com';
```

3. **Deploy Frontend to Vercel**
```bash
vercel --prod
```

4. **Configure CORS on Render**

Ensure your Render API allows requests from Vercel domain:
```python
# In api.py - already configured with allow_origins=["*"]
# For production, update to:
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Environment Variables

If deploying serverless functions, configure in Vercel Dashboard:

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add:
   - `PYTHON_VERSION`: `3.10`
   - Any API keys or configuration

## Vercel CLI Commands

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs

# List deployments
vercel ls

# Remove deployment
vercel rm [deployment-url]
```

## Monitoring

1. **Dashboard**: https://vercel.com/dashboard
2. **Analytics**: Built-in analytics for frontend performance
3. **Logs**: Real-time function logs (limited for serverless)

## Cost Considerations

### Hobby (Free) Tier
- Unlimited deployments
- 100 GB bandwidth/month
- 10-second serverless function timeout
- Perfect for frontend hosting

### Pro Tier ($20/month)
- 1 TB bandwidth
- 60-second function timeout
- Still insufficient for long optimization jobs

## Recommendation

**Best Deployment Strategy:**

1. ✅ Use **Render** for the complete application (API + Frontend)
   - Simpler setup
   - Supports all features
   - Long-running processes work
   - GCC compiler available

2. 🔄 Hybrid: **Vercel (Frontend) + Render (Backend)**
   - Benefit from Vercel's CDN for frontend
   - Full API functionality on Render
   - Better global performance

3. ❌ Avoid: Vercel-only deployment
   - Too many limitations
   - Core functionality won't work
   - Not cost-effective

## Need Help?

- Vercel Documentation: https://vercel.com/docs
- Vercel Community: https://github.com/vercel/vercel/discussions
- AutoFlag Issues: Check your repository's issues page

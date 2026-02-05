# Deployment Configurations

This directory contains deployment configurations for various cloud platforms.

## Quick Deploy Commands

### AWS (ECS Fargate)

```bash
# Build and push to ECR
aws ecr get-login-password --region <REGION> | docker login --username AWS --password-stdin <AWS_ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com
docker build -t translation-backend ../backend
docker tag translation-backend:latest <AWS_ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com/translation-backend:latest
docker push <AWS_ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com/translation-backend:latest

# Register task definition
aws ecs register-task-definition --cli-input-json file://aws-ecs-task-definition.json

# Create or update service
aws ecs create-service \
  --cluster <CLUSTER_NAME> \
  --service-name translation-backend \
  --task-definition translation-backend \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[<SUBNET_IDS>],securityGroups=[<SECURITY_GROUP_IDS>],assignPublicIp=ENABLED}"
```

### Google Cloud Platform (Cloud Run)

```bash
# Backend deployment
cd ../backend
gcloud builds submit --tag gcr.io/<PROJECT_ID>/translation-backend
gcloud run deploy translation-backend \
  --image gcr.io/<PROJECT_ID>/translation-backend \
  --platform managed \
  --region <REGION> \
  --memory 4Gi \
  --cpu 2 \
  --timeout 300 \
  --allow-unauthenticated

# Frontend deployment
cd ../frontend
gcloud builds submit --tag gcr.io/<PROJECT_ID>/translation-frontend
gcloud run deploy translation-frontend \
  --image gcr.io/<PROJECT_ID>/translation-frontend \
  --platform managed \
  --region <REGION> \
  --set-env-vars BACKEND_URL=<BACKEND_URL> \
  --allow-unauthenticated
```

Or use the configuration file:
```bash
gcloud run services replace gcp-cloud-run.yaml
```

### Azure (Container Apps)

```bash
# Create container registry
az acr create --resource-group <RESOURCE_GROUP> --name <REGISTRY_NAME> --sku Basic

# Build and push images
az acr build --registry <REGISTRY_NAME> --image translation-backend:latest ../backend
az acr build --registry <REGISTRY_NAME> --image translation-frontend:latest ../frontend

# Create container app environment
az containerapp env create \
  --name <ENVIRONMENT_NAME> \
  --resource-group <RESOURCE_GROUP> \
  --location <LOCATION>

# Deploy backend
az containerapp create \
  --name translation-backend \
  --resource-group <RESOURCE_GROUP> \
  --environment <ENVIRONMENT_NAME> \
  --image <REGISTRY_NAME>.azurecr.io/translation-backend:latest \
  --target-port 8000 \
  --ingress external \
  --cpu 2 \
  --memory 4Gi

# Deploy frontend
az containerapp create \
  --name translation-frontend \
  --resource-group <RESOURCE_GROUP> \
  --environment <ENVIRONMENT_NAME> \
  --image <REGISTRY_NAME>.azurecr.io/translation-frontend:latest \
  --target-port 3000 \
  --ingress external \
  --env-vars BACKEND_URL=<BACKEND_URL>
```

### Kubernetes (Generic)

```bash
# Update the image registry in kubernetes.yaml
# Then apply the configuration
kubectl apply -f kubernetes.yaml

# Get the service URL
kubectl get svc -n translation-app translation-frontend
```

### Heroku

```bash
# Backend
cd ../backend
heroku create translation-backend-app
heroku stack:set container
git push heroku main

# Frontend
cd ../frontend
heroku create translation-frontend-app
heroku config:set BACKEND_URL=<BACKEND_URL>
heroku stack:set container
git push heroku main
```

### Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and initialize
railway login
railway init

# Deploy backend
cd ../backend
railway up

# Deploy frontend
cd ../frontend
railway up
```

### Render

Create `render.yaml` in project root:
```yaml
services:
  - type: web
    name: translation-backend
    env: docker
    dockerfilePath: ./backend/Dockerfile
    envVars:
      - key: PORT
        value: 8000
      - key: CORS_ORIGINS
        value: https://translation-frontend.onrender.com
    healthCheckPath: /health
    
  - type: web
    name: translation-frontend
    env: docker
    dockerfilePath: ./frontend/Dockerfile
    envVars:
      - key: BACKEND_URL
        value: https://translation-backend.onrender.com
```

Then connect your repository to Render.

## Environment Variables

### Backend
- `PORT` - Server port (default: 8000)
- `HOST` - Server host (default: 0.0.0.0)
- `CORS_ORIGINS` - Allowed origins (comma-separated)
- `MODEL_CACHE_DIR` - Model cache directory

### Frontend
- `BACKEND_URL` - Backend API URL

## Resource Requirements

### Backend
- **CPU**: 2 cores minimum
- **Memory**: 4GB minimum (8GB recommended)
- **Storage**: 5GB for models
- **GPU**: Optional but recommended

### Frontend
- **CPU**: 0.5-1 core
- **Memory**: 512MB-1GB
- **Storage**: Minimal

## Scaling Considerations

### Horizontal Scaling
- Frontend can scale easily (stateless)
- Backend requires model replication per instance
- Consider shared model storage (EFS, GCS, Azure Files)

### Vertical Scaling
- Backend benefits from more memory/CPU
- GPU instances significantly improve performance

### Cost Optimization
- Use spot/preemptible instances for backend
- Scale down during off-peak hours
- Cache translations to reduce model calls
- Use CDN for frontend

## Monitoring

### Health Checks
- Backend: `GET /health`
- Frontend: Check main page loads

### Metrics to Monitor
- Request latency
- Error rate
- Model loading time
- Memory usage
- CPU usage

### Logging
- Application logs
- Access logs
- Error logs
- Model loading logs

## Security

### Backend
- Enable HTTPS
- Configure CORS properly
- Rate limiting
- Input validation
- API authentication (optional)

### Frontend
- Enable HTTPS
- CSP headers
- Secure environment variables
- XSS protection

## CI/CD

### GitHub Actions Example

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Build and push backend
        run: |
          docker build -t backend ./backend
          # Push to registry
      
      - name: Build and push frontend
        run: |
          docker build -t frontend ./frontend
          # Push to registry
      
      - name: Deploy to cloud
        run: |
          # Deploy commands
```

## Rollback

### Docker-based Platforms
```bash
# Tag previous working version
docker tag <registry>/app:latest <registry>/app:rollback

# Revert to previous version
docker pull <registry>/app:<previous-tag>
docker tag <registry>/app:<previous-tag> <registry>/app:latest
```

### Kubernetes
```bash
kubectl rollout undo deployment/translation-backend -n translation-app
```

## Troubleshooting

### Backend Not Starting
1. Check memory limits (need 4GB+)
2. Verify model download access
3. Check logs for errors
4. Ensure sufficient storage

### Frontend Can't Connect
1. Verify BACKEND_URL is correct
2. Check CORS configuration
3. Ensure backend is healthy
4. Check network/firewall rules

### Performance Issues
1. Increase memory/CPU
2. Use GPU instances
3. Enable model caching
4. Implement request queuing
5. Scale horizontally

## Support

For deployment issues, refer to:
- Main README.md
- Backend README.md
- Frontend README.md
- Platform-specific documentation

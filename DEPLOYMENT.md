# Production Deployment Checklist

## Pre-Deployment

### 1. Environment Variables
- [ ] Set all required environment variables in production
- [ ] Verify Supabase URL and keys
- [ ] Verify YouTube API key
- [ ] Verify Gemini API key
- [ ] Ensure no `.env.local` is committed to git

### 2. Database
- [ ] Run all SQL migrations in production Supabase
- [ ] Verify RLS (Row Level Security) policies are enabled
- [ ] Check database indexes are created
- [ ] Test authentication flow

### 3. Code Quality
- [ ] Run `npm run build` locally to check for errors
- [ ] Fix all TypeScript errors
- [ ] Remove console.logs (auto-removed in production)
- [ ] Check for unused dependencies

### 4. Performance
- [ ] Images optimized and using Next.js Image component
- [ ] API routes have proper caching headers
- [ ] Database queries are optimized with indexes
- [ ] YouTube API calls are cached (1 hour revalidation)

### 5. Security
- [ ] Supabase RLS policies tested
- [ ] API keys are in environment variables (not hardcoded)
- [ ] CORS configured properly
- [ ] Rate limiting considered for API routes

## Deployment Steps

### Vercel Deployment

1. **Connect Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Framework Preset: Next.js (auto-detected)

3. **Configure Environment Variables**
   - Add all variables from `.env.local`
   - Ensure they match production values

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Test the deployed site

## Post-Deployment

- [ ] Test all major features
- [ ] Verify authentication works
- [ ] Check video playback
- [ ] Test search functionality
- [ ] Verify collections/notes saving
- [ ] Monitor error logs in Vercel dashboard
- [ ] Set up custom domain (optional)

## Performance Monitoring

### Key Metrics to Watch
- **Core Web Vitals** (in Vercel Analytics)
  - LCP (Largest Contentful Paint) < 2.5s
  - FID (First Input Delay) < 100ms
  - CLS (Cumulative Layout Shift) < 0.1

- **API Response Times**
  - YouTube API calls
  - Supabase queries
  - Gemini AI responses

### Optimization Tips
1. Monitor Supabase query performance
2. Check YouTube API quota usage
3. Use Vercel Analytics for insights
4. Enable caching where appropriate

## Troubleshooting

### Common Issues

**Build Fails**
- Check TypeScript errors: `npm run build`
- Verify all dependencies installed
- Check environment variables are set

**Database Connection Issues**
- Verify Supabase URL and keys
- Check RLS policies allow access
- Ensure migrations are run

**YouTube API Errors**
- Check API key is valid
- Verify quota limits not exceeded
- Ensure API is enabled in Google Cloud Console

**Slow Performance**
- Check database indexes
- Verify caching is working
- Monitor API response times
- Use Vercel Analytics

## Maintenance

### Regular Tasks
- Monitor error logs weekly
- Check API quota usage
- Review database performance
- Update dependencies monthly
- Backup database regularly

### Updates
```bash
# Update dependencies
npm update

# Check for security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

## Support

For issues or questions:
- Email: shuzaifah02@gmail.com
- Check Vercel deployment logs
- Review Supabase logs

# Netlify Deployment Guide for ChargeWay

## Quick Deployment Options

### Option 1: Netlify Drag & Drop (Easiest)
1. Go to [app.netlify.com](https://app.netlify.com)
2. Sign up or log in
3. Drag and drop the entire `ChargeWay-main` folder into the "Sites" area
4. Wait for deployment to complete (usually takes 30-60 seconds)
5. Your site will be live at a random Netlify URL

### Option 2: Netlify CLI (Recommended for updates)
1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Login to Netlify:
   ```bash
   netlify login
   ```

3. From the ChargeWay-main directory, deploy:
   ```bash
   netlify deploy
   ```

4. Follow the prompts to create a new site
5. For production deployment:
   ```bash
   netlify deploy --prod
   ```

### Option 3: Git Integration (Best for continuous deployment)
1. Push your code to GitHub/GitLab/Bitbucket
2. In Netlify dashboard → "Add new site" → "Import an existing project"
3. Connect your Git repository
4. Configure build settings:
   - Build command: (leave empty - no build needed)
   - Publish directory: `.` (root directory)
5. Deploy!

## Netlify Configuration

The `netlify.toml` file includes:
- **Security headers**: XSS protection, CSP, frame options
- **SPA routing**: All routes redirect to index.html for client-side routing
- **Image placeholder support**: Allows via.placeholder.com for fallback images

## Important Notes

### localStorage Persistence
- **Local development**: localStorage works normally
- **Netlify deployment**: localStorage works per browser (same as GitHub Pages)
- **No backend required**: The site uses client-side storage only
- **Demo data**: Automatically initializes on first visit

### Custom Domain (Optional)
1. In Netlify dashboard → Site settings → Domain management
2. Add custom domain (e.g., chargeway.yourdomain.com)
3. Update DNS records as instructed by Netlify

### Environment Variables (Optional)
If you need to add environment variables:
1. Site settings → Environment variables
2. Add key-value pairs
3. Access in JavaScript via `process.env.VARIABLE_NAME` (requires build step)

## Troubleshooting

### If deploy fails:
- Check that all files are in the root directory
- Ensure `index.html` exists
- Verify file permissions are correct

### If localStorage issues occur:
- Clear browser cache and localStorage
- Check browser console for errors
- Verify JavaScript is loading correctly

### If styles don't load:
- Check `styles.css` is in the root directory
- Verify CSS file paths in HTML are correct
- Check for any build errors in Netlify logs

## Advantages of Netlify over GitHub Pages

1. **Faster deployment**: Often under 30 seconds
2. **Form handling**: Built-in form submissions (if needed later)
3. **Serverless functions**: Easy to add backend functionality
4. **Preview deployments**: Automatic previews for pull requests
5. **Edge caching**: Global CDN for faster loading
6. **Analytics**: Built-in site analytics
7. **Rollback**: Easy rollback to previous deployments

## Post-Deployment Checklist

- [ ] Test all pages load correctly
- [ ] Verify booking flow works
- [ ] Test admin login (admin/admin123)
- [ ] Check localStorage functionality
- [ ] Verify responsive design on mobile
- [ ] Test admin charger status changes
- [ ] Confirm charging station page displays correctly
- [ ] Check contact form (if applicable)

## Continuous Updates

After initial deployment, update your site by:
- **Drag & drop**: Redeploy the updated folder
- **CLI**: Run `netlify deploy --prod` again
- **Git**: Push to your connected repository

Your ChargeWay website is now ready for Netlify deployment!
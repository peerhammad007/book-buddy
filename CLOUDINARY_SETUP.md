# Cloudinary Setup Guide

## Step 1: Create a Cloudinary Account

1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. After registration, you'll be redirected to your dashboard

## Step 2: Get Your Cloudinary Credentials

On your Cloudinary dashboard, you'll find your credentials:

- **Cloud Name**: This is your unique cloud name
- **API Key**: Your API key for authentication
- **API Secret**: Your API secret (keep this secure)

## Step 3: Update Your .env File

Replace the placeholder values in your `backend/.env` file with your actual Cloudinary credentials:

```
CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=your_actual_api_key
CLOUDINARY_API_SECRET=your_actual_api_secret
```

## Step 4: Deploy to Production

When deploying to Render:

1. Go to your Render dashboard
2. Open your backend service
3. Go to "Environment" tab
4. Add the following environment variables:
   - `CLOUDINARY_CLOUD_NAME`: your_actual_cloud_name
   - `CLOUDINARY_API_KEY`: your_actual_api_key
   - `CLOUDINARY_API_SECRET`: your_actual_api_secret

## Step 5: Test the Setup

1. Start your backend server locally
2. Test image uploads through your frontend
3. Check that images are being stored in your Cloudinary account under the "bookbuddy" folder

## Benefits of This Solution

- ✅ Images are stored in the cloud and accessible from anywhere
- ✅ Persistent storage (images don't disappear when server restarts)
- ✅ Built-in CDN for fast image loading
- ✅ Automatic image optimization
- ✅ No need to manage local file storage

## Troubleshooting

If you encounter issues:

1. **403 Forbidden**: Check that your API credentials are correct
2. **Network errors**: Ensure your server has internet access
3. **Upload fails**: Check file types are supported (jpeg, jpg, png)

## What Changed in Your Code

1. **Upload Middleware**: Now uses Cloudinary storage instead of local disk storage
2. **Controllers**: Updated to use `req.file.path` (Cloudinary URL) instead of `req.file.filename`
3. **Frontend**: Already handles absolute URLs, so no changes needed
4. **Static File Serving**: Removed as we're using Cloudinary URLs

Your application will now store all uploaded images in Cloudinary and serve them via Cloudinary's CDN.

# Instagram Graph API Setup Guide

Step-by-step guide to configure Instagram API for automated posting.

## Prerequisites

- Instagram Business Account (@kinetikui)
- Facebook Page linked to Instagram account
- Meta Developer Account

## Step 1: Create Meta App

1. Go to https://developers.facebook.com/apps/
2. Click **Create App**
3. Select **Business** as app type
4. Fill in app details:
   - App Name: "Kinetik UI Automation"
   - Contact Email: your email
5. Click **Create App**

## Step 2: Add Instagram Product

1. In your app dashboard, find **Instagram** in Products
2. Click **Set Up** next to Instagram Basic Display
3. Also add **Instagram Graph API**

## Step 3: Configure Instagram Basic Display

1. Click **Settings** under Instagram Basic Display
2. Add **OAuth Redirect URIs**: `https://localhost`
3. Save changes

## Step 4: Get Instagram Business Account ID

### Method 1: Graph API Explorer

1. Go to https://developers.facebook.com/tools/explorer/
2. Select your app
3. Get User Access Token with permissions:
   - `instagram_basic`
   - `instagram_content_publish`
   - `pages_read_engagement`
   - `pages_show_list`
4. Run query:
   ```
   GET /me/accounts
   ```
5. Copy the `id` of your Facebook Page
6. Run query:
   ```
   GET /{page-id}?fields=instagram_business_account
   ```
7. Copy the `instagram_business_account.id` - **This is your Account ID**

### Method 2: Direct API Call

```bash
# Get Facebook Page ID
curl -X GET "https://graph.facebook.com/v21.0/me/accounts?access_token=YOUR_USER_TOKEN"

# Get Instagram Business Account ID
curl -X GET "https://graph.facebook.com/v21.0/{PAGE_ID}?fields=instagram_business_account&access_token=YOUR_USER_TOKEN"
```

## Step 5: Generate Long-Lived Access Token

User access tokens expire after 1 hour. Convert to long-lived (60 days):

```bash
curl -X GET "https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=YOUR_APP_ID&client_secret=YOUR_APP_SECRET&fb_exchange_token=SHORT_LIVED_TOKEN"
```

**Response:**
```json
{
  "access_token": "LONG_LIVED_TOKEN",
  "token_type": "bearer",
  "expires_in": 5183944
}
```

## Step 6: Test API Access

```bash
# Test account access
curl -X GET "https://graph.facebook.com/v21.0/{INSTAGRAM_ACCOUNT_ID}?fields=username,profile_picture_url&access_token=YOUR_TOKEN"

# Should return:
{
  "username": "kinetikui",
  "profile_picture_url": "...",
  "id": "..."
}
```

## Step 7: Configure in Dashboard

1. Open dashboard: http://localhost:3001 (or your Vercel URL)
2. Go to **Settings** page
3. Enter:
   - **Access Token**: Your long-lived token
   - **Account ID**: Your Instagram Business Account ID
4. Click **Save Settings**

## Step 8: Test Upload

### Using Dashboard:

1. Go to **Preview** page
2. Select a template
3. Fill in title/caption
4. Click **Create & Queue Video**
5. Wait for rendering (check Dashboard stats)
6. Video will auto-post at next scheduled time

### Using API:

```bash
# Create video
VIDEO_ID=$(curl -X POST http://46.62.209.17:3000/api/videos \
  -H "Content-Type: application/json" \
  -d '{
    "compositionId": "ComponentShowcase",
    "title": "Test Post",
    "caption": "Testing automation 🚀",
    "hashtags": "#kinetikui #reactjs #animation",
    "props": {}
  }' | jq -r '.id')

# Check status
curl http://46.62.209.17:3000/api/videos/$VIDEO_ID
```

## Permissions Required

Your access token MUST have these permissions:
- `instagram_basic` - Read profile info
- `instagram_content_publish` - Create and publish posts
- `pages_read_engagement` - Read page data
- `pages_show_list` - List pages

## Token Refresh

Access tokens expire after 60 days. Set up auto-refresh:

1. Use the same exchange endpoint before expiry
2. Or implement Facebook Login flow for automatic refresh
3. Monitor token expiry in `backend/error.log`

## Troubleshooting

### Error: "Invalid OAuth access token"
- Token expired - generate new long-lived token
- Wrong permissions - regenerate with all required scopes

### Error: "Account not found"
- Wrong Account ID - verify it's Instagram Business Account (not Personal)
- Page not linked to Instagram - link in Instagram app settings

### Error: "Media container failed"
- Video URL not publicly accessible
- Video format not supported (must be MP4, H.264)
- Video too long/short (Instagram Reels: 3-90 seconds)

### Error: "Publishing not allowed"
- Account not Business/Creator account
- Missing `instagram_content_publish` permission
- Rate limit exceeded (max 25 posts/day)

## Rate Limits

- **API Calls**: 200 calls/hour per user
- **Media Publishing**: 25 posts/day
- **Container Creation**: 50 containers/hour

Our scheduler posts 3x/day, well within limits.

## Security Best Practices

1. **Never commit tokens to Git**
2. Store tokens in database (encrypted if possible)
3. Use environment variables for app secrets
4. Rotate tokens every 30 days
5. Monitor API usage in Meta App Dashboard

## Useful Links

- [Instagram Graph API Docs](https://developers.facebook.com/docs/instagram-api)
- [Content Publishing](https://developers.facebook.com/docs/instagram-api/guides/content-publishing)
- [Access Tokens](https://developers.facebook.com/docs/facebook-login/guides/access-tokens)
- [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
- [App Dashboard](https://developers.facebook.com/apps/)

## Support

If you encounter issues:
1. Check `backend/error.log` for detailed errors
2. Verify permissions in Graph API Explorer
3. Test API calls manually with curl
4. Review Meta App Dashboard for usage/errors

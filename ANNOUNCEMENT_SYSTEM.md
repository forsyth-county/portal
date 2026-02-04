# Announcement System Documentation

## Overview

The Forsyth Games Portal now has a global announcement system that allows admins to broadcast messages to all users across the site. Announcements appear as an animated banner at the top of all pages, including game pages.

## Features

- ✅ **Global Visibility**: Announcements appear on all pages, including over game iframes
- ✅ **Multiple Types**: Support for Info, Warning, and Success announcements with color-coded styling
- ✅ **Auto-dismiss**: Announcements automatically dismiss after 6 seconds
- ✅ **Manual Dismiss**: Users can manually close announcements
- ✅ **Session Memory**: Dismissed announcements won't show again in the same browser session
- ✅ **Real-time Updates**: System polls for new announcements every 30 seconds
- ✅ **Beautiful UI**: Animated appearance with gradient backgrounds and shine effects

## How to Post an Announcement

### Step 1: Access Admin Panel
1. Navigate to `/admin` on the site
2. Enter the admin passcode (default: 1140)

### Step 2: Create Announcement
1. Select announcement type (Info, Warning, or Success)
2. Type your message in the text area
3. Preview how it will look to users
4. Click "Broadcast Announcement"

### Step 3: Deploy the Announcement
1. Copy the generated JSON content
2. Update `/public/announcement.json` in the repository with the copied content
3. Commit and push the changes to GitHub
4. The site will automatically rebuild and deploy with the new announcement

## Announcement File Format

The `/public/announcement.json` file has the following structure:

```json
{
  "message": "Your announcement message here",
  "type": "info",
  "timestamp": 1707078000000,
  "id": "unique-id-here",
  "enabled": true
}
```

### Fields:
- **message**: The text to display to users
- **type**: One of `"info"`, `"warning"`, or `"success"`
- **timestamp**: Unix timestamp (in milliseconds)
- **id**: A unique identifier for this announcement
- **enabled**: Set to `true` to show, `false` to hide

## To Disable an Announcement

Update `/public/announcement.json` with:

```json
{
  "message": "",
  "type": "info",
  "timestamp": 0,
  "id": "",
  "enabled": false
}
```

Or use the "Disable" button in the admin panel and follow the deployment steps.

## Technical Details

- **Component**: `AnnouncementBanner.tsx`
- **Admin Page**: `/app/admin/page.tsx`
- **Data Source**: `/public/announcement.json`
- **Z-Index**: 100 (appears above all content including game iframes)
- **Position**: Fixed at top of viewport
- **Polling Interval**: 30 seconds

## Visibility on Game Pages

The announcement banner has a z-index of 100, which ensures it appears above:
- Game iframes
- Navigation bars
- Loading overlays
- All other page content

This guarantees all users see important announcements even while playing games.

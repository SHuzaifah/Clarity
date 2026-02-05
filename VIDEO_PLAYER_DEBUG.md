# Video Player Grey Screen - Debugging Guide

## 🔍 Changes Made

### 1. **Fixed ReactPlayer Import** ✅
- Changed from: `dynamic(() => import("react-player"))`
- Changed to: `dynamic(() => import("react-player").then(mod => mod.default))`
- **Why**: Properly extracts the default export from the react-player module

### 2. **Added Debugging Console Logs** 🐛
```tsx
console.log('🎥 FocusPlayer mounted with videoId:', videoId);
console.log('🔗 Full URL:', `https://www.youtube.com/watch?v=${videoId}`);
console.log('✅ ReactPlayer is ready');
console.error('❌ ReactPlayer error:', error);
```

### 3. **Added Explicit minHeight** 📏
```tsx
<div className="w-full h-full relative" style={{ minHeight: '400px' }}>
```
- Prevents the container from collapsing to 0 height

### 4. **Added playsinline Prop** 📱
```tsx
<ReactPlayer playsinline ... />
```
- Required for Safari/iOS to play videos inline

### 5. **Added Error Handler** ⚠️
```tsx
onError={handleError}
```
- Logs any playback errors to console

### 6. **Added Conditional Rendering** 🛡️
```tsx
{videoId ? (
  <ReactPlayer ... />
) : (
  <div>No video ID provided</div>
)}
```
- Prevents rendering with undefined videoId

### 7. **Added Loading State** ⏳
- Shows spinner while player is loading
- Displays the videoId being loaded
- Helps identify if player is stuck

## 🧪 Testing Steps

### Step 1: Test the Isolated Player
Visit: **http://localhost:3000/test-player**

This page has a minimal ReactPlayer with a known-good YouTube URL. If this works:
- ✅ ReactPlayer library is working
- ✅ YouTube API is accessible
- ✅ No CSS/layout issues

If this doesn't work:
- ❌ Possible network/firewall issue
- ❌ Possible react-player installation issue

### Step 2: Test Your Video Page
Visit: **http://localhost:3000/watch/fFL7la73RO4**

**Open browser console (Cmd+Option+J)** and look for:

1. **Expected logs:**
   ```
   🎥 FocusPlayer mounted with videoId: fFL7la73RO4
   🔗 Full URL: https://www.youtube.com/watch?v=fFL7la73RO4
   ✅ ReactPlayer is ready
   ```

2. **If you see error logs:**
   - `❌ ReactPlayer error:` → YouTube API issue or video unavailable
   - Network errors → Check CORS/firewall
   - `undefined` videoId → Props not being passed correctly

### Step 3: Check What You See

**Scenario A: Loading spinner forever**
- Player is mounting but not loading
- Check console for errors
- Possible YouTube API quota exceeded
- Possible CORS issue

**Scenario B: Grey screen, no spinner**
- Player mounted but height is 0
- Check browser DevTools → Inspect element
- Look for height values in computed styles

**Scenario C: "No video ID provided"**
- videoId prop is not being passed
- Check the page params in `/app/watch/[videoId]/page.tsx`

**Scenario D: Video loads and plays**
- 🎉 Success! The issue is fixed!

## 🔧 Additional Debugging

### Check the videoId is being passed:
```tsx
// In /app/watch/[videoId]/page.tsx
console.log('Page videoId:', videoId);
```

### Check YouTube API response:
```bash
curl "https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=YOUR_VIDEO_ID&format=json"
```

### Check if iframe is being created:
In browser console:
```javascript
document.querySelector('iframe[src*="youtube"]')
```

Should return an iframe element if ReactPlayer is working.

## 📋 Checklist

- [ ] Test page works at `/test-player`
- [ ] Console shows videoId logs
- [ ] Console shows "ReactPlayer is ready" log
- [ ] No error logs in console
- [ ] iframe element exists in DOM
- [ ] Video plays when clicked

## 🚨 Common Issues

### Issue: "Failed to load resource: net::ERR_BLOCKED_BY_CLIENT"
**Solution**: Ad blocker is blocking YouTube. Disable it.

### Issue: "Video unavailable"
**Solution**: Video is private, deleted, or region-restricted.

### Issue: Quota exceeded
**Solution**: YouTube API quota limit reached. Wait or use different API key.

### Issue: CORS error
**Solution**: YouTube should not have CORS issues. Check network settings.

## 📝 Next Steps

1. **Refresh the page** at `/watch/fFL7la73RO4`
2. **Open browser console** (Cmd+Option+J on Mac)
3. **Look for the emoji logs** (🎥, 🔗, ✅, ❌)
4. **Report back** what you see in the console
5. **Try the test page** at `/test-player` to isolate the issue

The debugging logs will tell us exactly where the problem is!

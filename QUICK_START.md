# Quick Start Guide - Search Pages with Favorites

## 🚀 Setup (One-Time)

### 1. Run Database Migration
```sql
-- Open Supabase Dashboard → SQL Editor
-- Copy and paste content from:
-- supabase/migrations/20260107_create_user_favorites.sql
-- Click "Run"
```

### 2. Verify Migration
```sql
-- Check if table exists
SELECT * FROM user_favorites LIMIT 1;
```

---

## 📋 Testing Guide

### Public Search Page (`/cauta-oferte`)

**Initial State:**
- ✅ Shows 6 mock cards with yellow "Demo" badges
- ✅ No favorite buttons on mock cards
- ✅ No prices displayed

**After Search:**
1. Fill form with destination (e.g., "Paris")
2. Click "Caută oferte"
3. ✅ Mock cards disappear
4. ✅ Real cards appear from AI
5. ✅ Real cards have favorite buttons (❤️)
6. ✅ Still no prices

**Test Searches:**
- `zbor București Londra` → Aviasales
- `activitati Paris` → Klook, Tiqets
- `inchiriere masina Cluj` → Localrent, QEEQ

---

### My Offers Dashboard (`/my-offers-dashboard`)

**Requires Authentication:**
1. Login with Google or create account
2. Navigate to `/my-offers-dashboard`

**Add Favorites:**
1. Go to `/cauta-oferte`
2. Search for offers
3. Click ❤️ on cards
4. Return to dashboard
5. ✅ Cards appear in "Favorite" tab

**Remove Favorites:**
1. Click ❤️ on favorited card
2. ✅ Card disappears from list

**Persistence:**
1. Refresh page
2. ✅ Favorites still there
3. Logout and login
4. ✅ Favorites still there

---

## ✅ Verification Checklist

- [ ] Mock cards appear initially
- [ ] Mock cards have "Demo" badge
- [ ] Mock cards disappear after search
- [ ] Real cards appear from AI
- [ ] NO prices anywhere
- [ ] Favorite button requires auth
- [ ] Favorites save to Supabase
- [ ] Favorites persist across sessions
- [ ] Cards identical in all pages

---

## 🐛 Troubleshooting

**Mock cards don't appear:**
- Check console for errors
- Verify `mockData.js` is imported correctly

**Search returns no results:**
- AI might not detect intent
- Try more specific queries
- Check AI chat function logs

**Favorites don't save:**
- Verify migration was run
- Check Supabase logs
- Verify user is authenticated

**Prices are showing:**
- Should NOT happen - all price code removed
- Report as bug if found

---

## 📁 Key Files

**Components:**
- `src/components/OfferCard.jsx` - Reusable card component

**Public Page:**
- `src/pages/offers/index.jsx` - Main page
- `src/pages/offers/components/SearchOffers.jsx` - Search form
- `src/pages/offers/components/OffersList.jsx` - Results list
- `src/pages/offers/mockData.js` - Mock cards

**Dashboard:**
- `src/pages/my-offers-dashboard/index.jsx` - Main dashboard

**Services:**
- `src/services/favoritesService.js` - Favorites CRUD

**Database:**
- `supabase/migrations/20260107_create_user_favorites.sql` - Migration

---

## 🎯 Success Criteria

✅ All tasks completed
✅ No prices displayed anywhere
✅ Mock cards work correctly
✅ Real search works
✅ Favorites persist in Supabase
✅ Cards identical across pages
✅ RLS policies protect data

---

For detailed testing steps, see: `TESTING_CHECKLIST.md`

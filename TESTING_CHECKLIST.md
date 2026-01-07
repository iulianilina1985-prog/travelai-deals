# Manual Testing Checklist - Search Pages with Favorites

## Prerequisites
- [ ] Vite dev server running on http://localhost:5174
- [ ] Supabase migration executed (run `20260107_create_user_favorites.sql` in Supabase SQL Editor)
- [ ] User account created for testing favorites

---

## Test 1: Public Search Page - Mock Cards

**URL:** http://localhost:5174/cauta-oferte

### Initial Load (Before Search)
- [ ] Page loads without errors
- [ ] 6 mock cards are displayed
- [ ] Each card has a **yellow "Demo" badge** in top-left
- [ ] Provider name is "Demo" with gray color (#94a3b8)
- [ ] Card titles say "Exemplu..." (Example)
- [ ] Descriptions mention "card demonstrativ" (demonstrative card)
- [ ] CTA buttons say "Caută ... reale" (Search real ...)
- [ ] **NO favorite buttons** visible on mock cards
- [ ] **NO prices** displayed anywhere
- [ ] Banner shows "Carduri demonstrative" (Demonstrative cards)
- [ ] Tip message explains these are demo cards

**Expected Mock Cards:**
1. Zbor București → Londra
2. Activități în Paris
3. Închiriere mașină
4. Transfer aeroport
5. eSIM călătorii
6. Cazare hotel

---

## Test 2: Public Search Page - Real Search

### Perform Search
- [ ] Fill in search form:
  - Destination: "Paris"
  - Offer type: "hotel" (or "flight", "car", etc.)
  - (Optional) Add dates
- [ ] Click "Caută oferte" button
- [ ] Loading spinner appears
- [ ] Loading message: "Căutăm cele mai bune oferte..."

### After Search Results
- [ ] Mock cards **completely disappear**
- [ ] Real cards appear from AI
- [ ] Real cards have **NO "Demo" badge**
- [ ] Provider names are real (Aviasales, Klook, Booking, etc.)
- [ ] Provider badges have brand colors (not gray)
- [ ] Descriptions are generic (no prices)
- [ ] CTA buttons say "Vezi oferta" or similar
- [ ] **NO prices** displayed anywhere
- [ ] Header shows "Rezultate căutare" instead of "Exemple de oferte"
- [ ] Result count is displayed (e.g., "3 rezultate")

### Test Different Search Types
- [ ] **Flight search:** "zbor București Londra"
  - Should return Aviasales card
- [ ] **Activity search:** "activitati Paris"
  - Should return Klook, Tiqets cards
- [ ] **Car rental:** "inchiriere masina Cluj"
  - Should return Localrent, QEEQ cards

---

## Test 3: Favorite Button (Unauthenticated)

**On Public Search Page (after real search):**
- [ ] Real cards have a **heart button** in top-right
- [ ] Heart button has white background with gray icon
- [ ] Click heart button
- [ ] Alert appears: "Te rog autentifică-te pentru a salva favorite"
- [ ] Card is NOT saved (no error)

---

## Test 4: My Offers Dashboard (Unauthenticated)

**URL:** http://localhost:5174/my-offers-dashboard

- [ ] Page redirects to /login
- [ ] OR shows message "Te rog autentifică-te"
- [ ] Lock icon displayed
- [ ] "Login" button available

---

## Test 5: Authentication & Favorites

### Login
- [ ] Navigate to /login
- [ ] Login with Google (or create account)
- [ ] Successfully authenticated
- [ ] Redirected to dashboard or home

### Navigate to My Offers Dashboard
**URL:** http://localhost:5174/my-offers-dashboard

- [ ] Page loads without redirect
- [ ] Header shows "Ofertele mele"
- [ ] Two tabs visible: "Favorite" and "Căutări"
- [ ] "Favorite" tab shows count badge (initially 0)

### Initial State (No Favorites)
- [ ] "Favorite" tab is active
- [ ] Empty state displayed:
  - Heart icon with slash
  - "Nicio ofertă favorită"
  - "Salvează ofertele pentru a le regăsi aici"
  - "Caută oferte" button

---

## Test 6: Add Favorites

### From Public Search Page
- [ ] Navigate to /cauta-oferte
- [ ] Perform a search (e.g., "zbor București Paris")
- [ ] Real cards appear
- [ ] Click heart button on a card
- [ ] Heart button turns **red** (filled)
- [ ] No error message
- [ ] Card is saved

### Verify in Dashboard
- [ ] Navigate to /my-offers-dashboard
- [ ] "Favorite" tab shows count badge = 1
- [ ] Saved card appears in favorites list
- [ ] Card is identical to the one from search page
- [ ] Card has red heart button (filled)
- [ ] **NO prices** displayed

### Add More Favorites
- [ ] Return to /cauta-oferte
- [ ] Search for different type (e.g., "activitati Roma")
- [ ] Save 2-3 more cards
- [ ] Return to dashboard
- [ ] All saved cards appear
- [ ] Count badge updates correctly

---

## Test 7: Remove Favorites

### From Dashboard
- [ ] Navigate to /my-offers-dashboard
- [ ] Click red heart button on a favorite card
- [ ] Heart button turns gray (unfilled)
- [ ] Card disappears from favorites list
- [ ] Count badge decreases
- [ ] No error

### From Search Page
- [ ] Navigate to /cauta-oferte
- [ ] Search for a card you previously favorited
- [ ] Card appears with red heart (already favorited)
- [ ] Click heart to unfavorite
- [ ] Heart turns gray
- [ ] Return to dashboard
- [ ] Card is no longer in favorites

---

## Test 8: Persistence

### Refresh Page
- [ ] Add some favorites
- [ ] Refresh /my-offers-dashboard page
- [ ] Favorites still appear
- [ ] Count is correct

### Logout and Login
- [ ] Add favorites
- [ ] Logout
- [ ] Login again
- [ ] Navigate to /my-offers-dashboard
- [ ] **Same favorites** still appear
- [ ] Data persisted in Supabase

---

## Test 9: Data Validation

### Check for Prices
- [ ] Mock cards: NO prices
- [ ] Real cards from search: NO prices
- [ ] Favorite cards in dashboard: NO prices
- [ ] Card descriptions: NO price mentions
- [ ] CTA labels: NO price mentions

### Check Affiliate Links
- [ ] Click CTA on a real card
- [ ] Opens in new tab
- [ ] URL contains affiliate parameters (e.g., marker=688834 for Aviasales)
- [ ] Link goes to correct provider

### Check Card Consistency
- [ ] Cards in AI chat look identical to search page cards
- [ ] Cards in search page look identical to dashboard cards
- [ ] Same structure: image, provider badge, title, description, CTA
- [ ] Same styling and layout

---

## Test 10: Error Handling

### Empty Search Results
- [ ] Search for something obscure (e.g., "zbor București Antarctica")
- [ ] If no results:
  - Empty state displayed
  - "Nu am găsit oferte" message
  - Suggestion to modify search

### Network Error
- [ ] Disconnect internet (or block Supabase)
- [ ] Try to add favorite
- [ ] Error message appears
- [ ] Card is not saved

---

## Test 11: Filters (Dashboard)

**On /my-offers-dashboard:**
- [ ] Add favorites of different types (flight, activity, car)
- [ ] Use filter panel:
  - Search by keyword
  - Filter by destination
  - Filter by deal type
- [ ] Results update correctly
- [ ] Clear filters button works

---

## Test 12: Database Verification

### Supabase Dashboard
- [ ] Open Supabase Dashboard → Table Editor
- [ ] Navigate to `user_favorites` table
- [ ] Verify records exist for your user
- [ ] Check columns:
  - `user_id` matches your auth user ID
  - `offer_id` is unique
  - `offer_type` is correct (flight, activity, etc.)
  - `provider` is correct (Aviasales, Klook, etc.)
  - `offer_snapshot` contains full card data (JSONB)
  - `affiliate_link` contains correct URL
  - `created_at` has timestamp

### RLS Policies
- [ ] Login as different user
- [ ] Navigate to /my-offers-dashboard
- [ ] Should see ONLY their own favorites
- [ ] Should NOT see other users' favorites

---

## Summary Checklist

- [ ] Mock cards appear initially on public page
- [ ] Mock cards disappear after search
- [ ] Real cards appear from AI
- [ ] NO prices anywhere
- [ ] Favorite button requires authentication
- [ ] Favorites save to Supabase
- [ ] Favorites persist across sessions
- [ ] Cards are identical across all pages
- [ ] Affiliate links work correctly
- [ ] RLS policies protect user data

---

## Known Issues / Notes

- Migration must be run manually in Supabase SQL Editor
- Browser rate limiting may prevent automated testing
- Some searches may return empty results if AI doesn't detect intent

---

**Test Date:** _______________
**Tester:** _______________
**Status:** _______________

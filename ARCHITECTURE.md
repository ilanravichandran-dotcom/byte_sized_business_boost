# Code Architecture & Modularity Guide

## Overview
LocalLens has been refactored into a **modular, service-oriented architecture** for better maintainability, testability, and scalability.

## Module Structure

### 📦 Core Modules

#### 1. **business-service.js** - Business Logic
Handles all business-related computations and operations.

**Responsibilities:**
- Calculate ratings from reviews
- Filter businesses by category
- Search businesses by name/description
- Sort businesses by various criteria
- Format dates and escape HTML
- Generate statistics

**Key Functions:**
```javascript
BusinessService.calculateRating(reviews)
BusinessService.filterByCategory(businesses, category)
BusinessService.searchBusinesses(businesses, searchTerm)
BusinessService.sortBusinesses(businesses, sortBy)
BusinessService.getStatistics(businesses)
```

**Why it's separate:** All business logic is isolated, making it easy to unit test and reuse in different contexts.

---

#### 2. **data-manager.js** - Data Persistence & Sync
Manages all data loading, saving, and Supabase synchronization.

**Responsibilities:**
- Load/save to localStorage
- Initialize Supabase connection
- Sync data from Supabase
- Save reviews and favorites to cloud
- Manage client ID generation

**Key Functions:**
```javascript
DataManager.loadBusinesses()
DataManager.loadFavorites()
DataManager.saveBusinesses(businesses)
DataManager.initSupabase()
DataManager.syncFromSupabase(businesses)
DataManager.saveReviewToSupabase(businessId, review)
```

**Why it's separate:** Decouples persistence logic from UI and business logic, allowing easy swapping of storage backends.

---

#### 3. **verification.js** - Bot Prevention
Manages user verification to prevent automated access.

**Responsibilities:**
- Show verification modal
- Validate user answers
- Track verification status
- Provide validation utilities

**Key Functions:**
```javascript
VerificationManager.initialize()
VerificationManager.showModal()
VerificationManager.verify()
VerificationManager.getIsVerified()
VerificationManager.validateText(text, min, max)
```

**Why it's separate:** Security logic is isolated and can be tested independently.

---

#### 4. **report-generator.js** - Report Functionality
Generates customizable reports and exports.

**Responsibilities:**
- Filter businesses for reports
- Format data for export
- Generate CSV content
- Create HTML previews
- Handle printing

**Key Functions:**
```javascript
ReportGenerator.getFilters(businesses)
ReportGenerator.downloadCSV(businesses)
ReportGenerator.preview(businesses)
ReportGenerator.print(businesses)
```

**Why it's separate:** Report logic can be extended without affecting other features.

---

#### 5. **ui-renderer.js** - UI Rendering
Handles all DOM manipulation and rendering.

**Responsibilities:**
- Render business cards
- Display modals
- Update statistics
- Manage section visibility
- Generate error/success messages

**Key Functions:**
```javascript
UIRenderer.renderBusinesses(businesses, containerId)
UIRenderer.openBusinessDetail(business, businesses, favorites)
UIRenderer.renderDeals(businesses)
UIRenderer.updateStatistics(businesses)
UIRenderer.showSection(sectionId)
```

**Why it's separate:** Separates presentation from logic, making UI changes easier.

---

#### 6. **app-state.js** - Application State Coordinator
Central coordinator managing app state and orchestrating all modules.

**Responsibilities:**
- Initialize application
- Maintain global state (businesses, favorites, verified status)
- Coordinate between modules
- Manage event listeners
- Handle user interactions

**Key Functions:**
```javascript
AppState.initialize()
AppState.showSection(sectionId)
AppState.toggleFavorite(businessId)
AppState.submitReview(event, businessId)
AppState.openBusinessDetail(businessId)
```

**Why it's the center:** Single source of truth for application state, coordinating all modules.

---

## Data Flow

```
[User Action]
      ↓
  [Event Listener] (setupEventListeners in app-state.js)
      ↓
[AppState Method] (e.g., toggleFavorite, submitReview)
      ↓
  ├→ [BusinessService] (filter, calculate, format)
  ├→ [DataManager] (save, sync)
  └→ [UIRenderer] (render, update)
      ↓
  [DOM Updated]
```

## Example: Submit a Review

1. **UI Event** → User clicks "Submit Review"
2. **Event Handler** → Calls `AppState.submitReview()`
3. **Validation** → `VerificationManager.validateText()`
4. **Business Logic** → Creates review object
5. **Persistence** → `DataManager.saveBusinesses()` + `DataManager.saveReviewToSupabase()`
6. **Rendering** → `UIRenderer.openBusinessDetail()` refreshes view

## Separation of Concerns

| Module | Domain | Dependencies |
|--------|--------|--------------|
| business-service.js | Business Logic | None (pure functions) |
| data-manager.js | Data Persistence | browser APIs, Supabase |
| verification.js | Security | DOM, validation logic |
| report-generator.js | Report Gen | BusinessService |
| ui-renderer.js | Presentation | DOM, BusinessService |
| app-state.js | Orchestration | All other modules |

## Benefits of This Architecture

✅ **Maintainability** - Each module has a single responsibility
✅ **Testability** - Modules can be tested independently
✅ **Reusability** - BusinessService can work anywhere
✅ **Scalability** - Easy to add new features (e.g., accounts, analytics)
✅ **Code Clarity** - Clear dependencies and data flow
✅ **Error Isolation** - Issues are confined to specific modules

## Adding New Features

### Example: Add Sorting by Category

1. **business-service.js** - Add sorting logic:
```javascript
sortByCategory(businesses) {
  return [...businesses].sort((a, b) => 
    a.category.localeCompare(b.category)
  );
}
```

2. **ui-renderer.js** - Add UI control:
```javascript
<select id="categorySort">
  <option value="name-asc">Newest</option>
</select>
```

3. **app-state.js** - Wire it up:
```javascript
document.getElementById('categorySort').addEventListener('change', updateBusinessList);
```

That's it! No touching unrelated code.

## Testing Strategy

Each module can be tested independently:

```javascript
// Test business-service.js
const filtered = BusinessService.filterByCategory(businesses, 'food');
assert(filtered.every(b => b.category === 'food'));

// Test data-manager.js
DataManager.saveBusinesses(testData);
const loaded = DataManager.loadBusinesses();
assert(loaded.length === testData.length);

// Test ui-renderer.js
UIRenderer.renderBusinesses([], 'testContainer');
assert(document.querySelector('#testContainer').innerHTML.includes('No businesses'));
```

## Future Improvements

- [ ] Extract module loader (lazy load modules)
- [ ] Add event bus for module communication
- [ ] Create service worker for offline support
- [ ] Add unit tests for each module
- [ ] Implement state management library (if needed)
- [ ] Add TypeScript for type safety
- [ ] Create components system for reusable UI elements

## Files Summary

| File | Lines | Purpose |
|------|-------|---------|
| app-state.js | ~400 | Main orchestrator |
| business-service.js | ~200 | Business logic |
| data-manager.js | ~250 | Data persistence |
| ui-renderer.js | ~350 | DOM rendering |
| report-generator.js | ~300 | Report generation |
| verification.js | ~150 | Bot prevention |
| **Total** | **~1650** | All modules (vs ~1500 in old monolithic) |

The modular approach adds minimal overhead while significantly improving code quality.

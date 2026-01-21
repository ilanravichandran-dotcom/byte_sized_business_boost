

A standalone web application designed to help users discover and support small, local businesses in their community. This tool enables users to explore businesses by category, read and write reviews, save favorites, and discover special deals and coupons.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [File Structure](#file-structure)
- [Code Documentation](#code-documentation)
- [Competition Requirements](#competition-requirements)
- [Browser Compatibility](#browser-compatibility)
- [Future Enhancements](#future-enhancements)
- [License & Copyright](#license--copyright)

---

## 🎯 Overview

Byte-Sized Business Boost is an interactive web-based application that serves as a local business discovery platform. The application addresses the 2025-2026 FBLA Coding & Programming competition topic by providing a comprehensive tool for users to:

- **Discover** local businesses across multiple categories (Food, Retail, Services)
- **Review** and rate businesses based on personal experiences
- **Bookmark** favorite businesses for quick access
- **Access** special deals and promotional offers
- **Navigate** with an intuitive, accessible interface

The application is built entirely with vanilla JavaScript, HTML5, and CSS3, ensuring it runs standalone without external dependencies. All data is stored locally using the browser's localStorage API, making it a fully offline-capable application.

---

## ✨ Features

### Core Functionality

1. **Business Discovery**
   - Browse businesses by category (Food, Retail, Services)
   - Search businesses by name, description, or address
   - View detailed business information including ratings, reviews, and contact details

2. **Category Sorting**
   - Filter businesses by category (Food & Dining, Retail & Shopping, Services)
   - View all businesses or filter to specific categories
   - Category badges for easy visual identification

3. **Review & Rating System**
   - Leave reviews with ratings (1-5 stars)
   - View all customer reviews for each business
   - Calculate and display average ratings
   - Sort businesses by rating (high to low, low to high)
   - Sort businesses by number of reviews

4. **Favorites & Bookmarks**
   - Save favorite businesses to a personal list
   - Quick access to saved businesses
   - Visual indicators for favorited businesses
   - Persistent storage using localStorage

5. **Special Deals & Coupons**
   - Display available promotional offers
   - Show coupon codes and expiration dates
   - Link deals to business detail pages
   - Dedicated deals section for easy browsing

6. **Bot Verification**
   - Human verification step to prevent automated abuse
   - Simple math questions for verification
   - Session-based verification (remains verified during session)
   - Protects review submissions and favorite actions

### User Experience Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Accessibility**: Keyboard navigation, ARIA labels, and semantic HTML
- **Input Validation**: Comprehensive validation for all user inputs
- **Error Handling**: User-friendly error messages and graceful error handling
- **Statistics Dashboard**: View total businesses, average ratings, and review counts
- **Real-time Updates**: Instant updates when adding reviews or favorites

---

## 🛠 Technology Stack

### Languages & Technologies

- **HTML5**: Semantic markup, forms, and modern HTML features
- **CSS3**: Flexbox, Grid, CSS Variables, responsive design
- **JavaScript (ES6+)**: Modern JavaScript features including:
  - Arrow functions
  - Template literals
  - Array methods (map, filter, reduce, find)
  - LocalStorage API
  - DOM manipulation
  - Event handling

### Browser APIs Used

- **LocalStorage API**: Persistent data storage
- **SessionStorage API**: Session-based verification state
- **DOM API**: Dynamic content rendering and interaction
- **Fetch API**: Not used (standalone application)

### No External Dependencies

This application is completely standalone and requires:
- ✅ No build tools or compilers
- ✅ No package managers (npm, yarn, etc.)
- ✅ No external libraries or frameworks
- ✅ No server-side components
- ✅ No database connections

Simply open `index.html` in a modern web browser to run the application.

---

## 📦 Installation & Setup

### Prerequisites

- A modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- No additional software required

### Quick Start

1. **Download or clone the project files**
   ```
   byte_sized_business_boost/
   ├── index.html
   ├── styles.css
   ├── script.js
   └── README.md
   ```

2. **Open the application**
   - Option 1: Double-click `index.html` to open in your default browser
   - Option 2: Right-click `index.html` → "Open with" → Select your preferred browser
   - Option 3: Drag and drop `index.html` into your browser window

3. **Begin using the application**
   - You will be prompted to verify you're human (bot prevention)
   - Answer the simple math question to continue
   - Start exploring local businesses!

### Running Locally

If you want to serve the files through a local web server (optional):

**Python 3:**
```bash
python -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

**Node.js (if you have http-server installed):**
```bash
npx http-server
```

**VS Code Live Server:**
1. Install the "Live Server" extension
2. Right-click `index.html`
3. Select "Open with Live Server"

---

## 💻 Usage

### Getting Started

1. **Verification**: Upon first load, you'll need to verify you're human by answering a simple math question.

2. **Browse Businesses**: 
   - Use the "Browse Businesses" tab to see all available businesses
   - Use the category filter to show only specific types of businesses
   - Use the search bar to find businesses by name

3. **View Business Details**: 
   - Click on any business card to see full details
   - View ratings, reviews, contact information, and special deals

4. **Leave a Review**:
   - Open a business detail page
   - Scroll to the "Write a Review" section
   - Enter your name, select a rating (1-5 stars), and write your review
   - Click "Submit Review"

5. **Save Favorites**:
   - Click the "Save" button on any business card or detail page
   - Access your favorites from the "My Favorites" tab
   - Click "Save" again to remove from favorites

6. **Find Deals**:
   - Visit the "Special Deals" tab to see all available promotions
   - Click "View Business Details" to learn more about the business

### Features Guide

**Search Functionality:**
- Type in the search box and press Enter or click the Search button
- Search matches business names, descriptions, and addresses
- Real-time search updates as you type (with a 300ms delay)

**Sorting Options:**
- **Name (A-Z)**: Alphabetical order
- **Rating (High to Low)**: Best rated businesses first
- **Rating (Low to High)**: Lower rated businesses first
- **Most Reviews**: Businesses with the most reviews first

**Category Filtering:**
- **All Categories**: Show all businesses
- **Food & Dining**: Restaurants, cafes, food vendors
- **Retail & Shopping**: Stores, shops, marketplaces
- **Services**: Professional services, repairs, consultations

---

## 📁 File Structure

```
byte_sized_business_boost/
│
├── index.html          # Main HTML structure and layout
├── styles.css          # All styling, responsive design, themes
├── script.js           # Application logic and functionality
└── README.md           # This documentation file
```

### File Descriptions

**index.html**
- Main application structure
- Semantic HTML5 elements
- Accessible markup with proper headings and landmarks
- Modal structures for business details and verification
- Navigation and section containers

**styles.css**
- Complete styling for all components
- CSS Variables for consistent theming
- Responsive design with mobile-first approach
- Accessibility features (reduced motion support)
- Print styles for documentation

**script.js**
- Core application logic
- Data management (localStorage)
- Business filtering, sorting, and searching
- Review and rating functionality
- Favorites management
- Bot verification system
- Input validation
- Comprehensive code comments

---

## 📚 Code Documentation

### Code Organization

The JavaScript code is organized into logical sections:

1. **Global Variables & Data Storage**: Application state and sample data
2. **Utility Functions**: Helper functions for calculations, formatting, validation
3. **Bot Verification System**: Human verification implementation
4. **Business Display Functions**: Rendering and display logic
5. **Statistics Functions**: Dashboard calculations
6. **Favorites Functionality**: Bookmark management
7. **Business Detail Modal**: Detailed business view
8. **Deals Section**: Special offers display
9. **Navigation Functionality**: Section switching
10. **Event Listeners Setup**: User interaction handlers
11. **Application Initialization**: Startup sequence

### Key Functions

#### `initializeData()`
Loads business data and favorites from localStorage or initializes with sample data.

#### `calculateRating(reviews)`
Calculates average rating from an array of review objects. Returns 0 if no reviews exist.

#### `filterByCategory(category)`
Filters businesses by category. Returns all businesses if category is 'all'.

#### `searchBusinesses(searchTerm)`
Searches businesses by name, description, or address. Case-insensitive partial matching.

#### `sortBusinesses(businesses, sortBy)`
Sorts businesses array by the specified criteria (name, rating, reviews).

#### `validateText(text, minLength, maxLength)`
Validates text input with length constraints. Returns validation result object.

#### `submitReview(event, businessId)`
Handles review form submission with comprehensive validation. Adds review to business data.

#### `toggleFavorite(businessId)`
Adds or removes business from favorites list. Persists to localStorage.

### Code Comments

All code is thoroughly commented:
- Function-level documentation explaining purpose and parameters
- Inline comments for complex logic
- Section headers for code organization
- JSDoc-style comments for key functions

### Programming Best Practices

- **Modular Design**: Functions have single responsibilities
- **Clean Logic**: Straightforward, readable code flow
- **Effective Data Types**: Appropriate use of arrays, objects, and primitives
- **Error Handling**: Try-catch blocks and validation checks
- **Naming Conventions**: Descriptive, camelCase variable names
- **Code Reusability**: Utility functions used throughout

---

## 🎯 Competition Requirements

This application fully addresses all requirements of the 2025-2026 FBLA Coding & Programming competition:

### Topic Requirements ✅

- ✅ **Sorting businesses by category** (Food, Retail, Services)
- ✅ **Users can leave reviews or ratings** (1-5 star ratings with text comments)
- ✅ **Sorting businesses by reviews or ratings** (Multiple sort options)
- ✅ **Saving or bookmarking favorite businesses** (Persistent favorites list)
- ✅ **Display special deals or coupons** (Dedicated deals section with codes)
- ✅ **Verification step to prevent bot activity** (Math question verification)

### Event-Specific Requirements ✅

**Code Quality:**
- ✅ **Language Selection**: JavaScript chosen for browser compatibility and interactive features
- ✅ **Code Comments**: Comprehensive, logical comments throughout
- ✅ **Programming Knowledge**: Modular design, clean logic, effective data types

**User Experience:**
- ✅ **UX Design**: Clear design rationale, user journey, accessibility features
- ✅ **Program Intuitiveness**: Easy navigation, clear instructions
- ✅ **Navigation**: Interactive help menu, no navigation errors

**Functionality:**
- ✅ **Input Validation**: Validates format and meaning, prevents crashes
- ✅ **Functionality & Relevance**: Fully meets prompt requirements
- ✅ **Output & Data Analysis**: Customizable reports (sorting, filtering, statistics)

**Data Storage:**
- ✅ **Data Structures**: Uses arrays and objects appropriately
- ✅ **Variable Scope**: Logical and efficient variable scope

**Documentation:**
- ✅ **README File**: Comprehensive documentation provided
- ✅ **Source Code**: Well-commented and organized
- ✅ **Copyright Documentation**: Noted in README

### Presentation Requirements

- **Standalone Application**: ✅ Runs without external dependencies
- **No Programming Errors**: ✅ Fully functional, error-free code
- **No Viruses/Malware**: ✅ Clean, safe code
- **Documentation**: ✅ Complete README with setup instructions

---

## 🌐 Browser Compatibility

### Supported Browsers

- **Google Chrome**: Version 90+ ✅
- **Mozilla Firefox**: Version 88+ ✅
- **Microsoft Edge**: Version 90+ ✅
- **Safari**: Version 14+ ✅
- **Opera**: Version 76+ ✅

### Required Features

The application uses modern web standards:
- HTML5 semantic elements
- CSS Grid and Flexbox
- CSS Variables
- ES6+ JavaScript features
- LocalStorage API
- SessionStorage API

### Browser Detection

No browser detection is implemented. The application gracefully degrades if certain features are unavailable (e.g., localStorage falls back to in-memory storage for the session).

---

## 🔒 Security & Privacy

### Bot Verification

- Simple math questions prevent automated abuse
- Verification status stored in sessionStorage (cleared on browser close)
- Required before submitting reviews or adding favorites

### Input Validation

All user inputs are validated:
- Text length constraints
- Required field validation
- Format validation (email, rating ranges)
- XSS prevention through HTML escaping

### Data Storage

- All data stored locally in browser
- No data transmitted to external servers
- No third-party tracking or analytics
- User privacy fully protected

---

## 🚀 Future Enhancements

While the current application meets all competition requirements, potential future enhancements could include:

1. **Backend Integration**: Connect to a real database for persistent storage
2. **User Authentication**: User accounts and profiles
3. **Business Owner Dashboard**: Allow businesses to manage their listings
4. **Map Integration**: Visual map showing business locations
5. **Advanced Search**: Filter by rating, distance, open hours
6. **Image Upload**: Allow businesses and users to upload photos
7. **Email Notifications**: Notify users of new deals or reviews
8. **Social Sharing**: Share businesses on social media
9. **Mobile App**: Native mobile application versions
10. **Analytics Dashboard**: Business insights and statistics

---

## 📄 License & Copyright

### Open Source Material

This project uses:
- **No external libraries or frameworks**
- **No copyrighted material or images**
- **No third-party code**

All code is original and created specifically for this competition entry.

### Copyright Notice

© 2025 FBLA Coding & Programming Competition Entry  
**Byte-Sized Business Boost**

All code, documentation, and design elements are original work created for the 2025-2026 FBLA Coding & Programming Competition.

### Competition Usage

This application is submitted for evaluation in the FBLA Coding & Programming Competition. It demonstrates proficiency in:
- Software development
- User interface design
- Problem-solving
- Code organization and documentation

---

## 📞 Support & Contact

For questions about this project:
- Review the code comments in `script.js`
- Check the inline documentation
- Refer to this README file

---

## 🎓 Educational Alignment

This project aligns with:

**Career Cluster Framework**: Digital Technology  
**NACE Competencies**:
- Career & Self-Development: Independent project planning and execution
- Critical Thinking: Problem-solving and logical program design
- Communication: Clear documentation and user interface design
- Leadership: Innovative solution development
- Professionalism: Code quality and best practices
- Technology: Modern web development skills

---

## ✅ Competition Checklist

- [x] All topic requirements implemented
- [x] Standalone application (no external dependencies)
- [x] Comprehensive documentation (README)
- [x] Source code with comments
- [x] No programming errors
- [x] Input validation implemented
- [x] Error handling present
- [x] User-friendly interface
- [x] Responsive design
- [x] Accessibility features
- [x] Browser compatibility tested
- [x] Data persistence (localStorage)
- [x] All features functional and tested

---


*Topic: Byte-Sized Business Boost*  
*Supporting local businesses, one discovery at a time.*

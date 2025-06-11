# Advanced React Native Assignment: Social Media Dashboard

## Assignment Overview
Build a production-ready React Native social media dashboard that integrates with provided APIs, features complex animations, advanced state management, and sophisticated data visualization. This assignment tests advanced frontend development skills, performance optimization, and UI/UX implementation.

**Time Limit:** 48-72 hours (2-3 working days)
**Target Platform:** iOS and Android (must work on both)

## Provided Resources

### API Endpoints (Live URLs)
We provide these fully functional REST endpoints:

**Primary API: JSONPlaceholder (typicode.com)**
```
Base URL: https://jsonplaceholder.typicode.com/

Users:
GET /users
GET /users/{id}
GET /users/{id}/posts
GET /users/{id}/albums

Posts:
GET /posts
GET /posts/{id}
GET /posts/{id}/comments
POST /posts
PUT /posts/{id}
PATCH /posts/{id}
DELETE /posts/{id}

Comments:
GET /comments
GET /comments?postId={id}
POST /comments
PUT /comments/{id}
PATCH /comments/{id}
DELETE /comments/{id}

Albums & Photos:
GET /albums
GET /albums/{id}/photos
GET /photos
```

**Secondary API: DummyJSON**
```
Base URL: https://dummyjson.com/

Users:
GET /users
GET /users/{id}
GET /users/search?q={query}

Posts:
GET /posts
GET /posts/{id}
GET /posts/user/{userId}
GET /posts/search?q={query}
```

**Third API: Reqres (for authentication simulation)**
```
Base URL: https://reqres.in/api/

Authentication:
POST /login
POST /register

Users:
GET /users?page={page}
GET /users/{id}
POST /users
PUT /users/{id}
PATCH /users/{id}
DELETE /users/{id}
```

### Mock Data Structure
```javascript
// JSONPlaceholder User Object
{
  "id": 1,
  "name": "Leanne Graham",
  "username": "Bret",
  "email": "Sincere@april.biz",
  "address": {
    "street": "Kulas Light",
    "suite": "Apt. 556",
    "city": "Gwenborough",
    "zipcode": "92998-3874",
    "geo": { "lat": "-37.3159", "lng": "81.1496" }
  },
  "phone": "1-770-736-8031 x56442",
  "website": "hildegard.org",
  "company": {
    "name": "Romaguera-Crona",
    "catchPhrase": "Multi-layered client-server neural-net",
    "bs": "harness real-time e-markets"
  }
}

// JSONPlaceholder Post Object
{
  "userId": 1,
  "id": 1,
  "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
  "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
}

// JSONPlaceholder Comment Object
{
  "postId": 1,
  "id": 1,
  "name": "id labore ex et quam laborum",
  "email": "Eliseo@gardner.biz",
  "body": "laudantium enim quasi est quidem magnam voluptate ipsam eos\ntempora quo necessitatibus\ndolor quam autem quasi\nreiciendis et nam sapiente accusantium"
}

// DummyJSON User Object (richer data)
{
  "id": 1,
  "firstName": "Emily",
  "lastName": "Johnson",
  "maidenName": "Smith",
  "age": 28,
  "gender": "female",
  "email": "emily.johnson@x.dummyjson.com",
  "phone": "+81 965-431-3024",
  "username": "emilys",
  "password": "emilyspass",
  "birthDate": "1996-5-30",
  "image": "https://dummyjson.com/icon/emilys/128",
  "bloodGroup": "O-",
  "height": 193.24,
  "weight": 63.16,
  "eyeColor": "Green",
  "hair": { "color": "Brown", "type": "Curly" },
  "ip": "42.48.100.32",
  "address": {
    "address": "626 Main Street",
    "city": "Phoenix",
    "state": "Mississippi",
    "stateCode": "MS",
    "postalCode": "29112",
    "coordinates": { "lat": -77.16213, "lng": -92.084824 },
    "country": "United States"
  },
  "macAddress": "47:fa:41:18:ec:eb",
  "university": "University of Wisconsin--Madison",
  "bank": {
    "cardExpire": "03/26",
    "cardNumber": "9289760655481815",
    "cardType": "Elo",
    "currency": "CNY",
    "iban": "YPUXISOBI7TTHPK2BR3HAIXL"
  },
  "company": {
    "department": "Engineering",
    "name": "Dooley, Kozey and Cronin",
    "title": "Sales Manager",
    "address": {
      "address": "263 Tenth Street",
      "city": "San Francisco",
      "state": "Wisconsin",
      "stateCode": "WI",
      "postalCode": "37657",
      "coordinates": { "lat": 71.814525, "lng": -161.150263 },
      "country": "United States"
    }
  },
  "ein": "977-175",
  "ssn": "900-590-289",
  "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36",
  "crypto": {
    "coin": "Bitcoin",
    "wallet": "0xb9fc2fe63b2a6c003f1c324c3bfa53259162181a",
    "network": "Ethereum (ERC20)"
  },
  "role": "admin"
}
```

## Core Requirements

### 1. Advanced Authentication & Onboarding
- **Biometric authentication** integration (TouchID/FaceID/Fingerprint)
- **Multi-step onboarding** with smooth animations and progress indicators
- **Profile setup wizard** with real-time validation and preview

### 2. Complex Dashboard Interface

#### Home Feed
- **Infinite scroll implementation** with intelligent preloading
- **Pull-to-refresh** with custom physics-based animations
- **Multiple content types** (text posts, image carousels)
- **Interactive elements** (like, comment, share, save with animations)
- **Smart filtering** (friends, trending, recent) with smooth transitions

### 3. Advanced State Management
- **Redux Toolkit** with RTK Query for API state management
- **Complex data normalization** for nested relationships
- **Optimistic UI updates** for all user interactions
- **Offline-first caching** with intelligent sync strategies
- **State persistence** with selective rehydration
- **Real-time updates simulation** (WebSocket mockup)

### 4. Sophisticated UI/UX Implementation

#### Custom Components
- **Advanced search** with auto-complete, filters, and recent searches
- **Interactive media viewer** (zoom, pan, carousel navigation)
- **Custom bottom sheet** implementation with spring animations
- **Custom tab navigation** with animated transitions

#### Animations & Micro-interactions
- **Gesture-driven interactions** (swipe to like, pull to refresh)
- **Physics-based animations** using React Native Reanimated
- **Shared element transitions** between screens
- **Loading states** with skeleton screens and progress indicators
- **Success/error feedback** with haptic responses

### 5. Performance Optimization
- **Image optimization** with progressive loading and caching
- **Memory management** for large data sets
- **FlatList optimization** with getItemLayout and keyExtractor
- **Bundle size optimization** with code splitting
- **Performance monitoring** with custom metrics

### 6. Advanced Features

#### Content Creation
- **Multi-step post creation** with media upload simulation
- **Rich text editor** with formatting options
- **Preview functionality** with real-time updates
- **Draft saving** with auto-save implementation

#### User Interaction
- **User mention system** with search and suggestions
- **Follow/unfollow** with optimistic updates

## Technical Implementation Challenges

### 1. Custom Hook Implementation
Create sophisticated custom hooks:
- `useInfiniteScroll` with intersection observer
- `useOptimisticUpdates` for instant UI feedback
- `useGestureHandler` for complex gesture interactions
- `useAnimatedValue` for coordinated animations
- `useOfflineSync` for data persistence management

### 2. Performance-Critical Components
Build optimized components for:
- **Virtualized infinite scroll** handling 1000+ items
- **Image carousel** with lazy loading and smooth swiping
- **Search interface** with debounced queries and caching

### 3. Complex Form Handling
Implement sophisticated forms:
- **Multi-step forms** with validation and progress tracking
- **Dynamic form fields** based on user selections
- **Real-time validation** with debounced API calls
- **File upload simulation** with progress indicators
- **Form state persistence** across app restarts

## Architecture Requirements

### Project Structure
```
src/
├── components/
│   ├── animated/        # Reanimated components
│   ├── charts/          # Data visualization components
│   ├── forms/           # Form components with validation
│   ├── media/           # Image/video components
│   └── ui/              # Base UI components
├── screens/
│   ├── auth/            # Authentication screens
│   ├── dashboard/       # Main dashboard screens
│   ├── profile/         # User profile screens
│   ├── analytics/       # Analytics and insights
│   └── settings/        # App configuration
├── hooks/
│   ├── useApi.js        # API integration hooks
│   ├── useAnimation.js  # Animation utility hooks
│   ├── useGesture.js    # Gesture handling hooks
│   └── usePerformance.js # Performance monitoring
├── services/
│   ├── api/             # API client and endpoints
│   ├── cache/           # Caching strategies
│   ├── analytics/       # Performance tracking
│   └── notifications/   # Notification handling
├── store/
│   ├── slices/          # Redux state slices
│   ├── middleware/      # Custom middleware
│   ├── selectors/       # Memoized selectors
│   └── transforms/      # Data transformation utilities
└── utils/
    ├── animations/      # Animation configurations
    ├── performance/     # Performance utilities
    ├── validation/      # Validation schemas
    └── constants/       # App constants and configs
```

### Performance Benchmarks
Your app must achieve:
- **App startup:** < 2 seconds cold start
- **Screen transitions:** 60fps consistent
- **List scrolling:** Smooth with 500+ items
- **Image loading:** < 300ms for cached images
- **Memory usage:** < 150MB during normal operation
- **Battery efficiency:** Minimal background processing

## Specific Technical Challenges

### 1. Infinite Scroll with Complex Data
- Handle mixed content types in single feed
- Implement intelligent preloading strategies
- Manage memory for large datasets
- Smooth insertion of new items without scroll jumps

### 2. Advanced Gesture System
- Multi-directional swipe gestures
- Long press with haptic feedback
- Pinch-to-zoom with boundaries
- Simultaneous gesture recognition

### 5. Advanced Search Implementation
- Multi-criteria search with instant results
- Search history with intelligent suggestions
- Faceted search with dynamic filters
- Search result highlighting and pagination

## Mock API Integration Details

### Authentication Flow
```javascript
// Login Response
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh_token_here",
  "user": { ...userObject },
  "expiresIn": 3600
}
```

### Pagination Pattern
```javascript
// List Response Format
{
  "data": [...items],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "hasMore": true
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "req_123456"
  }
}
```

### Error Handling
```javascript
// Error Response Format
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input parameters",
    "details": {
      "field": "email",
      "issue": "Invalid email format"
    }
  }
}
```

## Evaluation Criteria

### Technical Implementation (30%)
- State management architecture and efficiency
- Component organization and reusability
- Performance optimization techniques
- Error handling and edge cases

### UI/UX Excellence (25%)
- Animation quality and smoothness
- User interface polish and attention to detail
- Responsive design and accessibility
- Intuitive navigation and user flows

### Feature Completeness (25%)
- All core features implemented and functional
- Advanced features working correctly
- Cross-platform compatibility
- Integration with provided APIs

### Code Quality (20%)
- TypeScript usage and type safety
- Code organization and maintainability
- Performance best practices
- Documentation and comments

## Submission Requirements

1. **Complete React Native source code**
2. **APK and IPA files** for testing
3. **Setup and run instructions**
4. **Architecture documentation** (key decisions and patterns used)
5. **Performance report** with benchmarks and optimizations
6. **Feature demonstration video** (10-15 minutes)
7. **API integration documentation** showing how you used provided endpoints

## Technology Stack Requirements

### Required Technologies
- **React Native** (latest stable version)
- **TypeScript** (mandatory for type safety)
- **Redux Toolkit** with RTK Query
- **React Navigation** v6+
- **React Native Reanimated** v3 for animations
- **React Native Gesture Handler** for gestures

### Recommended Libraries
- **React Native Chart Kit** or **Victory Native** for charts
- **React Native Fast Image** for image optimization
- **React Hook Form** for form handling
- **React Native Paper** or **NativeBase** for UI components
- **React Native Async Storage** for persistence
- **React Native Vector Icons** for iconography

## Success Criteria

Your application must:
- Successfully integrate with all provided API endpoints
- Run smoothly on both iOS and Android platforms
- Demonstrate all required features with polished UI/UX
- Show advanced React Native development techniques
- Meet performance benchmarks consistently
- Handle errors gracefully with proper user feedback
- Display architectural understanding and best practices

## Development Tips

1. **Start with API integration** - Get data flowing first
2. **Build reusable components** - Focus on component architecture
3. **Implement core navigation** - Set up the app structure early
4. **Add animations progressively** - Start simple, enhance gradually
5. **Test on both platforms** - Ensure cross-platform compatibility
6. **Monitor performance** - Use React DevTools and Flipper
7. **Handle edge cases** - Empty states, errors, loading states

---

**Note:** This assignment evaluates advanced React Native frontend development skills, focusing on complex state management, sophisticated UI/UX implementation, performance optimization, and integration capabilities. The provided APIs eliminate backend complexity while maintaining challenging frontend requirements.

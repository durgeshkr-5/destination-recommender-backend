
# Destination Recommendation Platform – Backend README

## Project Overview

This backend powers a MERN-based Destination Recommendation Platform. It provides APIs for user authentication, destination management, user profile/preferences, favorites (likes), reviews/ratings, and a personalized recommendation engine. The backend is built for scalability, RESTful best practices, and secure user experiences.

## Features

- **User Authentication:** Signup, login, forgot/reset password with JWT protection.
- **User Profile \& Preferences:** Secure endpoints for update and retrieval.
- **Destination Management:** Create, read, update, delete destinations (admin only for write).
- **Favorites (Likes):** Users can like and unlike destinations.
- **Review and Rating System:** Users can leave ratings and reviews for destinations; destinations aggregate ratings automatically.
- **Personalized Recommendations:** Fetch tailored destination suggestions based on user preferences.
- **Advanced Query/Search:** Filter destinations by category, price, location, tags, and more.
- **Robust Error Handling:** Consistent JSON error responses.
- **Role-based Middleware:** Auth and admin checks on protected endpoints.


## Technology Stack

- **Node.js** + **Express.js** (API Server)
- **MongoDB** + **Mongoose** (Database \& ODM)
- **JWT** (JSON Web Tokens for authentication)
- **bcryptjs** (Password hashing)
- **dotenv** (Environment variable management)
- **CORS** (Cross-origin resource sharing)
- **Optional:** helmet for security headers, nodemon for development


## Installation \& Setup

1. **Clone the repository:**

```bash
git clone "https://github.com/durgeshkr-5/destination-recommender-backend.git"
cd destination-recommender-backend
```

2. **Install dependencies:**

```bash
npm install
```

3. **Set up environment variables:**
Create a `.env` file in the backend root:

```
PORT=8000
MONGODB_URI=mongodb://localhost:27017/destination-platform
BCRYPT_SALT=10
JWT_SECRET_KEY=your-very-secure-jwt-secret
USER_EMAIL="your email id" //for nodemailer
USER_PASSWORD="gamil app password" // for nodemailer
```

4. **Run the server (development):**

```bash
npm run dev
```

The server will start at `http://localhost:8000` by default.

## Environment Variables

| Variable | Purpose | Example Value |
| :-- | :-- | :-- |
| PORT | Server port | 8000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/destination-platform |
| JWT_SECRET_KEY | JWT encryption key | your-very-secure-jwt-secret |
| USER_EMAIL | for nodemailer  |
| USER_PASSWORD | for nodemailer |

## API Endpoints Overview

| Method \& Path | Purpose | Auth Required |
| :-- | :-- | :-- |
| **/api/auth/signup**       (POST) | User registration | N |
| **/api/auth/login**        (POST) | User login | N |
| **/api/auth/forgot-password** (POST) | Request password reset | N |
| **/api/auth/reset-password/:token** (PUT) | Reset password by token | N |
| **/api/destinations/**     (GET) | List/filter/search destinations | N |
| **/api/destinations/:id**  (GET) | Get single destination | N |
| **/api/destinations/**     (POST) | Create destination (admin) | Y |
| **/api/destinations/:id**  (PATCH) | Update destination (admin) | Y |
| **/api/destinations/:id**  (DELETE) | Delete destination (admin) | Y |
| **/api/destinations/:id/like**  (PUT) | Add to user's favorites | Y |
| **/api/destinations/:id/unlike** (PUT) | Remove from favorites | Y |
| **/api/destinations/:id/review** (PUT) | Add a review/rating | Y |
| **/api/destinations/:id/reviews** (GET) | Get all reviews for a destination | N |
| **/api/users/profile**     (GET) | Get logged-in user's profile/preferences | Y |
| **/api/users/profile**     (PUT) | Update profile/preferences | Y |
| **/api/recommendations/**  (GET) | Get personalized recommendations | Y |

**Y = Requires valid JWT in Authorization Header**

## Usage Examples

- **Register:**
`POST /api/auth/signup`
Body:

```json
{
  "email": "alice@example.com",
  "password": "Secret123",
  "firstName": "Alice",
  "lastName": "Smith"
}
```

- **Login:**
`POST /api/auth/login`
Returns: JWT and user profile
- **Add Review:**
`PUT /api/destinations/<id>/review`
Headers: `Authorization: Bearer <token>`
Body:

```json
{
  "rating": 5,
  "comment": "Wonderful place!"
}
```

- **Get Personalized Recommendations:**
`GET /api/recommendations/`
(JWT Required)


## Database Models Overview

### User

- **profile:** firstName, lastName, avatar, preferences (interests, budgetRange, travelStyle, activities)
- **savedDestinations:** [favorite destination IDs]
- **travelHistory:** [{destinationId, visitDate, rating, review}]
- **itineraries:** [trip itinerary IDs]


### Destination

- **name, location, description, images, categories**
- **ratings:** `{ average, count }`
- **reviews:** user, rating, comment, date
- **attractions, bestTimeToVisit, estimatedCost, activities, tags, weatherInfo, travelTips**
- **isActive, trending**


## Deployment

- Use [env vars](#environment-variables) to set up production.
- Secure secret keys.
- Update CORS `origin` for deployed frontend URL.
- Use MongoDB Atlas or production-ready MongoDB server.


## Testing

- Test with Postman/ThunderClient for endpoint validation.
- Write automated tests with Jest or Mocha (optional).





## License



## Contact



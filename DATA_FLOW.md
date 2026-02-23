# HackBlog: Core Operations & Data Flow

This document provides a detailed, line-by-line explanation of the most critical operations in the HackBlog application: **User Registration**, **Authentication**, and **Story Creation**.

---

## 1. User Registration Flow
This operation turns a guest into a registered member, handling everything from the UI form to secure database storage.

### Step A: Frontend Input (`RegisterPage.jsx`)
*   **The Form**: The user enters their Name, Email, and Password.
*   **Handle Submit (Line 23)**: `handleSubmit` is triggered.
    *   **Validation (Line 27)**: It checks if `password` and `confirmPassword` match.
    *   **The Call (Line 35)**: It triggers `authAPI.register` from our API service.

### Step B: The Service Call (`api.js`)
*   **The Function (`authAPI.register`)**:
    *   Uses **Axios** to send a `POST` request to `http://localhost:3000/api/auth/register`.
    *   Passes the user's data (name, email, password) in the request body.

### Step C: Backend Processing (`routes/auth.js`)
*   **The Guard (`register` function)**:
    1.  **Validation (Lines 64-71)**: Checks if all fields are present and if the password is at least 6 characters.
    2.  **Uniqueness (Line 74)**: Checks the Postgres database if the email already exists.
    3.  **Bcrypt Hashing (Lines 81-82)**: 
        *   `bcrypt.genSalt(10)` creates a unique salt.
        *   `bcrypt.hash(password, salt)` creates a secure, one-way hash. **The plain-text password is NEVER saved.**
    4.  **Database Insert (Line 85)**: `db.insert(users)` saves the hashed password and user details.
    5.  **Token Creation (Line 97)**: `jwt.sign` creates a JSON Web Token (JWT) containing the new user's ID.

### Step D: Frontend Persistence
*   **Storing the Token (`RegisterPage.jsx`, Line 41)**: 
    *   Calls `setAuthToken(token)`.
    *   This saves the JWT in `localStorage` so the user doesn't have to log in immediately after signing up.

---

## 2. Authentication Flow (The "Header Check")
This is the silent backbone of the app that identifies who the user is for every action they take.

### Step A: The Axios Hook (`api.js`)
*   **`setAuthToken` Function (Line 12)**:
    *   Every time the app loads or a user logs in, this function runs.
    *   **Line 14**: `api.defaults.headers.common['Authorization'] = 'Bearer ${token}'`.
    *   **Functionality**: This "stamps" every single request sent to the server with your passport (the token).

### Step B: Backend Gatekeeper (`middleware/auth.js`)
*   **The Middleware (`authenticate`)**:
    1.  **Extraction (Line 11)**: Reads the `Authorization` header from the incoming request.
    2.  **Verification (Line 20)**: `jwt.verify(token, JWT_SECRET)`.
        *   If the token was tampered with or expired, it returns `403 Forbidden`.
    3.  **Identity Attachment (Line 21)**: `req.user = decoded`.
        *   This line is crucial. It pulls the User ID out of the token and attaches it to the `req` object so future code knows exactly who sent the request.
    4.  **Next Up (Line 23)**: `next()` tells Express to continue to the actual API logic.

---

## 3. Posting a Story Flow
How a user creates content and links it to their account.

### Step A: Frontend Trigger
*   The user fills out a submit form (typically sending a `title` and `url`).
*   Axios sends a `POST` request to `/api/stories`.

### Step B: Verification
*   The request first hits the **Gatekeeper Middleware** (detailed in Step 2 above).
*   The middleware confirms the user is logged in and identifies them.

### Step C: Database Write (`routes/stories.js`)
*   **The Function (`createStory`)**:
    1.  **Data Extraction (Line 76)**: Pulls `title` and `url` from the user's input.
    2.  **User Extraction (Line 77)**: `const authorId = req.user.id`. 
        *   Note that we don't ask the frontend for the user ID; we take it from the **verified token** for security.
    3.  **Insert (Line 84)**: `db.insert(stories).values({ title, url, authorId, score: 1 })` saves the story in Postgres.

### Step D: Feedback
*   **Server Response (Line 92)**: The server sends back the newly created story object.
*   **UI Update**: The frontend receives the success message and typically navigates the user back to the home page where they see their new story at the top of the list.

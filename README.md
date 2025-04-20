# Tugas Take Home Test Internship Azuralabs Book List Web Application 2025

This application is a web-based book list management system with a fullstack architecture. The frontend is built using React, while the backend uses Node.js with the Express framework and Firestore (Firebase) database to store book and category data. This application allows users to manage (create, read, update, delete - CRUD) book and category data.

## Features

- Category Management: CRUD (Create, Read, Update, Delete) for book categories.
- Book Management: CRUD for books, including category selection.
- List View: Displays lists of all books and all categories.
- Book Filtering:
  - By Category (Dropdown on the book list page).
  - By Text (Searching in Title, Author, Publisher).
  - By Publication Date.
- Validation: Input validation on both frontend and backend (e.g., required fields, ISBN format, category name/ISBN uniqueness).
- Notifications: Visual feedback for the user after successful or failed operations.

## Tech Stack

- Frontend:

  - React.js (UI Library)
  - React Router DOM (Client-side routing)
  - Axios (HTTP Client for API communication)
  - Bulma (CSS Framework)
  - Font Awesome (Icons)

- Backend:

  - Node.js (JavaScript Runtime)
  - Express.js (Node.js web framework)
  - Firebase Admin SDK (For interacting with Firebase from the server)
  - CORS (Middleware to allow cross-origin requests)

- Database: Firestore (NoSQL cloud database from Firebase)
- Hosting App: Cloud Run and Vercel

Website Link : https://book-list-web-flame.vercel.app

# MERN Apartment Listing Platform

A full-stack real estate listing platform built using **Next.js 14**, **Node.js/Express (TypeScript)**, and **MongoDB**.  
The system supports user authentication, apartment management, image uploads (Cloudinary), advanced search & filtering, strong validation, clean modern UI, and a strong secure backend

---

## Features & Highlights

- **Fully Dockerized Setup**  
  Separate Dockerfiles for frontend and backend + one `docker-compose.yml` to run the entire stack with a single command.

- **Secure Backend Architecture**
    - JWT Authentication (HttpOnly cookies)
    - Helmet security headers
    - CORS protection
    - XSS-cleaning middleware
    - Express rate limiter (prevent DDOS)
    - MongoDB injection sanitizer

- **Protected Routes**  
  Users must be authenticated to create apartments or access protected pages.

- **Advanced Validation (Frontend & Backend)**
    - Formik + Yup schema validation
    - Live validation for:  
      - Reference number availability  
      - Email availability  
      - Username availability
    - Strong email format validation
    - Strong password policy (uppercase, special character, min length)

- **Apartment Listing Features**
    - Add up to **7 images per listing** with drag-and-drop previews
    - Image hosting on Cloudinary
    - Enforced delivery year: **must be current year or later**
    - Amenities, coordinates, metadata & location details
    - Automatic text search (MongoDB text index)

- **Search + Filters + Sorting**
    - Real-time debounced search
    - Filter by compound
    - Sort by: title, delivery year
    - UI filter chips

- **Clean UI**
    - Next.js App Router
    - TailwindCSS
    - Responsive layout
    - Scrollable image gallery for apartment details

---

## Tech Stack

### **Frontend**
- Next.js 14 (App Router)
- React
- Redux Toolkit
- TailwindCSS
- Axios

### **Backend**
- Node.js + Express (TypeScript)
- JWT Authentication
- Mongoose ORM
- Multer for image uploads
- Cloudinary Node SDK

### **Database**
- MongoDB (running inside Docker)
- MongoDB Compass optional for inspection

---

## Running the Project Locally (Docker)

1. **Clone the repository**

2. **(Optional)** Open MongoDB Compass or DBeaver if you want to view data.  
   Mongo runs in a Docker container, so local Mongo installation is NOT required.

3. Environment variables are already included for testing (Cloudinary keys required for image uploads).

4. Make sure **Docker Desktop** is installed & running.

5. Navigate to the project folder (where `docker-compose.yml` exists).

6. Build the entire system: `docker compose build`

7. Run the full stack: `docker compose up`


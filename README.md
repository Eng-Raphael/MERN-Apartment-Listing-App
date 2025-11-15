# MERN Apartment Listing Platform

This is a full-stack apartment listing system built using **Next.js 14**, **Node.js/Express (TypeScript)**, **MongoDB**.  
It includes authentication, image uploads (Cloudinary), search + filter + sorting, and complete CRUD operations.

### Highlights
- Secured backend using cookie parser, mongo-Sanitize, helmet, xss, request limiter and of course cors
- Protected routes where user can access only certain pages / features if he
    is a registered user and loged in
- Secure authentication using JWT (HttpOnly cookies)
- Next.js App Router with clean UI and strong validation (Formik + Yup)
- Live reference-number / username / email validation (frontend + backend)
- Drag & drop image upload with previews (max 7 images)
- Advanced search engine (text index + debounced search)
- Sorting & dynamic filtering with reset option
- Cloudinary image hosting

### Tech Stack
**Frontend:** Next.js 14, React, Redux Toolkit, TailwindCSS  
**Backend:** Node.js, Express, TypeScript, JWT, Multer, Cloudinary SDK  
**Database:** MongoDB + Mongoose  

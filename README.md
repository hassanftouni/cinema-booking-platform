# Cinema Booking Platform

**Author**: Hassan Ftouni
**Email**: hassan.ftounne@gmail.com

## Overview
A modern, full-stack cinema booking application built to deliver a seamless movie-going experience. This platform allows users to browse movies, watch trailers, book tickets, and manage their profile, while providing administrators with a powerful dashboard to manage cinemas, halls, showtimes, and users.

## Technology Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS 4
- **Animations**: Framer Motion & GSAP
- **Real-time**: Laravel Echo & Pusher JS

### Backend
- **Framework**: [Laravel 12](https://laravel.com/)
- **Database**: PostgreSQL (Relational Schema)
- **Authentication**: Laravel Sanctum
- **Real-time**: Laravel Reverb

## Features

- **User Portal**:
    - Browse "Now Showing" and "Coming Soon" movies.
    - View immersive movie details with trailers and ratings.
    - Real-time seat selection and booking flow.
    - User authentication and profile management.
    
- **Admin Dashboard**:
    - Comprehensive Movie Management (Create, Edit, Delete).
    - Cinema & Hall Management.
    - Showtime Scheduling.
    - User Role Management.
    - Contact Form Submission Tracking.

## Getting Started

### Prerequisites
- Node.js (v18+)
- PHP (v8.2+)
- Composer
- PostgreSQL

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd cinema-project
    ```

2.  **Backend Setup**
    ```bash
    cd cinema-backend
    composer install
    cp .env.example .env
    # Configure your .env database credentials
    php artisan key:generate
    php artisan migrate --seed
    php artisan serve
    ```

3.  **Frontend Setup**
    ```bash
    cd cinema-frontend
    npm install
    # Configure .env.local if needed
    npm run dev
    ```

4.  **Access the App**
    - Frontend: `http://localhost:3000`
    - Backend API: `http://localhost:8000`

## Contributing
Private project. Please contact the author for access rights.

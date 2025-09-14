
# ResuMatic - Modern & Responsive Portfolio Website

ResuMatic is a sleek, modern, and fully responsive personal portfolio website built to showcase your skills, experience, and projects. It's crafted with Next.js, React, Tailwind CSS, and Shadcn/UI, and features a full-fledged admin dashboard for easy content management. This project was developed with assistance from Firebase Studio.

## Features

*   **Modern UI/UX:** Clean and professional design suitable for personal branding.
*   **Fully Responsive:** Adapts seamlessly to all screen sizes (desktops, tablets, and mobile).
*   **Dark/Light Theme Toggle:** Allows users to switch between themes based on their preference, with system preference detection.
*   **Admin Dashboard:** A secure, password-protected dashboard to manage all portfolio content without touching the code.
*   **Interactive Sections:**
    *   **Hero Section:** Engaging introduction with a profile picture and call-to-action for your resume.
    *   **About Me:** A section to share your story and passion.
    *   **Experience:** Detail your professional journey.
    *   **Skills:** Showcase your technical skillset with categorized skills and icons.
    *   **Projects:** Display your featured projects with images, descriptions, tags, and links.
    *   **Certificates:** Highlight your certifications with images and credential links.
    *   **Contact Form:** Allows visitors to get in touch easily, with messages stored in the database and viewable from the dashboard.
*   **Resume Download/Preview:** Modal dialog to preview or download the resume PDF.
*   **Optimized Images:** Leverages `next/image` for optimized image loading, with images hosted on Cloudinary.

## Tech Stack

*   **Framework:** [Next.js](https://nextjs.org/) (App Router)
*   **UI Library:** [React](https://reactjs.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components:** [Shadcn/UI](https://ui.shadcn.com/)
*   **Database:** [Firebase Firestore](https://firebase.google.com/docs/firestore)
*   **Image Hosting:** [Cloudinary](https://cloudinary.com/)
*   **Icons:** [Lucide React](https://lucide.dev/)
*   **Forms:** [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) for validation
*   **Development Environment:** Firebase Studio

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm or yarn
*   Firebase Project and Cloudinary Account

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/karn30chavda/karanchavda-portfolio-website.git
    ```

2.  **Install NPM packages:**
    ```bash
    npm install
    ```

3.  **Create an environment file:**
    Create a file named `.env.local` in the root of the project and add your Firebase and Cloudinary credentials. You will also need to set a password for the admin dashboard.

    ```bash
    # Firebase Public Config
    NEXT_PUBLIC_FIREBASE_API_KEY=...
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
    NEXT_PUBLIC_FIREBASE_APP_ID=...

    # Cloudinary Config
    CLOUDINARY_CLOUD_NAME=...
    CLOUDINARY_API_KEY=...
    CLOUDINARY_API_SECRET=...

    # App Security
    ADMIN_PASSWORD=...
    SESSION_SECRET=... # A long, random string for session encryption
    ```

### Running the Development Server

Once the dependencies are installed, you can run the development server:

```bash
npm run dev
```

This will start the development server. Open the provided URL in your browser to see the application.

### Building for Production

To create a production build:

```bash
npm run build
```
This will generate an optimized build of your application in the `.next` folder.

## Deployment

This Next.js application can be easily deployed to various platforms that support Node.js applications, such as:

*   [Vercel](https://vercel.com/) (from the creators of Next.js)
*   [Netlify](https://www.netlify.com/)
*   Firebase Hosting (with Cloud Functions or Cloud Run for Next.js features)

For Vercel and Netlify, you can connect your GitHub repository directly, and they will handle the build and deployment process automatically after you configure your environment variables in their respective dashboards.

## Project Structure

A brief overview of the key directories:

```
/public                 # Static assets (images, resume PDF)
/src
├── app                 # Next.js App Router: pages, layouts, API routes
│   ├── dashboard       # Admin dashboard pages
│   └── (public pages)
├── components          # React components
│   ├── sections        # Components for each major section of the page
│   ├── shared          # Reusable components (header, footer)
│   ├── dashboard       # Components used in the admin dashboard
│   └── ui              # Shadcn/UI components
├── lib                 # Utility functions, actions, Firebase config
└── (other configuration files)
```

## Contact

Karan Chavda - [karanchavda543@gmail.com)]

Project Link:(https://github.com/karn30chavda/karanchavda-portfolio-website.git)

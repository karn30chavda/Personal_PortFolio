
# ResuMatic - Modern & Responsive Portfolio Website


ResuMatic is a sleek, modern, and fully responsive personal portfolio website built to showcase your skills, experience, and projects. It's crafted with Next.js, React, Tailwind CSS, and Shadcn/UI, providing a beautiful and performant user experience. This project was developed with assistance from Firebase Studio.

**Live Demo:** [Your Live Demo URL Here - e.g., https://karan-portfolio-website.netlify.app]

## Features

*   **Modern UI/UX:** Clean and professional design suitable for personal branding.
*   **Fully Responsive:** Adapts seamlessly to all screen sizes (desktops, tablets, and mobile).
*   **Dark/Light Theme Toggle:** Allows users to switch between themes based on their preference, with system preference detection.
*   **Smooth Scrolling Navigation:** Easy navigation through different sections of the portfolio.
*   **Interactive Sections:**
    *   **Hero Section:** Engaging introduction with a profile picture and call-to-action for resume.
    *   **About Me:** A section to share your story and passion.
    *   **Experience:** Detail your professional journey (currently highlights a learning path).
    *   **Skills:** Showcase your technical skillset with categorized skills and icons.
    *   **Projects:** Display your featured projects with images, descriptions, tags, and links to live demos and source code.
    *   **Contact Form:** Allows visitors to get in touch easily (simulated email dispatch in the current version).
*   **Resume Download/Preview:** Modal dialog to preview or download the resume PDF.
*   **Optimized Images:** Leverages `next/image` for optimized image loading.
*   **Built with Best Practices:** Clean code, component-based architecture, and modern web standards.

## Tech Stack

*   **Framework:** [Next.js](https://nextjs.org/) (App Router)
*   **UI Library:** [React](https://reactjs.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components:** [Shadcn/UI](https://ui.shadcn.com/)
*   **Icons:** [Lucide React](https://lucide.dev/)
*   **Forms:** [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) for validation
*   **Development Environment:** Firebase Studio
*   **Deployment:** (Ready for platforms like Netlify, Vercel)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/karn30chavda/karanchavda-portfolio-website.git
    ```

2.  **Install NPM packages:**
    ```bash
    npm install
    ```
    or if you use yarn:
    ```bash
    yarn install
    ```

### Running the Development Server

Once the dependencies are installed, you can run the development server:

```bash
npm run dev
```

This will start the development server, typically on `http://localhost:9002` (as per your `package.json`). Open this URL in your browser to see the application.

### Building for Production

To create a production build:

```bash
npm run build
```
This will generate an optimized build of your application in the `.next` folder.

## Deployment

This Next.js application can be easily deployed to various platforms that support Node.js applications, such as:

*   [Netlify](https://www.netlify.com/)
*   [Vercel](https://vercel.com/) (from the creators of Next.js)
*   Firebase Hosting (with Cloud Functions or Cloud Run for Next.js features)

For Netlify and Vercel, you can usually connect your GitHub repository directly, and they will handle the build and deployment process automatically.

## Project Structure

A brief overview of the key directories:

```
/public                 # Static assets (images, resume PDF)
/src
├── ai                  # Genkit AI related files (if any added later)
├── app                 # Next.js App Router: pages, layouts, API routes
├── components          # React components
│   ├── sections        # Components for each major section of the page
│   ├── shared          # Reusable components across sections
│   ├── ui              # Shadcn/UI components
│   └── (other specific components like header.tsx, contact-form.tsx)
├── hooks               # Custom React hooks (e.g., useToast, useMobile)
├── lib                 # Utility functions, actions (e.g., form submission)
└── (other configuration files)
```

## Contact

Karan Chavda - [karanchavda543@gmail.com)]

Project Link:(https://github.com/karn30chavda/karanchavda-portfolio-website.git)

---



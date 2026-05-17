# Green Pulse

Green Pulse is a dynamic web application built to manage and track community challenges, user submissions, and member projects.

## 1. Problem Statement
Managing community-driven projects, tracking member participation in various challenges, and reviewing submissions can be disorganized and time-consuming without a centralized platform. Organizations and administrators often lack clear visibility into user engagement, making it difficult to reward contributions and monitor overall progress efficiently.

## 2. Solution
Green Pulse provides a unified platform where members can easily view active challenges, submit their work (such as project URLs), and track their reward points. Administrators are equipped with a powerful dashboard featuring data visualization to effortlessly manage user accounts, create new challenges, and securely review member submissions.

## 3. Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Library:** React 19
- **Styling:** Tailwind CSS 4
- **UI Components:** shadcn/ui
- **State Management:** Zustand & React Query
- **Forms & Validation:** React Hook Form & Zod
- **Charts:** Recharts
- **Animations:** Framer Motion

## 4. Key Features
- **Role-Based Access Control:** Distinct views and permissions for Public users, Members, and Administrators.
- **Member Dashboard:** Personalized space for users to track accumulated points, browse active challenges, and submit project links.
- **Admin Control Panel:** Comprehensive management of challenges, categories, submissions, and member accounts.
- **Analytics Dashboard:** Visual representation of platform engagement, submission statuses, and user growth using Recharts.
- **Dynamic Routing:** Scalable page architecture for handling individual project showcases and detailed challenge descriptions.

## 5. Setup Instructions
Clone the repository:
```bash
git clone https://github.com/Mehedi-Hasann/green-pulse-frontend/tree/main
cd green-pulse-frontend
```

Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```
Open the app: Open http://localhost:3000 with your browser to see the result.

## 6. Environment Variables
Create a `.env` or `.env.local` file in the root directory based on the `.env.example`:

```env
# Example for local development
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1

# Example for production
# NEXT_PUBLIC_API_URL=https://your-production-backend.com/api/v1
```

## 7. API / Architecture
The Next.js frontend follows a decoupled architecture, communicating with a RESTful backend API built with Node.js, Express, and Prisma.

- **Data Fetching:** TanStack React Query is used for efficient server state management, caching, and background synchronization.
- **State Management:** Local client state (like UI toggles and persistent user preferences) is managed via Zustand.
- **Routing:** Built on the modern Next.js App Router paradigm utilizing server components alongside client components for optimal performance and SEO.

## 8. Live Demo & Credentials
- **Live Application:** https://green-pulse-frontend.vercel.app/
- **Backend Repository:** https://github.com/Mehedi-Hasann/green_pulse_backend

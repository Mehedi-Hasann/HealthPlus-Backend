# HealthPlus Backend

HealthPlus Backend is a robust, scalable RESTful API built to power a multi-vendor online medicine store. It manages core functionalities like user authentication, medicine inventory, order processing, and payment handling for various user roles including Customers, Sellers, and Administrators.

## 1. Problem Statement
Managing a multi-vendor online pharmacy requires a secure and efficient way to handle diverse operations: sellers need to manage their inventory, customers need to seamlessly browse medicines and place orders, and administrators must oversee the entire platform. Without a centralized, reliable backend, handling complex relations like secure payments, order tracking, and role-based permissions becomes highly error-prone.

## 2. Solution
HealthPlus Backend provides a unified API architecture that securely handles data operations across the platform. It features a role-based access control system to securely isolate Seller, Customer, and Admin capabilities. With integrated payment processing, robust relational data management, and secure media storage, the backend ensures a smooth and reliable foundation for the HealthPlus e-commerce experience.

## 3. Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js (v5)
- **Language:** TypeScript
- **Database ORM:** Prisma
- **Database:** PostgreSQL
- **Authentication:** Better-Auth & JSON Web Tokens (JWT)
- **Payment Processing:** Stripe
- **File Storage:** Cloudinary & Multer
- **Email Service:** Nodemailer (with EJS templates)
- **Validation:** Zod

## 4. Key Features
- **Role-Based Access Control (RBAC):** Distinct permissions and routing for Admin, Seller, and Customer modules.
- **Vendor/Seller Management:** Sellers can add, update, and manage their medicine inventories.
- **Customer Operations:** Secure customer registration, cart management, and profile handling.
- **Medicine & Category Management:** Structured cataloging of medicines with categories.
- **Order Processing:** End-to-end order lifecycle management from checkout to delivery tracking.
- **Secure Payments:** Integrated Stripe webhook handling and secure checkout flow.
- **Media Management:** Cloudinary integration for handling medicine images and user avatars.

## 5. Setup Instructions

Clone the repository:
```bash
git clone https://github.com/Mehedi-Hasann/HealthPlus-Backend.git
cd HealthPlus-Backend
```

Install dependencies (using pnpm as per project configuration):
```bash
pnpm install
```

Configure your environment variables:
Create a `.env` file in the root directory and populate it based on your `.env.example` structure. You will need credentials for PostgreSQL, Stripe, Cloudinary, and your chosen Email provider.

Run Database Migrations & Generate Prisma Client:
```bash
pnpm run migrate
pnpm run generate
```

Start the development server:
```bash
pnpm run dev
```
The API will be available at your configured local port (e.g., `http://localhost:5000`).

## 6. Project Architecture
The application follows a modular, feature-based architecture pattern:
- **`/src/module`:** Contains isolated features (e.g., `admin`, `auth`, `customer`, `medicine`, `orders`, `payment`, `seller`). Each module generally encapsulates its own routes, controllers, and services.
- **`/src/middlewares`:** Reusable Express middlewares for authentication, validation, and error handling.
- **`/src/config` & `/src/utils`:** Shared configuration and utility functions.
- **Database:** Prisma ORM is used to interact with a PostgreSQL database, ensuring type safety from the database schema up to the API response.

## 7. Scripts
- `pnpm run dev`: Starts the development server using TSX.
- `pnpm run build`: Generates the Prisma client and builds the project into ES modules using TSUP.
- `pnpm run start`: Runs the compiled output in production mode.
- `pnpm run stripe:webhook`: Starts listening to Stripe webhooks locally for testing.

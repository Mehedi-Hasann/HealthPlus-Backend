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

## 6. API / Architecture

The HealthPlus Backend is built with a highly decoupled, modular architecture designed for maintainability, scalability, and clear separation of concerns. It leverages the Express.js framework within a Node.js environment, utilizing TypeScript for strong typing and error reduction.

### Pattern: Controller-Service Architecture
The application strictly follows a layered architectural pattern within each module to separate business logic from routing and HTTP interactions:
- **Routes (`*.route.ts`):** Defines API endpoints, HTTP methods, and attaches middlewares (like authentication, authorization, or payload validation).
- **Controllers (`*.controller.ts`):** Handles incoming HTTP requests, extracts parameters and payloads, calls the appropriate service, and constructs the standardized API response.
- **Services (`*.service.ts`):** Contains the core business logic. It handles data processing and interacts with the database via the Prisma ORM.

### Folder Structure
The codebase is structured feature-first:
- **`/src/module`:** The core of the application. Features are isolated into domains:
  - `admin/`, `customer/`, `seller/`: Handles role-specific workflows and dashboard data.
  - `auth/`: Manages JSON Web Tokens (JWT), session handling, and secure login/registration flows.
  - `medicine/`, `category/`: Manages the e-commerce catalog, inventory, and category hierarchies.
  - `orders/`: Coordinates the checkout process and order lifecycle.
  - `payment/`: Integrates with Stripe for secure transaction processing and Stripe webhook event handling.
- **`/src/middlewares`:** Global interceptors like `globalErrorHandler`, role-based `authGuard`, and Zod-based request validation middlewares (`validateRequest`).
- **`/src/config`:** Environment variable validation and central configurations (e.g., Cloudinary config, Stripe initialization).
- **`/src/utils`:** Shared helper functions, centralized API response formatters (`sendResponse`), and custom error classes (like `AppError`).
- **`/src/templates`:** Contains EJS email templates for automated email notifications (e.g., order confirmations, welcome emails).

### Data Flow
1. **Request:** A client sends an HTTP request to an endpoint.
2. **Middleware:** The request passes through global middlewares (CORS, body parsing) and route-specific middlewares (JWT authentication, Zod validation).
3. **Controller:** If valid, the controller receives the request and delegates the core task to the Service layer.
4. **Service & Database:** The Service applies business rules and uses the Prisma Client to query or mutate the PostgreSQL database type-safely.
5. **Response:** Data flows back through the Service to the Controller, which uses a uniform response utility to send a standardized JSON response back to the client.

## 7. Scripts
- `pnpm run dev`: Starts the development server using TSX.
- `pnpm run build`: Generates the Prisma client and builds the project into ES modules using TSUP.
- `pnpm run start`: Runs the compiled output in production mode.
- `pnpm run stripe:webhook`: Starts listening to Stripe webhooks locally for testing.

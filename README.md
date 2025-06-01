# Project Overview

This is a cryptocurrency wallet web application focused on Bitcoin, offering dynamic, user-friendly interfaces and seamless integration with a Laravel backend and blockchain functionality.

Components

1. Navbar.jsx
   Contains: Logo (Bitcoin), Navigation Options.

Pre-login: Welcome, Login, Register.

Post-login: Logout, Operations.

Features:

Day/Night mode toggle.

Language switcher (i18n integration).

Hamburger menu for mobile view.

Persistent across all pages.

2. Welcome.jsx
   Elements:

Welcome text and brief project description.

Button: "Get Started" leading to Login.jsx.

3. Login.jsx
   Form Elements:

Input fields: Email, Password.

Button: Log in (stores token and redirects to Operation.jsx).

Links:

Forgot Password → ForgotPassword.jsx.

Register Here → Register.jsx.

4. Register.jsx
   Form Elements:

Input fields: First Name, Last Name, Email, Password, Confirm Password.

Button: Register (redirects to Login.jsx).

5. Operation.jsx
   Buttons (navigate to subpages):

Wallet Management

IN Wallet Exchange

Cross Wallet Exchange

Withdraw

Deposit

6. Logout.jsx
   Logs out the user and removes the authentication token.

7. WalletManagement.jsx
   Fields:

Transaction Type: Add or Deduct

Currency Type

Amount

Button: Submit Transaction

8. InWalletExchange.jsx
   Fields:

Amount

From Currency

To Currency

Button: Convert

9. CrossWalletExchange.jsx
   Fields:

Amount

From Wallet

To Wallet

Button: Transfer

10. Withdraw.jsx
    Fields:

Amount

Operation Type (Request)

Button: Submit Withdrawal Request (pending admin approval)

11. Deposit.jsx
    Fields:

Amount

Operation Type

Button: Submit Deposit

Features
Axios Integration:

Handles login, register, and other API operations through Laravel backend endpoints.

Global State Management:

Implemented using AppContext.jsx to share user data (like tokens) across components.

Visual Effects:

Motion effects using Framer Motion

Lazy Loading for better performance

Temporary falling coin animation on initial load

Routing:

Managed with React Router and Suspense for smooth transitions

Includes modals and popups for enhanced interaction

Translation Ready:

Fully supports multilingual interfaces via i18n.

Additional Files
app.css: General styling and responsive design

App.jsx: Main application file, handles routing and context providers

api.jsx: Handles API calls for login, register, etc.

React + Vite
This project uses Vite for fast development and bundling, with built-in HMR and lightweight ESLint configuration.

Uses @vitejs/plugin-react for Fast Refresh

Ready to expand into TypeScript with typescript-eslint for scalable production apps

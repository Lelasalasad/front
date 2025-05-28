# Project Overview

This is a Bitcoin-centric web application with dynamic and user-friendly interfaces. Below are the main components and details:

## Components

### 1. Navbar.jsx
- **Contains**: Logo (Bitcoin), Navigation Options.
  - Pre-login: Welcome, Login, Register.
  - Post-login: Logout, Operation.
- **Features**: 
  - Day/Night mode toggle.
  - Language switcher.
  - Hamburger menu for mobile view.
  - Persistent across all pages.

### 2. Welcome.jsx
- **Elements**:
  - Welcome text.
  - Container with a brief description.
  - **Button**: "Get Started" leading to `login.jsx`.

### 3. Login.jsx
- **Form Elements**:
  - Input fields: Email, Password.
  - **Button**: Log in (stores token and redirects to `operation.jsx`).
- **Links**:
  - Forgot Password → `forgotpassword.jsx`.
  - Register Here → `register.jsx`.

### 4. Register.jsx
- **Form Elements**:
  - Input fields: First Name, Last Name, Email, Password, Confirm Password.
  - **Button**: Register (redirects to `login.jsx`).

### 5. Operation.jsx
- **Buttons** (lead to respective pages):
  - Wallet Management.
  - IN Wallet Exchange.
  - Cross Wallet Exchange.
  - Withdraw.
  - Deposit.

### 6. Logout.jsx
- Logs out the user and deletes the token.

### 7. Wallet Management.jsx
- **Fields**:
  - Transaction Type: Add or Deduct.
  - Currency Type.
  - Amount.
- **Button**: submitTransaction.

### 8. IN Wallet Exchange.jsx
- **Fields**:
  - Amount.
  - From Currency.
  - To Currency.
- **Button**: convert.

### 9. Cross Wallet Exchange.jsx
- **Fields**:
  - Amount.
  - From Wallet.
  - To Wallet.
- **Button**: transfer.

### 10. Withdraw.jsx
- **Fields**:
  - Amount.
  - Operation Type.
- **Button**: Withdraw.

### 11. Deposit.jsx
- **Fields**:
  - Amount.
  - Operation Type.
- **Button**: Deposit.

## Features
- **Axios Integration**: Handles `login` and `register` operations with backend endpoints.
- **Global State Management**: Utilized `AppContext.jsx` for shared data across components.
- **Visual Effects**:
  - Motion effects using `motionframer`.
  - Lazy Loading for optimized rendering.
  - Short-lived falling coins animation on project load.
- **Routing**:
  - Implemented with `React Router`, including `Suspense` for smoother transitions.
  - Modals and popups for enhanced user interaction.
- **Translation Ready**: Included i18n for multilingual support.

## Additional Files
- **app.css**: Styling and responsive design.
- **app.jsx**: Main application file integrating routes and contexts.
- **api.jsx**: Handles API operations for `login` and `register`.

---

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react] uses [Babel] for Fast Refresh
- [@vitejs/plugin-react-swc] uses [SWC] for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enabling type-aware lint rules. Check out the [TS template] to integrate TypeScript and [`typescript-eslint`] in your project.
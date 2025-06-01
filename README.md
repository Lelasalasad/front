# 💰 Cryptocurrency Wallet Web Application

A web application focused on **Bitcoin wallet management and exchange**, built with **React + Vite** for the frontend, integrated with a **Laravel backend** and **blockchain functionality**.

---

## 📚 Overview

This project offers a dynamic and user-friendly interface that enables users to manage wallets, exchange currencies, and perform operations such as deposits and withdrawals.

---

## 🧩 Components

### 1. `Navbar.jsx`
- **Displays**:
  - Logo (Bitcoin)
  - Navigation links
    - Pre-login: `Welcome`, `Login`, `Register`
    - Post-login: `Logout`, `Operations`
- **Features**:
  - Dark/Light mode toggle
  - Language switcher (i18n)
  - Hamburger menu for mobile
  - Persistent across all pages

### 2. `Welcome.jsx`
- Welcome message and brief description
- **Button**: “Get Started” → `Login.jsx`

### 3. `Login.jsx`
- **Form Fields**: Email, Password
- **Button**: Log in (saves token and redirects to `Operation.jsx`)
- **Links**:
  - Forgot Password → `ForgotPassword.jsx`
  - Register Here → `Register.jsx`

### 4. `Register.jsx`
- **Form Fields**: First Name, Last Name, Email, Password, Confirm Password
- **Button**: Register → redirects to `Login.jsx`

### 5. `Operation.jsx`
- Navigation to main operations:
  - Wallet Management
  - In-Wallet Exchange
  - Cross-Wallet Exchange
  - Withdraw
  - Deposit

### 6. `Logout.jsx`
- Logs out user and removes authentication token

---

## ⚙️ Functional Pages

### 7. `WalletManagement.jsx`
- **Fields**: Transaction Type (Add/Deduct), Currency Type, Amount
- **Button**: Submit Transaction

### 8. `InWalletExchange.jsx`
- **Fields**: Amount, From Currency, To Currency
- **Button**: Convert

### 9. `CrossWalletExchange.jsx`
- **Fields**: Amount, From Wallet, To Wallet
- **Button**: Transfer

### 10. `Withdraw.jsx`
- **Fields**: Amount, Operation Type (Request)
- **Button**: Submit Withdrawal Request (awaiting admin approval)

### 11. `Deposit.jsx`
- **Fields**: Amount, Operation Type
- **Button**: Submit Deposit

---

## 🚀 Features

### 🔌 Axios Integration
- Handles API requests (`login`, `register`, etc.) with Laravel backend

### 🌐 Global State Management
- Shared user/authentication state using `AppContext.jsx`

### 🎨 Visual Effects
- Framer Motion animations
- Lazy loading for performance
- Falling coin animation on initial load

### 🧭 Routing
- Implemented using `React Router` with `Suspense` for smooth transitions
- Includes modals and popups

### 🌍 Multilingual Support
- i18n integration for internationalization

---

## 🗂️ Additional Files

- `app.css` – Global styling and responsive design
- `App.jsx` – Root component for routing and context
- `api.jsx` – API service layer for backend communication

---

## ⚡ Tech Stack

- **Frontend**: React + Vite
- **Backend**: Laravel (PHP)
- **Blockchain**: Wallet integration handled externally
- **Routing**: React Router
- **Styling**: CSS + Motion effects
- **Languages**: i18n support
- **Build Tool**: Vite with HMR and ESLint

---

## ✅ Future Enhancements
- Two-factor authentication
- Transaction history filtering
- Admin dashboard for withdrawal approvals

---

> Built with ❤️ by Lelas Al Asad and team – 2025

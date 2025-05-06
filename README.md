# BrokeBnB - Decentralized Property Rental Platform

A modern Web3 application for property rentals built with React, TypeScript, and Solidity smart contracts.

---

## Project Structure

```
BrokeBnB/
├── contracts/                 # Smart contracts
│   └── PropertyMarket.sol     # Main property rental contract
├── src/                       # Frontend source code
│   ├── components/            # Reusable React components
│   ├── contexts/              # React context providers
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility functions and configurations
│   ├── pages/                 # Page components
│   ├── App.tsx                # Main application component
│   └── main.tsx               # Application entry point
├── server/                    # Backend server code
├── public/                    # Static assets
└── configuration files        # Various config files for the project
```

---

## Technologies Used

### Frontend

* React 18
* TypeScript
* Vite
* Tailwind CSS
* [shadcn/ui](https://ui.shadcn.com/) components
* React Router DOM
* React Query
* React Hook Form with Zod validation

### Backend

* Express.js
* MongoDB with Mongoose
* JWT Authentication
* bcrypt for password hashing

### Smart Contracts

* Solidity
* Ethereum blockchain integration

---

## Getting Started

### Prerequisites

* Node.js (Latest LTS version recommended)
* npm or bun package manager
* MetaMask or similar Web3 wallet
* MongoDB (for local development)

### Installation

Clone the repository:

```bash
git clone <https://github.com/moduluz/BrokeBnB>
cd BrokeBnB
```

Install dependencies:

```bash
npm install
# or
bun install
```

Set up environment variables:
Create a `.env` file in the root directory with the following variables:

```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

Start the development server:

```bash
npm run dev
# or
bun dev
```

---

## Available Scripts

* `npm run dev` - Start development server
* `npm run build` - Build for production
* `npm run build:dev` - Build for development
* `npm run lint` - Run ESLint
* `npm run preview` - Preview production build

---

## Features

* Property listing and management
* User authentication and authorization
* Smart contract integration for secure transactions
* Responsive and modern UI with shadcn/ui
* Form validation with React Hook Form and Zod
* State management with React Query
* Real-time updates and notifications

---

## Contributing

1. Fork the repository
2. Create your feature branch:

```bash
git checkout -b feature/amazing-feature
```

3. Commit your changes:

```bash
git commit -m "Add some amazing feature"
```

4. Push to the branch:

```bash
git push origin feature/amazing-feature
```

5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Support

For support, please open an issue in the GitHub repository or contact the development team.

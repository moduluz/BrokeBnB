BrokeBnB - Decentralized Property Rental Platform
BrokeBnB is a modern web3 application for budget-friendly property rentals, built with the MERN stack (MongoDB, Express.js, React, Node.js), TypeScript, and Solidity smart contracts for secure, decentralized transactions.
Overview
BrokeBnB enables users to list, browse, and book properties with a focus on affordability, leveraging Ethereum blockchain for transparent and secure rental agreements. The application features a responsive UI, robust backend APIs, and smart contract integration, showcasing full stack and web3 development skills.
Project Structure
├── contracts/                 # Solidity smart contracts
│   └── PropertyMarket.sol    # Core rental contract
├── src/                      # Frontend source code
│   ├── components/           # Reusable React components
│   ├── contexts/            # React context providers
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions
│   ├── pages/               # Page components
│   ├── App.tsx             # Main app component
│   └── main.tsx            # App entry point
├── server/                  # Backend Express.js code
├── public/                  # Static assets
└── configuration files      # Vite, TypeScript, Tailwind configs

Technologies Used

Frontend:

React 18
TypeScript
Vite
Tailwind CSS
shadcn/ui components
React Router DOM
React Query
React Hook Form with Zod


Backend:

Express.js
MongoDB with Mongoose
JWT Authentication
bcrypt for password hashing


Blockchain:

Solidity
Ethereum blockchain



Features

Property listing, search, and booking
Secure user authentication and authorization
Decentralized transactions via smart contracts
Responsive, modern UI with shadcn/ui
Form validation with React Hook Form and Zod
Real-time data updates with React Query
Scalable backend with MongoDB

Getting Started
Prerequisites

Node.js (LTS version)
npm or bun
MongoDB (local or cloud)
MetaMask or Web3 wallet
Git

Installation

Clone the repository:

git clone https://github.com/moduluz/BrokeBnB.git
cd BrokeBnB


Install dependencies:

npm install
# or
bun install


Configure environment variables:Create a .env file in the root directory:

MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret


Run the development server:

npm run dev
# or
bun dev

Available Scripts

npm run dev: Start development server
npm run build: Build for production
npm run lint: Run ESLint
npm run preview: Preview production build

Contributing
Contributions are welcome! To contribute:

Fork the repository.
Create a feature branch (git checkout -b feature/your-feature).
Commit changes (git commit -m 'Add your feature').
Push to the branch (git push origin feature/your-feature).
Open a Pull Request.

License
Licensed under the MIT License. See the LICENSE file for details.
Contact
For questions or support, open an issue or contact Aditya Singh Khichi at adityakhichi2003@gmail.com.
Acknowledgments
Built by Aditya Singh Khichi as part of a full stack and web3 learning journey. Check out more projects at https://keen-entremet-407b9a.netlify.app/.

import { Web3Connect } from '../components/Web3Connect';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
        <Web3Connect />
      </div>
    </div>
  );
} 
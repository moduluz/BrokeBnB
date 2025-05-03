import { useWeb3 } from '../contexts/Web3Context';
import { Button } from './ui/button';
import { Wallet } from 'lucide-react';

export const Web3Connect = () => {
  const { isConnected, address, balance, connect, disconnect } = useWeb3();

  return (
    <div className="flex items-center gap-2">
      {isConnected ? (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 hidden lg:inline">
            {balance} ETH
          </span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={disconnect}
            className="flex items-center gap-2"
          >
            <Wallet size={16} />
            <span className="hidden sm:inline truncate max-w-[100px]">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </span>
          </Button>
        </div>
      ) : (
        <Button 
          onClick={connect}
          size="sm"
          className="bg-realestate-600 hover:bg-realestate-700"
        >
          <Wallet size={16} className="mr-2" />
          Connect Wallet
        </Button>
      )}
    </div>
  );
}; 
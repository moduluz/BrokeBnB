import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { transactionsApi } from '@/services/api';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, Home, Calendar, User, UserX, Link as LinkIcon } from "lucide-react";

interface TransactionHistoryProps {
  propertyId?: string;
}

interface Transaction {
  _id: string;
  type: 'rent' | 'purchase' | 'tenant-removal';
  paymentMethod: 'traditional' | 'blockchain';
  amount: number;
  status: string;
  startDate?: string;
  endDate?: string;
  depositAmount?: number;
  blockchainDetails?: {
    transactionHash: string;
    network: string;
    tokenAddress: string;
    tokenSymbol: string;
  };
  traditionalDetails?: {
    paymentId: string;
    bankDetails?: {
      accountNumber: string;
      routingNumber: string;
      bankName: string;
    };
  };
  property: {
    _id: string;
    title: string;
    location: {
      address: string;
      city: string;
      state: string;
      zipCode: string;
    };
  };
  tenant?: {
    _id: string;
    name: string;
    email: string;
  };
  landlord?: {
    _id: string;
    name: string;
    email: string;
  };
  buyer?: {
    _id: string;
    name: string;
    email: string;
  };
  seller?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  notes?: string;
}

export function TransactionHistory({ propertyId }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'blockchain' | 'traditional'>('all');

  console.log("TransactionHistory component with propertyId:", propertyId);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!propertyId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("TransactionHistory fetching data for property:", propertyId);
        const response = await transactionsApi.getByPropertyId(propertyId);
        console.log("TransactionHistory fetch response:", response.data);
        setTransactions(response.data || []);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [propertyId]);

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true;
    return transaction.paymentMethod === filter;
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatAmount = (amount: number, transaction: Transaction) => {
    if (transaction.paymentMethod === 'blockchain' && transaction.blockchainDetails) {
      return `${amount} ${transaction.blockchainDetails.tokenSymbol}`;
    }
    return `$${amount.toLocaleString()}`;
  };

  // Helper to generate Etherscan link (adjust based on network if needed)
  const getEtherscanLink = (txHash: string) => {
    // Assuming Sepolia testnet, replace if using mainnet or other testnet
    return `https://sepolia.etherscan.io/tx/${txHash}`;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full max-w-sm" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>No transactions found for this property.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return <DollarSign className="h-5 w-5 text-green-500" />;
      case 'rent':
        return <Home className="h-5 w-5 text-blue-500" />;
      case 'tenant-removal':
        return <UserX className="h-5 w-5 text-red-500" />;
      default:
        return <Calendar className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case 'purchase':
        return 'Purchase';
      case 'rent':
        return 'Rental';
      case 'tenant-removal':
        return 'Tenant Removal';
      default:
        return type;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>On-Chain Transaction History</CardTitle>
        <CardDescription>All recorded transactions for this property</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <Card key={transaction._id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        {getTransactionTypeLabel(transaction.type)}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(transaction.createdAt)}
                      </p>
                      {transaction.type === 'tenant-removal' && transaction.notes && (
                        <p className="text-sm mt-2 italic">
                          {transaction.notes}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          variant={transaction.status === 'completed' ? 'default' : 'outline'}
                          className={transaction.status === 'completed' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                        >
                          {transaction.status}
                        </Badge>
                        {transaction.type !== 'tenant-removal' && (
                          <Badge variant="outline">
                            {transaction.paymentMethod}
                          </Badge>
                        )}
                        {transaction.paymentMethod === 'blockchain' && transaction.blockchainDetails?.transactionHash && (
                          <a 
                            href={getEtherscanLink(transaction.blockchainDetails.transactionHash)}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center text-xs text-indigo-600 hover:underline"
                          >
                            <LinkIcon className="h-3 w-3 mr-1" /> View on Etherscan
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {transaction.type !== 'tenant-removal' ? (
                      <p className="text-lg font-bold">₹{transaction.amount.toLocaleString()}</p>
                    ) : (
                      <div className="flex items-center text-sm text-red-500">
                        <UserX className="h-4 w-4 mr-1" />
                        Tenant Removed
                      </div>
                    )}
                    <div className="flex flex-col text-sm text-gray-500 mt-1">
                      <span className="flex items-center">
                        <User className="h-3 w-3 mr-1" /> 
                        {transaction.type === 'tenant-removal' 
                          ? 'Ex-tenant:' 
                          : 'Buyer:'} {transaction.tenant?.name || transaction.buyer?.name || 'Unknown'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 
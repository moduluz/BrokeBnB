import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { useWeb3 } from '@/contexts/Web3Context';
import { transactionsApi } from '@/services/api';
import { ethers } from 'ethers';

interface PurchaseConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  propertyTitle: string;
  price: number;
  type: 'rent' | 'purchase';
}

export function PurchaseConfirmationModal({
  isOpen,
  onClose,
  propertyId,
  propertyTitle,
  price,
  type,
}: PurchaseConfirmationModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'traditional' | 'blockchain'>('traditional');
  const [loading, setLoading] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    accountNumber: '',
    routingNumber: '',
    bankName: '',
  });
  const { toast } = useToast();
  const { address, signer } = useWeb3();

  const handleTraditionalPayment = async () => {
    if (!bankDetails.accountNumber || !bankDetails.routingNumber || !bankDetails.bankName) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all bank details.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      const response = await transactionsApi.create({
        propertyId,
        type,
        paymentMethod: 'traditional',
        amount: price,
        traditionalDetails: {
          paymentId: crypto.randomUUID(),
          bankDetails,
        },
      });

      toast({
        title: 'Payment Initiated',
        description: 'Your traditional payment has been initiated successfully.',
      });
      onClose();
    } catch (error) {
      console.error('Traditional payment error:', error);
      toast({
        title: 'Payment Failed',
        description: 'There was an error processing your payment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBlockchainPayment = async () => {
    if (!address || !signer) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet to proceed with blockchain payment.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      const transaction = await signer.sendTransaction({
        to: process.env.NEXT_PUBLIC_PAYMENT_ADDRESS,
        value: ethers.parseEther(price.toString()),
      });

      await transaction.wait();

      const response = await transactionsApi.create({
        propertyId,
        type,
        paymentMethod: 'blockchain',
        amount: price,
        blockchainDetails: {
          transactionHash: transaction.hash,
          network: (await signer.provider.getNetwork()).name,
          tokenAddress: '0x0000000000000000000000000000000000000000', // ETH
          tokenSymbol: 'ETH',
        },
      });

      toast({
        title: 'Payment Successful',
        description: 'Your blockchain payment has been processed successfully.',
      });
      onClose();
    } catch (error) {
      console.error('Blockchain payment error:', error);
      toast({
        title: 'Payment Failed',
        description: 'There was an error processing your blockchain payment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (paymentMethod === 'traditional') {
      await handleTraditionalPayment();
    } else {
      await handleBlockchainPayment();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm {type === 'rent' ? 'Rental' : 'Purchase'}</DialogTitle>
          <DialogDescription>
            {propertyTitle} - ${price.toLocaleString()}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <RadioGroup
            defaultValue="traditional"
            value={paymentMethod}
            onValueChange={(value: 'traditional' | 'blockchain') => setPaymentMethod(value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="traditional" id="traditional" />
              <Label htmlFor="traditional">Traditional Payment</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="blockchain" id="blockchain" />
              <Label htmlFor="blockchain">Blockchain Payment</Label>
            </div>
          </RadioGroup>

          {paymentMethod === 'traditional' && (
            <div className="grid gap-2">
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                value={bankDetails.bankName}
                onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
              />
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                value={bankDetails.accountNumber}
                onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
              />
              <Label htmlFor="routingNumber">Routing Number</Label>
              <Input
                id="routingNumber"
                value={bankDetails.routingNumber}
                onChange={(e) => setBankDetails({ ...bankDetails, routingNumber: e.target.value })}
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm {type === 'rent' ? 'Rental' : 'Purchase'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

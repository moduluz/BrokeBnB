import { useCallback } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '../contexts/Web3Context';
import { abi as PropertyMarketABI } from '../contracts/PropertyMarket.json';

// Use Vite's environment variable format
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';

export const usePropertyContract = () => {
  const { provider, signer } = useWeb3();

  const getContract = useCallback(() => {
    if (!provider || !signer) {
      console.warn("Contract initialization failed: provider or signer not available", 
        { providerExists: !!provider, signerExists: !!signer });
      return null;
    }
    
    if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000') {
      console.error("Contract initialization failed: Invalid contract address", CONTRACT_ADDRESS);
      return null;
    }
    
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, PropertyMarketABI, signer);
      console.log("Contract initialized successfully with address:", CONTRACT_ADDRESS);
      return contract;
    } catch (error) {
      console.error("Failed to create contract instance:", error);
      return null;
    }
  }, [provider, signer]);

  // Helper function to get the current wallet address
  const getWalletAddress = useCallback(async () => {
    if (!signer) throw new Error('Wallet not connected');
    return await signer.getAddress();
  }, [signer]);

  // Check if the property is already owned by the current user
  const isPropertyOwnedByUser = useCallback(async (propertyId) => {
    try {
      const contract = getContract();
      if (!contract) return false;
      
      const currentAddress = await getWalletAddress();
      const propertyIdBigInt = ethers.getBigInt(propertyId);
      
      const propertyInfo = await contract.getProperty(propertyIdBigInt);
      
      console.log('Property owner check:', {
        propertyOwner: propertyInfo.owner,
        currentWallet: currentAddress,
        isOwner: propertyInfo.owner.toLowerCase() === currentAddress.toLowerCase()
      });
      
      return propertyInfo.owner.toLowerCase() === currentAddress.toLowerCase();
    } catch (error) {
      console.error('Error checking property ownership:', error);
      return false;
    }
  }, [getContract, getWalletAddress]);

  // Create a "proxy" owner account for listing properties
  // This is a workaround to allow a user to both list and purchase a property
  // In a real app, you'd either use a marketplace contract with escrow or a different approach
  const createProxyListing = useCallback(async (propertyId, price) => {
    const contract = getContract();
    if (!contract) throw new Error('Contract not initialized');

    try {
      // For demo purposes, we'll use a fixed alternative address created from the propertyId
      // This is just for demonstration and would be done properly in a real application
      // In real scenarios, you'd have the backend handle this or use a proper escrow contract
      const randomWallet = ethers.Wallet.createRandom();
      console.log('Created proxy wallet for listing:', randomWallet.address);
      
      // In a real implementation, you would:
      // 1. Have a backend create this listing with a server-side wallet
      // 2. Use a proper escrow smart contract
      // 3. Use a marketplace contract that doesn't require direct ownership
      
      return {
        success: true,
        proxyAddress: randomWallet.address,
        message: "Created proxy listing (simulated)"
      };
    } catch (error) {
      console.error('Error creating proxy listing:', error);
      return { success: false, error };
    }
  }, [getContract]);

  const listProperty = useCallback(async (propertyId: number, price: string) => {
    const contract = getContract();
    if (!contract) throw new Error('Contract not initialized');

    try {
      // Ensure propertyId is a valid number
      if (isNaN(propertyId)) throw new Error('Invalid property ID');
      
      // Convert the price to Wei
      const priceInWei = ethers.parseUnits(price, 'ether');
      console.log('Property ID:', propertyId);
      console.log('List Price in Wei:', priceInWei.toString());
      
      // Convert propertyId to BigInt
      const propertyIdBigInt = ethers.getBigInt(propertyId);
      
      // Log debug info
      console.log('Contract address:', CONTRACT_ADDRESS);
      console.log('Listing property with ID:', propertyIdBigInt.toString());

      // First check if the property is already listed
      try {
        const propertyInfo = await contract.getProperty(propertyIdBigInt);
        if (propertyInfo.isForSale) {
          console.log('Property is already listed on the blockchain:', {
            id: propertyInfo.id.toString(),
            price: ethers.formatEther(propertyInfo.price),
            owner: propertyInfo.owner
          });
          
          // Check if we own this property
          const isOwner = await isPropertyOwnedByUser(propertyId);
          if (isOwner) {
            console.log('WARNING: You already own this property on the blockchain. You cannot buy your own property!');
            
            // Prompt for another wallet or use a proxy
            // For this demo, we'll just return success to continue the flow
            return { 
              hash: 'already-listed-by-you',
              alreadyOwned: true
            };
          }
          
          return { 
            hash: 'already-listed',
            owner: propertyInfo.owner,
            price: ethers.formatEther(propertyInfo.price)
          };
        }
      } catch (propertyCheckError) {
        console.warn('Error checking if property already listed:', propertyCheckError);
        // Continue with listing
      }
      
      // Send transaction with higher gas limit
      const tx = await contract.listProperty(propertyIdBigInt, priceInWei, {
        gasLimit: 500000
      });
      
      console.log('List transaction submitted:', tx.hash);
      const receipt = await tx.wait();
      console.log('List transaction receipt:', receipt);
      
      // Check receipt status
      if (receipt.status === 0) {
        console.error('List transaction failed at execution');
        throw new Error('Property listing transaction failed on the blockchain');
      }
      
      return tx;
    } catch (error: any) {
      console.error('Error in listProperty:', error);
      
      // Provide more useful error messages
      if (error.reason) {
        throw new Error(`Listing error: ${error.reason}`);
      } else if (error.message && (
        error.message.includes('already listed') || 
        error.message.includes('already for sale')
      )) {
        console.log('Property is already listed, continuing...');
        return { hash: 'already-listed' }; // Return a mock transaction to allow process to continue
      } else {
        throw error;
      }
    }
  }, [getContract, isPropertyOwnedByUser]);

  const buyProperty = useCallback(async (propertyId: number, price: string) => {
    const contract = getContract();
    if (!contract) throw new Error('Contract not initialized');

    try {
      // Ensure propertyId is a valid number
      if (isNaN(propertyId)) throw new Error('Invalid property ID');
      
      // Convert the price to Wei
      let priceInWei = ethers.parseUnits(price, 'ether');
      console.log('Property ID:', propertyId);
      console.log('Purchase Price in Wei:', priceInWei.toString());
      
      // Convert propertyId to BigInt
      const propertyIdBigInt = ethers.getBigInt(propertyId);
      
      // Check balance before transaction
      const userAddress = await signer?.getAddress();
      if (!userAddress) throw new Error('Could not get user address');
      
      const balance = await provider?.getBalance(userAddress);
      if (!balance) throw new Error('Could not get account balance');
      
      console.log('User address:', userAddress);
      console.log('User balance:', ethers.formatEther(balance), 'ETH');
      console.log('Required amount:', ethers.formatEther(priceInWei), 'ETH');
      
      if (balance < priceInWei) {
        throw new Error(`Insufficient funds. You need ${ethers.formatEther(priceInWei)} ETH but your balance is ${ethers.formatEther(balance)} ETH`);
      }
      
      // Check if property exists and is for sale
      try {
        const propertyInfo = await contract.getProperty(propertyIdBigInt);
        console.log('Property info from blockchain:', {
          id: propertyInfo.id.toString(),
          owner: propertyInfo.owner,
          price: ethers.formatEther(propertyInfo.price),
          isForSale: propertyInfo.isForSale
        });
        
        // Check if we're trying to buy our own property (which is not allowed)
        if (propertyInfo.owner.toLowerCase() === userAddress.toLowerCase()) {
          throw new Error("You cannot purchase your own property on the blockchain. In a real application, this would be handled with a marketplace contract.");
        }
        
        if (!propertyInfo.isForSale) {
          throw new Error('This property is not currently for sale on the blockchain');
        }
        
        // Check if the price matches
        if (propertyInfo.price.toString() !== priceInWei.toString()) {
          console.warn(`Price mismatch: Listed ${ethers.formatEther(propertyInfo.price)} ETH vs. Paying ${ethers.formatEther(priceInWei)} ETH`);
          // Use the blockchain price instead
          priceInWei = propertyInfo.price;
        }
      } catch (propertyCheckError: any) {
        console.warn('Error checking property details:', propertyCheckError);
        
        // If the specific error is about ownership, we should stop here
        if (propertyCheckError.message && propertyCheckError.message.includes("You cannot purchase your own property")) {
          throw propertyCheckError;
        }
        
        // For other errors, continue anyway as the contract will validate
      }
      
      // Attempt to execute the transaction with higher gas limit
      console.log('Sending purchase transaction with gas limit: 750000');
      const tx = await contract.purchaseProperty(propertyIdBigInt, { 
        value: priceInWei,
        gasLimit: 750000 // Increase gas limit further to avoid out-of-gas errors
      });
      
      console.log('Transaction submitted:', tx.hash);
      
      // Wait for receipt with timeout and error handling
      let receipt;
      try {
        console.log('Waiting for transaction receipt...');
        receipt = await tx.wait();
        console.log('Purchase transaction receipt:', receipt);
      } catch (receiptError: any) {
        console.error('Error getting transaction receipt:', receiptError);
        
        // Check if transaction was reverted
        if (receiptError.receipt) {
          console.log('Transaction receipt from error:', receiptError.receipt);
          if (receiptError.receipt.status === 0) {
            throw new Error('Transaction was reverted by the blockchain. The property may not be available or another issue occurred.');
          }
        }
        
        throw new Error('Failed to get transaction receipt: ' + (receiptError.message || 'Unknown error'));
      }
      
      if (receipt.status === 0) {
        // Transaction failed at execution
        console.error('Transaction reverted on chain');
        throw new Error("Transaction reverted by the blockchain. This could be due to contract restrictions or insufficient permissions.");
      }
      
      return tx;
    } catch (error: any) {
      console.error('Error in buyProperty:', error);
      
      // Make the error message more user-friendly
      if (error.code === 'CALL_EXCEPTION') {
        if (error.reason) {
          throw new Error(`Transaction failed: ${error.reason}`);
        } else if (error.receipt) {
          // Check the transaction receipt for more info
          console.log('Failed transaction receipt:', error.receipt);
          throw new Error("Transaction failed on the blockchain. Please try again with traditional payment.");
        } else if (error.message && error.message.includes('revert')) {
          // Smart contract reversion - try to interpret the exact reason
          if (error.data) {
            // Try to decode the error data if available
            console.log('Error data:', error.data);
          }
          
          // Check common revert reasons
          if (error.message.includes('Owner cannot buy')) {
            throw new Error("You cannot purchase your own property. This is a limitation of the current smart contract.");
          } else if (error.message.includes('not for sale')) {
            throw new Error("This property is not marked for sale on the blockchain.");
          } else if (error.message.includes('Insufficient payment')) {
            throw new Error("The payment amount is insufficient to purchase this property.");
          } else {
            throw new Error("Transaction failed. This may be because the property is no longer for sale or you don't have permission to buy it.");
          }
        } else {
          throw new Error("Transaction failed. This may be because the property is no longer for sale or you don't have permission to buy it.");
        }
      } else if (error.code === 'INSUFFICIENT_FUNDS') {
        throw new Error("You don't have enough ETH to complete this purchase. Please add funds to your wallet.");
      } else if (error.message && error.message.includes('user rejected')) {
        throw new Error("Transaction was rejected by the user.");
      } else {
        throw error;
      }
    }
  }, [getContract, provider, signer]);

  const getProperty = useCallback(async (propertyId: number) => {
    const contract = getContract();
    if (!contract) throw new Error('Contract not initialized');

    try {
      // Ensure propertyId is a valid number
      if (isNaN(propertyId)) throw new Error('Invalid property ID');
      
      // Convert propertyId to BigInt
      const propertyIdBigInt = ethers.getBigInt(propertyId);
      
      const property = await contract.getProperty(propertyIdBigInt);
      return {
        id: property.id.toString(),
        owner: property.owner,
        price: ethers.formatUnits(property.price, 'ether'),
        isForSale: property.isForSale,
      };
    } catch (error) {
      console.error('Error in getProperty:', error);
      throw error;
    }
  }, [getContract]);

  return {
    listProperty,
    buyProperty,
    getProperty,
    isPropertyOwnedByUser,
    createProxyListing,
    getContract
  };
}; 
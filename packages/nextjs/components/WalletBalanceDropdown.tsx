"use client";

import { useEffect, useState } from "react";
import { useWallets } from "@privy-io/react-auth";
import { formatEther } from "viem";
import { useTargetNetwork } from "~~/hooks/scaffold-eth";
import { useWatchBalance } from "~~/hooks/scaffold-eth/useWatchBalance";

export const WalletBalanceDropdown = () => {
  const { ready, wallets } = useWallets();
  const [mounted, setMounted] = useState(false);
  const { targetNetwork } = useTargetNetwork();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Get primary wallet address (first wallet)
  const primaryWalletAddress = wallets[0]?.address;

  // Use useWatchBalance hook to get balance, which refreshes automatically when block height changes
  const { data: balanceData, isLoading: isBalanceLoading } = useWatchBalance({
    address: primaryWalletAddress as `0x${string}`,
    chainId: targetNetwork.id,
  });

  // If component is not mounted or no wallets, don't display anything
  if (!mounted || !ready || !wallets.length) {
    return null;
  }

  return (
    <div className="flex flex-col items-end">
      <div className="flex items-center gap-1">
        <div className="w-2 h-2 bg-success rounded-full"></div>
        {isBalanceLoading ? (
          <span className="loading loading-spinner loading-xs"></span>
        ) : (
          <span className="text-xs font-medium">
            {balanceData ? parseFloat(formatEther(balanceData.value)).toFixed(4) : "0"} {balanceData?.symbol || "ETH"}
          </span>
        )}
      </div>
      <div className="text-xs opacity-70 mt-0.5">
        {targetNetwork.name}
      </div>
    </div>
  );
}; 
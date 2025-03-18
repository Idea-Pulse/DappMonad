"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePrivy, useWallets } from "@privy-io/react-auth";

export const PrivyLogin = () => {
  const { 
    ready, 
    authenticated, 
    user, 
    login, 
    logout, 
    createWallet 
  } = usePrivy();
  const { wallets } = useWallets();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // If Privy is not ready or component is not mounted, show loading state
  if (!ready || !mounted) {
    return (
      <button className="btn btn-primary flex items-center gap-2 px-3 py-2">
        <span className="material-icons text-sm align-text-bottom">hourglass_empty</span>
        Loading...
      </button>
    );
  }

  // If user is authenticated
  if (authenticated && user) {
    // Get user display info safely
    const userData = user as any; // Use any to bypass TypeScript checks
    const userAvatar = userData.avatarUrl || null;
    
    // Safely extract display name
    let displayName = "User";
    if (userData.email?.address) displayName = userData.email.address;
    else if (userData.google?.email) displayName = userData.google.email;
    else if (userData.github?.username) displayName = userData.github.username;
    else if (userData.twitter?.username) displayName = userData.twitter.username;
    else if (userData.wallet?.address) {
      const addr = userData.wallet.address;
      displayName = `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    }

    return (
      <div className="flex items-center gap-2">
        {/* Display user info */}
        <div className="dropdown dropdown-end leading-3">
          <label tabIndex={0} className="btn btn-primary btn-sm pl-2 pr-2 shadow-md dropdown-toggle gap-0 !h-auto">
            {userAvatar ? (
              <img src={userAvatar} alt="User Avatar" className="w-6 h-6 rounded-full mr-2" />
            ) : (
              <span className="material-icons text-sm align-text-bottom mr-2">account_circle</span>
            )}
            <span className="ml-1 mr-1 text-sm">
              {displayName}
            </span>
            <span className="material-icons text-sm align-text-bottom ml-1">arrow_drop_down</span>
          </label>
          <ul tabIndex={0} className="dropdown-content menu z-[2] p-2 mt-2 shadow-center shadow-accent bg-base-200 rounded-box gap-1">
            <li>
              <button 
                className="menu-item btn-sm !rounded-xl flex gap-3 py-3" 
                type="button"
                onClick={() => logout()}
              >
                <span className="material-icons text-sm align-text-bottom">logout</span>
                <span>Logout</span>
              </button>
            </li>
            {wallets.length === 0 && (
              <li>
                <button 
                  className="menu-item btn-sm !rounded-xl flex gap-3 py-3" 
                  type="button"
                  onClick={() => createWallet()}
                >
                  <span className="material-icons text-sm align-text-bottom">account_balance_wallet</span>
                  <span>Create Wallet</span>
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    );
  }

  // If user is not authenticated
  return (
    <button 
      className="btn btn-primary flex items-center gap-2 px-3 py-2"
      onClick={() => login()}
    >
      <span className="material-icons text-sm align-text-bottom">login</span>
      Login
    </button>
  );
}; 
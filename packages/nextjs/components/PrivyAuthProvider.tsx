"use client";

import { ReactNode } from "react";
import { PrivyProvider } from '@privy-io/react-auth';

interface PrivyAuthProviderProps {
  children: ReactNode;
}

export const PrivyAuthProvider = ({ children }: PrivyAuthProviderProps) => {
  return (
    <PrivyProvider 
      appId="cm88595z900e1vs9d2wj11zgn"
      config={{
        "appearance": {
          "accentColor": "#6A6FF5",
          "theme": "#FFFFFF",
          "showWalletLoginFirst": false,
          "logo": "https://auth.privy.io/logos/privy-logo.png",
          "walletChainType": "ethereum-only",
          "walletList": [
            "detected_ethereum_wallets",
            "metamask",
            "coinbase_wallet",
            "rainbow",
            "wallet_connect"
          ]
        },
        "loginMethods": [
          "email",
          "wallet",
          "google",
          "github",
          "twitter"
        ],
        "fundingMethodConfig": {
          "moonpay": {
            "useSandbox": true
          }
        },
        "embeddedWallets": {
          "requireUserPasswordOnCreate": false,
          "showWalletUIs": true,
          "ethereum": {
            "createOnLogin": "users-without-wallets"
          }
        },
        "mfa": {
          "noPromptOnMfaRequired": false
        }
      }}
    >
      {children}
    </PrivyProvider>
  );
}; 
/**
 * Privy configuration for FlowPay.
 *
 * Set VITE_PRIVY_APP_ID in .env to your Privy App ID from https://dashboard.privy.io
 * The app still works without it (falls back to ConnectKit / injected wallet), but the
 * Privy modal (email, social, passkey, embedded wallet) requires a real App ID.
 */
import type { PrivyClientConfig } from '@privy-io/react-auth'
import { arcMainnet } from '../config'

export const PRIVY_APP_ID: string =
  (import.meta.env.VITE_PRIVY_APP_ID as string | undefined) ?? 'cmvikpq2p00xo0fl5ma2c4mc4'

export const privyConfig: PrivyClientConfig = {
  // Show Arc Mainnet as the default chain in the Privy UI
  defaultChain: arcMainnet,
  supportedChains: [arcMainnet],

  // Login methods shown in the Privy modal
  // Put 'wallet' first so MetaMask/WalletConnect is always available
  // even when the embedded wallet dashboard setting is not yet enabled
  loginMethods: ['wallet', 'email'],

  // Embedded wallet: create one for every new user that logs in via email
  // NOTE: also enable "Create on login" in the Privy dashboard under
  // Settings → Wallets → Embedded wallets, and set mode to "Client-side"
  embeddedWallets: {
    ethereum: { createOnLogin: 'users-without-wallets' },
  },

  appearance: {
    theme: 'light',
    accentColor: '#122d45',
    logo: undefined,
    walletChainType: 'ethereum-only',
    // Show external wallets (MetaMask, WalletConnect) prominently
    showWalletLoginFirst: true,
  },
}

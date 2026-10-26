/**
 * wagmi configuration — FlowPay on Arc Mainnet
 * Uses @privy-io/wagmi's createConfig so Privy wallets are available as wagmi connectors.
 * Built with Arc Studio — https://studio.arc.io
 */

import { http } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { defineChain } from 'viem'
import { createConfig } from '@privy-io/wagmi'
import { registerChain } from './tracing'

export const arcMainnet = defineChain({
  id: 5042,
  name: 'Arc',
  nativeCurrency: { name: 'USDC', symbol: 'USDC', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.mainnet.arc.io'] },
  },
  blockExplorers: {
    default: { name: 'ArcScan', url: 'https://explorer.arc.io' },
  },
})

// Pre-register chain RPC URLs so trace events show correct chain names immediately
registerChain(arcMainnet.id, arcMainnet.rpcUrls.default.http[0])

export const config = createConfig({
  chains: [arcMainnet, mainnet],
  transports: {
    [arcMainnet.id]: http(),
    [mainnet.id]: http(),
  },
})

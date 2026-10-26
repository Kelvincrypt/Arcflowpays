# FlowPay

> Built with Arc Studio — USDC payment infrastructure on Arc Mainnet

FlowPay is a full-featured USDC payment web app built on Arc Mainnet (chain 5042) where USDC is the native gas token. It provides scheduled recurring transfers, cross-border remittances with FX preview, split payments, QR code generation, contacts management, and transaction history.

---

## Deployed Contract

- **Contract**: FlowPay
- **Address**: `0x2c9d68b37654e097150abd78cdc3e4460ea7bc03`
- **Network**: Arc Testnet (chain 5042002) — referenced for dev; target chain is Arc Mainnet 5042
- **Explorer**: https://explorer.arc.io/address/0x2c9d68b37654e097150abd78cdc3e4460ea7bc03
- **Functions**: `createSchedule`, `executeSchedule`, `cancelSchedule`, `sendRemittance`, `scheduleCount`, `getSchedule`

## Tech Stack

- Frontend: React 18, Vite, TypeScript, Tailwind CSS, framer-motion
- Web3: wagmi v2, viem v2, ConnectKit
- Chain: Arc Mainnet (Chain ID: 5042, defined inline with `defineChain`)
- Token: USDC (6 decimals, address: `0x3600000000000000000000000000000000000000`)
- Fonts: Space Grotesk (display), DM Sans (body), JetBrains Mono (code)
- Storage: localStorage via `src/lib/storage.ts`
- Toasts: Sonner

## Key Files

- `src/App.tsx` — Landing gate + 7-tab navigation shell
- `src/components/LandingPage.tsx` — Marketing landing with comparison table + "How it works"
- `src/components/ScheduledTransfers.tsx` — Recurring payments via `createSchedule` / `executeSchedule`
- `src/components/Remittances.tsx` — Cross-border USDC sends via `sendRemittance`, live FX preview
- `src/components/TxHistory.tsx` — Filterable transaction history from localStorage
- `src/components/Contacts.tsx` — Saved wallet address book
- `src/components/QRPayment.tsx` — QR code generator for receive flows
- `src/components/SplitPayment.tsx` — Divide USDC across multiple recipients (direct ERC-20 transfers)
- `src/components/Profile.tsx` — Wallet details, schedule count, dark mode toggle, disconnect
- `src/lib/flowpay.ts` — Contract ABI, address, corridor codes
- `src/lib/storage.ts` — localStorage CRUD for contacts, schedules, history
- `src/lib/design.ts` — Shared glass tokens, springs, motion presets
- `src/lib/share.ts` — `getShareBase()` / `buildShareLink()` for shareable URLs
- `src/config.ts` — wagmi config with Arc Mainnet defined via `defineChain`

## To Run

```bash
bun install
bun run dev
```

# FlowPay

> USDC-powered payments on Arc Mainnet — schedule transfers, send remittances, split bills, and receive via QR code.

[![Live App](https://img.shields.io/badge/Live%20App-Vercel-black?style=flat-square&logo=vercel)](https://arc-studio-f406da7a055a4552a392dfec.vercel.app)
[![Chain](https://img.shields.io/badge/Chain-Arc%20Mainnet%205042-blue?style=flat-square)](https://explorer.arc.io)
[![Token](https://img.shields.io/badge/Token-USDC-2775CA?style=flat-square)](https://www.circle.com/usdc)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](#)

Built with [Arc Studio](https://studio.arc.io)

---

## What is FlowPay?

FlowPay is a full-featured USDC payment app built on [Arc Mainnet](https://arc.io) — a blockchain where USDC is the native gas token, making every fee stable and predictable. No ETH needed, no price volatility on gas.

Users can schedule recurring payments, send cross-border remittances with live FX rates, split bills across friends, generate QR codes for receiving funds, and manage a contact book of wallet addresses — all from a clean mobile-first interface.

---

## Features

| Feature | Description |
|---|---|
| **Scheduled Transfers** | Set recurring USDC payments (weekly/monthly/once) for rent, subscriptions, school fees |
| **Cross-border Remittances** | Send USDC to 🇳🇬 NGN, 🇬🇭 GHS, 🇰🇪 KES, 🇵🇭 PHP, 🇲🇽 MXN, 🇮🇳 INR with live FX preview |
| **Split Payment** | Divide a USDC amount across multiple recipient addresses |
| **QR Payment** | Generate a scannable QR code from your wallet address with optional amount and label |
| **Contacts** | Save wallet addresses with nicknames for quick sending |
| **Transaction History** | View and filter past transfers and remittances |
| **Profile** | Live USDC balance, schedule count, dark mode toggle, disconnect |

---

## Smart Contract

Deployed on Arc Mainnet:

- **Address**: [`0x2c9d68b37654e097150abd78cdc3e4460ea7bc03`](https://explorer.arc.io/address/0x2c9d68b37654e097150abd78cdc3e4460ea7bc03)
- **Functions**: `createSchedule`, `executeSchedule`, `cancelSchedule`, `sendRemittance`
- **Security**: `ReentrancyGuard`, `SafeERC20`

---

## Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Framer Motion
- **Web3**: wagmi v2, viem, Privy (email + embedded wallet + MetaMask)
- **Chain**: Arc Mainnet (Chain ID: 5042)
- **Token**: USDC — `0x3600000000000000000000000000000000000000`
- **UI**: Glass-morphism cards, fixed bottom tab bar, animated page transitions
- **Storage**: localStorage (contacts, schedules, history)

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) v1.x
- A wallet with USDC on Arc Mainnet

### Install & Run

```bash
git clone https://github.com/Kelvincrypt/Arcflowpays
cd Arcflowpays
bun install
bun run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Environment Variables

| Variable | Purpose |
|---|---|
| `VITE_PRIVY_APP_ID` | Your Privy App ID from [dashboard.privy.io](https://dashboard.privy.io) |

Create a `.env` file in the project root:

```env
VITE_PRIVY_APP_ID=your_privy_app_id_here
```

### Build for Production

```bash
bun run build
```

Output goes to `dist/`.

---

## Project Structure

```
src/
├── components/
│   ├── LandingPage.tsx       # Marketing page with comparison table
│   ├── ScheduledTransfers.tsx # Recurring payments
│   ├── Remittances.tsx        # Cross-border sends with FX preview
│   ├── TxHistory.tsx          # Transaction history
│   ├── Contacts.tsx           # Address book
│   ├── QRPayment.tsx          # QR code generator
│   ├── SplitPayment.tsx       # Multi-recipient splits
│   └── Profile.tsx            # Wallet info + settings
├── lib/
│   ├── flowpay.ts             # Contract ABI + address
│   ├── storage.ts             # localStorage helpers
│   ├── privy.ts               # Privy config
│   └── share.ts               # Shareable link builder
├── config.ts                  # wagmi + Arc Mainnet chain config
└── App.tsx                    # Tab navigation shell
```

---

## License

MIT — built by [Kelvin](https://github.com/Kelvincrypt)

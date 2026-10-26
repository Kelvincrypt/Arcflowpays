/**
 * Privy-powered connect / account button for FlowPay.
 * Replaces ConnectKitButton throughout the app shell.
 */
import { usePrivy } from '@privy-io/react-auth'
import { useAccount, useDisconnect } from 'wagmi'
import { Loader2, LogOut, Wallet } from 'lucide-react'
import { formatAddress } from '../lib/design'

interface PrivyConnectButtonProps {
  /** Compact mode: show only address / icon, no label */
  compact?: boolean
}

export default function PrivyConnectButton({ compact = false }: PrivyConnectButtonProps) {
  const { ready, authenticated, login, logout } = usePrivy()
  const { address } = useAccount()
  const { disconnect } = useDisconnect()

  if (!ready) {
    return (
      <button
        disabled
        className="flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold opacity-60"
        style={{ background: 'var(--accent)', color: 'white' }}
      >
        <Loader2 className="size-4 animate-spin" />
        {!compact && <span>Loading…</span>}
      </button>
    )
  }

  if (authenticated && address) {
    return (
      <button
        onClick={() => { void logout(); disconnect() }}
        className="flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all hover:opacity-80 active:scale-[0.97]"
        style={{
          background: 'rgba(255,255,255,0.64)',
          border: '1px solid rgba(255,255,255,0.72)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          color: 'var(--ink)',
        }}
      >
        <span
          className="flex size-5 items-center justify-center rounded-full text-xs font-bold text-white"
          style={{ background: `hsl(${(address.charCodeAt(2) * 37) % 360}deg 50% 45%)` }}
        >
          {address.slice(2, 4).toUpperCase()}
        </span>
        {!compact && (
          <>
            <span className="mono text-xs">{formatAddress(address)}</span>
            <LogOut className="size-3.5 opacity-60" />
          </>
        )}
      </button>
    )
  }

  return (
    <button
      onClick={login}
      className="flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.97]"
      style={{ background: 'var(--accent)' }}
    >
      <Wallet className="size-4" />
      {!compact && <span>Connect</span>}
    </button>
  )
}

import { motion } from 'framer-motion'
import { useAccount, useDisconnect, useReadContract } from 'wagmi'
import PrivyConnectButton from './PrivyConnectButton'
import { erc20Abi } from 'viem'
import { toast } from 'sonner'
import { Copy, Moon, Sun, ExternalLink, LogOut, Shield, Zap } from 'lucide-react'
import { glass, spectral, fadeUp, formatAddress } from '../lib/design'
import { FLOWPAY_ABI, FLOWPAY_ADDRESS, USDC_ADDRESS } from '../lib/flowpay'
import { Amount } from '@/onchain-money'
import { buildAddressExplorerUrl } from '@/onchain-facts'
import { arcMainnet } from '../config'

const ARC_CHAIN_ID = arcMainnet.id
const USDC_DECIMALS = 6

interface Props {
  darkMode: boolean
  onToggleDark: () => void
}

export default function Profile({ darkMode, onToggleDark }: Props) {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()

  const { data: usdcBalance } = useReadContract({
    address: USDC_ADDRESS,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: ARC_CHAIN_ID,
  })

  const { data: schedCount } = useReadContract({
    address: FLOWPAY_ADDRESS,
    abi: FLOWPAY_ABI,
    functionName: 'scheduleCount',
    args: address ? [address] : undefined,
    chainId: ARC_CHAIN_ID,
  })

  const formattedBalance = usdcBalance != null ? Amount.fromRaw(usdcBalance, USDC_DECIMALS).toFixed(2) : '—'
  const scheduleCount = schedCount != null ? Number(schedCount) : '—'

  const handleCopy = () => {
    if (!address) return
    void navigator.clipboard.writeText(address).then(() => toast.success('Address copied!'))
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="display text-xl font-bold" style={{ color: 'var(--ink)' }}>Profile</h2>
        <p className="mt-0.5 text-xs" style={{ color: 'var(--muted)' }}>Your FlowPay account</p>
      </div>

      {!address ? (
        <motion.div {...fadeUp} className="rounded-3xl p-8 text-center" style={glass.card}>
          <p className="mb-4 text-sm font-medium" style={{ color: 'var(--muted)' }}>Connect your wallet to see your profile</p>
          <div className="flex justify-center">
            <PrivyConnectButton />
          </div>
        </motion.div>
      ) : (
        <>
          {/* Avatar + address card */}
          <motion.div {...fadeUp} className="rounded-3xl p-5" style={glass.card}>
            <div className="h-1 rounded-full mb-4" style={{ backgroundImage: spectral }} />
            <div className="flex items-center gap-4">
              <div
                className="flex size-14 items-center justify-center rounded-2xl text-xl font-bold text-white"
                style={{ background: `hsl(${(address.charCodeAt(2) * 37) % 360}deg 50% 45%)` }}
              >
                {address.slice(2, 4).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="mono truncate text-sm font-semibold" style={{ color: 'var(--ink)' }}>
                  {formatAddress(address)}
                </p>
                <p className="mt-0.5 text-xs" style={{ color: 'var(--muted)' }}>Arc Mainnet</p>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={handleCopy} className="rounded-lg p-1.5 hover:bg-black/5">
                  <Copy className="size-4" style={{ color: 'var(--muted)' }} />
                </button>
                <a
                  href={buildAddressExplorerUrl(ARC_CHAIN_ID, address)}
                  target="_blank" rel="noopener noreferrer"
                  className="rounded-lg p-1.5 hover:bg-black/5"
                >
                  <ExternalLink className="size-4" style={{ color: 'var(--muted)' }} />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            {...fadeUp}
            transition={{ delay: 0.06 }}
            className="grid grid-cols-2 gap-3"
          >
            {[
              { label: 'USDC Balance', value: formattedBalance, unit: 'USDC' },
              { label: 'Active Schedules', value: String(scheduleCount), unit: '' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl p-4 text-center" style={glass.card}>
                <p className="display text-2xl font-bold tabular-nums" style={{ color: 'var(--ink)' }}>
                  {stat.value}
                </p>
                <p className="mt-0.5 text-xs" style={{ color: 'var(--muted)' }}>
                  {stat.label}
                  {stat.unit ? ` (${stat.unit})` : ''}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Settings */}
          <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="rounded-3xl overflow-hidden" style={glass.card}>
            {/* Dark mode toggle */}
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: '1px solid var(--border)' }}
            >
              <div className="flex items-center gap-3">
                {darkMode ? (
                  <Moon className="size-5" style={{ color: 'var(--muted)' }} />
                ) : (
                  <Sun className="size-5" style={{ color: 'var(--muted)' }} />
                )}
                <span className="text-sm font-medium" style={{ color: 'var(--ink)' }}>Dark mode</span>
              </div>
              <button
                onClick={onToggleDark}
                className="relative h-6 w-11 rounded-full transition-colors"
                style={{ background: darkMode ? 'var(--accent)' : 'rgba(18,45,69,0.15)' }}
              >
                <span
                  className="absolute top-0.5 size-5 rounded-full bg-white shadow transition-transform"
                  style={{ transform: darkMode ? 'translateX(20px)' : 'translateX(2px)' }}
                />
              </button>
            </div>

            {/* Contract */}
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: '1px solid var(--border)' }}
            >
              <div className="flex items-center gap-3">
                <Shield className="size-5" style={{ color: 'var(--muted)' }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--ink)' }}>FlowPay contract</p>
                  <p className="mono text-xs" style={{ color: 'var(--muted)' }}>{formatAddress(FLOWPAY_ADDRESS)}</p>
                </div>
              </div>
              <a
                href={`https://explorer.arc.io/address/${FLOWPAY_ADDRESS}`}
                target="_blank" rel="noopener noreferrer"
              >
                <ExternalLink className="size-4" style={{ color: 'var(--muted)' }} />
              </a>
            </div>

            {/* Network */}
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <Zap className="size-5" style={{ color: 'var(--muted)' }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--ink)' }}>Network</p>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>Arc Mainnet · Chain 5042</p>
                </div>
              </div>
              <span
                className="rounded-full px-2.5 py-1 text-xs font-semibold"
                style={{ background: 'rgba(26,128,71,0.12)', color: 'var(--success)' }}
              >
                Live
              </span>
            </div>
          </motion.div>

          {/* Sign out */}
          <motion.div {...fadeUp} transition={{ delay: 0.14 }}>
            <button
              onClick={() => { disconnect(); toast.success('Wallet disconnected.') }}
              className="flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold transition-all hover:scale-[1.01] active:scale-[0.99]"
              style={{ ...glass.pill, color: 'var(--danger)' }}
            >
              <LogOut className="size-4" /> Disconnect wallet
            </button>
          </motion.div>
        </>
      )}
    </div>
  )
}

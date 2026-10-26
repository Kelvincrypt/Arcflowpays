import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useSwitchChain, useReadContract } from 'wagmi'
import { erc20Abi } from 'viem'
import { toast } from 'sonner'
import { Loader2, CheckCircle, TrendingUp } from 'lucide-react'
import { glass, spectral, fadeUp } from '../lib/design'
import { FLOWPAY_ADDRESS, FLOWPAY_ABI, CORRIDORS, USDC_ADDRESS } from '../lib/flowpay'
import { saveHistory } from '../lib/storage'
import { parseAmount, Amount } from '@/onchain-money'
import { buildTxExplorerUrl } from '@/onchain-facts'
import { arcMainnet } from '../config'

const ARC_CHAIN_ID = arcMainnet.id
const USDC_DECIMALS = 6

/** Convert a 2-letter ISO country code to its flag emoji (Regional Indicator pair). */
function countryFlag(code: string): string {
  return code
    .toUpperCase()
    .split('')
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join('')
}

function parseOnchainError(e: unknown): string {
  const msg = (e as { message?: string })?.message?.toLowerCase() ?? ''
  if (msg.includes('user rejected') || msg.includes('user denied')) return 'Transaction cancelled.'
  if (msg.includes('insufficient')) return 'Insufficient USDC balance.'
  if (msg.includes('reverted')) return 'Contract rejected the transaction.'
  return 'Something went wrong. Please try again.'
}

export default function Remittances() {
  const { address, chainId } = useAccount()
  const { switchChain } = useSwitchChain()
  const wrongChain = chainId !== ARC_CHAIN_ID

  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [corridor, setCorridor] = useState(CORRIDORS[0])
  const [memo, setMemo] = useState('')

  // USDC balance
  const { data: usdcBalance } = useReadContract({
    address: USDC_ADDRESS,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: ARC_CHAIN_ID,
  })
  const formattedBalance = usdcBalance != null ? Amount.fromRaw(usdcBalance, USDC_DECIMALS).toFixed(2) : null

  // Approve
  const { writeContract: approve, data: approveHash, isPending: approvePending } = useWriteContract()
  const { isLoading: approveConfirming } = useWaitForTransactionReceipt({ hash: approveHash })

  // Send remittance
  const { writeContract: send, data: sendHash, isPending: sendPending, isError: sendError, error: sendErr } = useWriteContract()
  const { isLoading: sendConfirming, isSuccess: sendSuccess } = useWaitForTransactionReceipt({ hash: sendHash })

  const fxAmount = amount && !isNaN(parseFloat(amount))
    ? (parseFloat(amount) * corridor.rate).toLocaleString('en-US', { maximumFractionDigits: 0 })
    : null

  const isBusy = approvePending || approveConfirming || sendPending || sendConfirming

  const handleSend = useCallback(() => {
    if (!address) return
    if (wrongChain) { switchChain({ chainId: ARC_CHAIN_ID }); return }
    if (!recipient || !amount) { toast.error('Fill in all fields.'); return }

    const parsed = parseAmount(ARC_CHAIN_ID, amount)
    approve({
      address: USDC_ADDRESS,
      abi: erc20Abi,
      functionName: 'approve',
      args: [FLOWPAY_ADDRESS, parsed.raw],
      chainId: ARC_CHAIN_ID,
    })
    send({
      address: FLOWPAY_ADDRESS,
      abi: FLOWPAY_ABI,
      functionName: 'sendRemittance',
      args: [recipient as `0x${string}`, parsed.raw, corridor.code, memo],
      chainId: ARC_CHAIN_ID,
    })
  }, [address, wrongChain, recipient, amount, corridor, memo, switchChain, approve, send])

  if (sendSuccess && sendHash) {
    saveHistory({ type: 'remittance', label: `Remittance to ${recipient.slice(0, 6)}...`, recipient, amount, corridorCode: corridor.code, memo, txHash: sendHash, status: 'confirmed' })
    toast.success('Remittance sent!')
    setRecipient(''); setAmount(''); setMemo('')
  }
  if (sendError) toast.error(parseOnchainError(sendErr))

  return (
    <div className="space-y-4">
      <div>
        <h2 className="display text-xl font-bold" style={{ color: 'var(--ink)' }}>Cross-border Remittances</h2>
        <p className="mt-0.5 text-xs" style={{ color: 'var(--muted)' }}>Send USDC globally via smart contract</p>
      </div>

      {/* Balance */}
      {address && formattedBalance != null && (
        <div className="rounded-2xl p-4" style={glass.inner}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium" style={{ color: 'var(--muted)' }}>USDC Balance</span>
            <span className="display text-xl font-bold tabular-nums" style={{ color: 'var(--ink)' }}>
              {formattedBalance} USDC
            </span>
          </div>
        </div>
      )}

      <motion.div {...fadeUp} className="rounded-3xl p-5" style={glass.card}>
        <div className="h-1 rounded-full mb-5" style={{ backgroundImage: spectral }} />

        {/* Corridor selector */}
        <div className="mb-4">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
            Destination corridor
          </label>
          <div className="flex flex-wrap gap-2">
            {CORRIDORS.map((c) => (
              <button
                key={c.code}
                onClick={() => setCorridor(c)}
                className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all hover:scale-[1.03] active:scale-[0.97]"
                style={
                  corridor.code === c.code
                    ? { background: 'var(--accent)', color: 'white' }
                    : { ...glass.pill, color: 'var(--muted)' }
                }
              >
                <span className="text-base leading-none" aria-label={c.label}>
                  {countryFlag(c.flag)}
                </span>
                {c.code}
              </button>
            ))}
          </div>
        </div>

        {/* Recipient */}
        <div className="mb-3">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
            Recipient address
          </label>
          <input
            className="mono w-full rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"
            style={glass.inner}
            placeholder="0x..."
            value={recipient} onChange={(e) => setRecipient(e.target.value)}
          />
        </div>

        {/* Amount */}
        <div className="mb-3">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
            Amount (USDC)
          </label>
          <div className="rounded-2xl p-4" style={glass.inner}>
            <input
              inputMode="decimal"
              className="display w-full bg-transparent text-4xl font-bold tabular-nums outline-none placeholder:text-slate-300"
              style={{ color: 'var(--ink)' }}
              placeholder="0.00"
              value={amount}
              onChange={(e) => {
                const v = e.target.value.replace(/[^0-9.]/g, '')
                if (v === '' || /^\d*\.?\d*$/.test(v)) setAmount(v)
              }}
            />
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs font-medium" style={{ color: 'var(--subtle)' }}>USDC</span>
              {formattedBalance && (
                <button
                  onClick={() => setAmount(formattedBalance)}
                  className="text-xs font-semibold"
                  style={{ color: 'var(--accent-hover)' }}
                >
                  Balance: {formattedBalance} · Max
                </button>
              )}
            </div>
          </div>
        </div>

        {/* FX preview */}
        {fxAmount && (
          <motion.div
            className="mb-3 flex items-center gap-2 rounded-xl px-4 py-3"
            style={glass.inner}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <span className="text-lg leading-none">{countryFlag(corridor.flag)}</span>
            <TrendingUp className="size-4 shrink-0" style={{ color: 'var(--success)' }} />
            <span className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>
              ≈ {fxAmount} {corridor.code}
            </span>
            <span className="ml-auto text-xs" style={{ color: 'var(--muted)' }}>
              1 USDC = {corridor.rate} {corridor.code}
            </span>
          </motion.div>
        )}

        {/* Memo */}
        <div className="mb-4">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
            Memo (optional)
          </label>
          <input
            className="w-full rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"
            style={glass.inner}
            placeholder="e.g. School fees Q1"
            value={memo} onChange={(e) => setMemo(e.target.value)}
          />
        </div>

        {sendSuccess && sendHash && (
          <div className="mb-4 flex items-center gap-2 rounded-xl p-3 text-xs" style={glass.inner}>
            <CheckCircle className="size-4 shrink-0" style={{ color: 'var(--success)' }} />
            <a
              href={buildTxExplorerUrl(ARC_CHAIN_ID, sendHash)}
              target="_blank" rel="noopener noreferrer"
              className="truncate hover:underline"
              style={{ color: 'var(--accent-hover)' }}
            >
              View on ArcScan
            </a>
          </div>
        )}

        <button
          disabled={isBusy || !address}
          onClick={handleSend}
          className="w-full rounded-2xl py-3.5 text-sm font-semibold text-white transition-all hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
          style={{ background: 'var(--accent)' }}
        >
          {!address ? 'Connect Wallet'
            : wrongChain ? 'Switch to Arc Mainnet'
            : isBusy
              ? <span className="flex items-center justify-center gap-2"><Loader2 className="size-4 animate-spin" />Sending...</span>
              : `Send ${amount || '0.00'} USDC → ${corridor.code}`}
        </button>
      </motion.div>
    </div>
  )
}

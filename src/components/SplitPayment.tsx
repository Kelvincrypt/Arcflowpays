import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useSwitchChain, useReadContract } from 'wagmi'
import { erc20Abi } from 'viem'
import { toast } from 'sonner'
import { Plus, Trash2, Users, Loader2, CheckCircle } from 'lucide-react'
import { glass, fadeUp } from '../lib/design'
import { USDC_ADDRESS } from '../lib/flowpay'
import { saveHistory } from '../lib/storage'
import { parseAmount, Amount } from '@/onchain-money'
import { buildTxExplorerUrl } from '@/onchain-facts'
import { arcMainnet } from '../config'

const ARC_CHAIN_ID = arcMainnet.id
const USDC_DECIMALS = 6

interface Recipient {
  id: string
  address: string
  amount: string
}

function parseOnchainError(e: unknown): string {
  const msg = (e as { message?: string })?.message?.toLowerCase() ?? ''
  if (msg.includes('user rejected') || msg.includes('user denied')) return 'Transaction cancelled.'
  if (msg.includes('insufficient')) return 'Insufficient USDC balance.'
  if (msg.includes('reverted')) return 'Transaction reverted. Check inputs.'
  return 'Something went wrong. Please try again.'
}

export default function SplitPayment() {
  const { address, chainId } = useAccount()
  const { switchChain } = useSwitchChain()
  const wrongChain = chainId !== ARC_CHAIN_ID

  const [recipients, setRecipients] = useState<Recipient[]>([
    { id: crypto.randomUUID(), address: '', amount: '' },
    { id: crypto.randomUUID(), address: '', amount: '' },
  ])
  const [txHashes, setTxHashes] = useState<string[]>([])

  // USDC balance
  const { data: usdcBalance } = useReadContract({
    address: USDC_ADDRESS,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: ARC_CHAIN_ID,
  })
  const formattedBalance = usdcBalance != null ? Amount.fromRaw(usdcBalance, USDC_DECIMALS).toFixed(2) : null

  const { writeContract: transfer, data: transferHash, isPending, isError, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: transferHash })

  const totalAmount = recipients.reduce((sum, r) => {
    const n = parseFloat(r.amount)
    return sum + (isNaN(n) ? 0 : n)
  }, 0)

  const addRecipient = () =>
    setRecipients((prev) => [...prev, { id: crypto.randomUUID(), address: '', amount: '' }])

  const removeRecipient = (id: string) =>
    setRecipients((prev) => prev.filter((r) => r.id !== id))

  const updateRecipient = (id: string, field: 'address' | 'amount', value: string) => {
    setRecipients((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    )
  }

  const [pendingIndex, setPendingIndex] = useState(0)

  const handleSplitSend = useCallback(() => {
    if (!address) return
    if (wrongChain) { switchChain({ chainId: ARC_CHAIN_ID }); return }

    const valid = recipients.filter((r) => r.address && r.amount)
    if (valid.length === 0) { toast.error('Add at least one recipient.'); return }

    // Send to each recipient sequentially (simple approach — one at a time)
    const toSend = valid[pendingIndex]
    if (!toSend) { toast.success(`All ${valid.length} transfers sent!`); return }

    const parsed = parseAmount(ARC_CHAIN_ID, toSend.amount)
    transfer({
      address: USDC_ADDRESS,
      abi: erc20Abi,
      functionName: 'transfer',
      args: [toSend.address as `0x${string}`, parsed.raw],
      chainId: ARC_CHAIN_ID,
    })
  }, [address, wrongChain, recipients, pendingIndex, switchChain, transfer])

  if (isSuccess && transferHash) {
    const valid = recipients.filter((r) => r.address && r.amount)
    const sent = valid[pendingIndex]
    if (sent) {
      const newHashes = [...txHashes, transferHash]
      setTxHashes(newHashes)
      saveHistory({
        type: 'split',
        label: `Split to ${valid.length} recipients`,
        recipients: valid.map((r) => ({ address: r.address, amount: r.amount })),
        amount: totalAmount.toFixed(2),
        txHash: transferHash,
        status: 'confirmed',
      })
      toast.success(`Sent ${sent.amount} USDC to recipient ${pendingIndex + 1}`)
      if (pendingIndex + 1 < valid.length) {
        setPendingIndex(pendingIndex + 1)
      } else {
        setPendingIndex(0)
        setTxHashes([])
        setRecipients([
          { id: crypto.randomUUID(), address: '', amount: '' },
          { id: crypto.randomUUID(), address: '', amount: '' },
        ])
      }
    }
  }

  if (isError) toast.error(parseOnchainError(error))

  const isBusy = isPending || isConfirming
  const valid = recipients.filter((r) => r.address && r.amount)

  return (
    <div className="space-y-4">
      <div>
        <h2 className="display text-xl font-bold" style={{ color: 'var(--ink)' }}>Split Payment</h2>
        <p className="mt-0.5 text-xs" style={{ color: 'var(--muted)' }}>
          Divide USDC across multiple recipients
        </p>
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

      {/* Total */}
      {totalAmount > 0 && (
        <motion.div
          className="rounded-2xl px-4 py-3"
          style={glass.inner}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium" style={{ color: 'var(--muted)' }}>Total to send</span>
            <span className="display text-lg font-bold tabular-nums" style={{ color: 'var(--accent)' }}>
              {totalAmount.toFixed(2)} USDC
            </span>
          </div>
        </motion.div>
      )}

      {/* Recipients */}
      <div className="space-y-2">
        {recipients.map((r, i) => (
          <motion.div
            key={r.id}
            {...fadeUp}
            transition={{ delay: i * 0.04 }}
            className="rounded-2xl p-4"
            style={glass.card}
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>Recipient {i + 1}</span>
              {recipients.length > 1 && (
                <button onClick={() => removeRecipient(r.id)}>
                  <Trash2 className="size-4" style={{ color: 'var(--danger)' }} />
                </button>
              )}
            </div>
            <div className="space-y-2">
              <input
                className="mono w-full rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                style={glass.inner}
                placeholder="0x address"
                value={r.address}
                onChange={(e) => updateRecipient(r.id, 'address', e.target.value)}
              />
              <input
                inputMode="decimal"
                className="w-full rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                style={glass.inner}
                placeholder="Amount USDC"
                value={r.amount}
                onChange={(e) => {
                  const v = e.target.value.replace(/[^0-9.]/g, '')
                  if (v === '' || /^\d*\.?\d*$/.test(v)) updateRecipient(r.id, 'amount', v)
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      <button
        onClick={addRecipient}
        className="flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold transition-all hover:bg-black/5"
        style={glass.inner}
      >
        <Plus className="size-4" style={{ color: 'var(--muted)' }} />
        <span style={{ color: 'var(--muted)' }}>Add recipient</span>
      </button>

      {txHashes.length > 0 && (
        <div className="space-y-1">
          {txHashes.map((h) => (
            <div key={h} className="flex items-center gap-2 rounded-xl p-3 text-xs" style={glass.inner}>
              <CheckCircle className="size-4 shrink-0" style={{ color: 'var(--success)' }} />
              <a
                href={buildTxExplorerUrl(ARC_CHAIN_ID, h as `0x${string}`)}
                target="_blank" rel="noopener noreferrer"
                className="truncate hover:underline"
                style={{ color: 'var(--accent-hover)' }}
              >
                Tx {txHashes.indexOf(h) + 1} confirmed
              </a>
            </div>
          ))}
        </div>
      )}

      <button
        disabled={isBusy || !address || valid.length === 0}
        onClick={handleSplitSend}
        className="w-full rounded-2xl py-3.5 text-sm font-semibold text-white transition-all hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
        style={{ background: 'var(--accent)' }}
      >
        {!address ? 'Connect Wallet'
          : wrongChain ? 'Switch to Arc Mainnet'
          : isBusy
            ? <span className="flex items-center justify-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                Sending {pendingIndex + 1} of {valid.length}...
              </span>
            : txHashes.length > 0
              ? `Continue — ${pendingIndex + 1} of ${valid.length}`
              : <span className="flex items-center justify-center gap-2">
                  <Users className="size-4" />
                  Send to {valid.length} recipient{valid.length !== 1 ? 's' : ''}
                </span>
        }
      </button>
    </div>
  )
}

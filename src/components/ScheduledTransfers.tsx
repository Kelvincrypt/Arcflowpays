import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useSwitchChain, useReadContract } from 'wagmi'
import { erc20Abi } from 'viem'
import { toast } from 'sonner'
import { Plus, Calendar, Loader2, X, ChevronRight, CheckCircle } from 'lucide-react'
import { glass, spectral, springs, fadeUp, formatAddress, formatDate } from '../lib/design'
import { FLOWPAY_ADDRESS, FLOWPAY_ABI, FREQUENCY, USDC_ADDRESS } from '../lib/flowpay'
import { saveSchedule, loadSchedules, updateScheduleStatus, type ScheduleRecord } from '../lib/storage'
import { saveHistory } from '../lib/storage'
import { parseAmount, Amount } from '@/onchain-money'
import { buildTxExplorerUrl } from '@/onchain-facts'
import { arcMainnet } from '../config'

const ARC_CHAIN_ID = arcMainnet.id
const USDC_DECIMALS = 6

const CATEGORIES = ['Rent', 'Education', 'Subscription', 'Savings', 'Utilities', 'Other']
const FREQUENCIES = [
  { label: 'One-time', value: FREQUENCY.ONCE },
  { label: 'Weekly', value: FREQUENCY.WEEKLY },
  { label: 'Monthly', value: FREQUENCY.MONTHLY },
]

function parseOnchainError(e: unknown): string {
  const msg = (e as { message?: string })?.message?.toLowerCase() ?? ''
  if (msg.includes('user rejected') || msg.includes('user denied')) return 'Transaction cancelled.'
  if (msg.includes('insufficient')) return 'Insufficient USDC balance.'
  if (msg.includes('reverted')) return 'Contract rejected the transaction. Check your inputs.'
  return 'Something went wrong. Please try again.'
}

export default function ScheduledTransfers() {
  const { address, chainId } = useAccount()
  const { switchChain } = useSwitchChain()
  const wrongChain = chainId !== ARC_CHAIN_ID

  const [showForm, setShowForm] = useState(false)
  const [label, setLabel] = useState('')
  const [category, setCategory] = useState('Rent')
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [frequency, setFrequency] = useState<number>(FREQUENCY.MONTHLY)
  const [startDate, setStartDate] = useState('')
  const [pendingId, setPendingId] = useState<string | null>(null)


  const schedules = loadSchedules().filter((s) => s.status === 'active')

  // USDC balance
  const { data: usdcBalance } = useReadContract({
    address: USDC_ADDRESS,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: ARC_CHAIN_ID,
  })
  const formattedBalance = usdcBalance != null
    ? Amount.fromRaw(usdcBalance, USDC_DECIMALS).toFixed(2)
    : null

  // Approve
  const { writeContract: approve, data: approveHash, isPending: approvePending } = useWriteContract()
  const { isLoading: approveConfirming } = useWaitForTransactionReceipt({ hash: approveHash })

  // Create schedule
  const { writeContract: create, data: createHash, isPending: createPending, isError: createError, error: createErr } = useWriteContract()
  const { isLoading: createConfirming, isSuccess: createSuccess } = useWaitForTransactionReceipt({ hash: createHash })

  // Execute schedule
  const { writeContract: execute, data: execHash, isPending: execPending } = useWriteContract()
  const { isLoading: execConfirming, isSuccess: execSuccess } = useWaitForTransactionReceipt({ hash: execHash })

  const handleApproveAndCreate = useCallback(() => {
    if (!address) return
    if (wrongChain) { switchChain({ chainId: ARC_CHAIN_ID }); return }
    if (!label || !recipient || !amount || !startDate) {
      toast.error('Please fill all fields.')
      return
    }
    const parsed = parseAmount(ARC_CHAIN_ID, amount)
    const dateTs = BigInt(Math.floor(new Date(startDate).getTime() / 1000))

    try {
      approve({
        address: USDC_ADDRESS,
        abi: erc20Abi,
        functionName: 'approve',
        args: [FLOWPAY_ADDRESS, parsed.raw],
        chainId: ARC_CHAIN_ID,
      })
    } catch (e) {
      toast.error(parseOnchainError(e))
    }

    // save optimistically
    const rec = saveSchedule({ label, category, recipient, amount, frequency, startDate, status: 'active' })
    setPendingId(rec.id)

    create({
      address: FLOWPAY_ADDRESS,
      abi: FLOWPAY_ABI,
      functionName: 'createSchedule',
      args: [recipient as `0x${string}`, parsed.raw, frequency, dateTs, label, category],
      chainId: ARC_CHAIN_ID,
    })
  }, [address, wrongChain, label, recipient, amount, startDate, frequency, category, switchChain, approve, create])

  if (createSuccess && createHash && pendingId) {
    updateScheduleStatus(pendingId, 'active', createHash)
    saveHistory({ type: 'schedule', label, recipient, amount, txHash: createHash, status: 'confirmed' })
    toast.success('Schedule created!')
    setPendingId(null)
    setShowForm(false)
    setLabel(''); setRecipient(''); setAmount(''); setStartDate('')
  }
  if (createError && pendingId) {
    toast.error(parseOnchainError(createErr))
    updateScheduleStatus(pendingId, 'cancelled')
    setPendingId(null)
  }
  if (execSuccess && execHash) {
    toast.success('Payment executed!')
    saveHistory({ type: 'schedule', label: 'Manual execute', amount: '—', txHash: execHash, status: 'confirmed' })
  }

  const handleExecute = (s: ScheduleRecord) => {
    if (!s.scheduleId) { toast.error('No schedule ID stored.'); return }
    if (wrongChain) { switchChain({ chainId: ARC_CHAIN_ID }); return }
    execute({
      address: FLOWPAY_ADDRESS,
      abi: FLOWPAY_ABI,
      functionName: 'executeSchedule',
      args: [BigInt(s.scheduleId)],
      chainId: ARC_CHAIN_ID,
    })
  }

  const isBusy = approvePending || approveConfirming || createPending || createConfirming

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="display text-xl font-bold" style={{ color: 'var(--ink)' }}>Scheduled Transfers</h2>
          <p className="mt-0.5 text-xs" style={{ color: 'var(--muted)' }}>
            {schedules.length} active schedule{schedules.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: 'var(--accent)' }}
        >
          <Plus className="size-4" /> New
        </button>
      </div>

      {/* Balance badge */}
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

      {/* Active schedules */}
      {schedules.length === 0 ? (
        <motion.div
          {...fadeUp}
          className="rounded-3xl p-8 text-center"
          style={glass.card}
        >
          <Calendar className="mx-auto mb-3 size-10 opacity-30" style={{ color: 'var(--ink)' }} />
          <p className="text-sm font-medium" style={{ color: 'var(--muted)' }}>No active schedules</p>
          <p className="mt-1 text-xs" style={{ color: 'var(--subtle)' }}>Create your first recurring payment above.</p>
        </motion.div>
      ) : (
        <div className="space-y-2">
          {schedules.map((s) => (
            <motion.div
              key={s.id}
              {...fadeUp}
              className="rounded-2xl p-4"
              style={glass.card}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>{s.label}</span>
                    <span
                      className="rounded-full px-2 py-0.5 text-xs font-medium"
                      style={{ background: 'rgba(18,45,69,0.08)', color: 'var(--muted)' }}
                    >
                      {s.category}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs" style={{ color: 'var(--muted)' }}>
                    {formatAddress(s.recipient)} · {s.amount} USDC
                  </p>
                  <p className="text-xs" style={{ color: 'var(--subtle)' }}>
                    {['Once', 'Weekly', 'Monthly'][s.frequency]} · {formatDate(new Date(s.startDate).getTime())}
                  </p>
                </div>
                <button
                  onClick={() => handleExecute(s)}
                  disabled={execPending || execConfirming}
                  className="ml-3 flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
                  style={{ background: 'var(--accent)' }}
                >
                  {execPending || execConfirming
                    ? <Loader2 className="size-3 animate-spin" />
                    : <><ChevronRight className="size-3" />Pay</>
                  }
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create sheet */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowForm(false)}
          >
            <div className="absolute inset-0 bg-black/25 backdrop-blur-sm" />
            <motion.section
              className="relative w-full max-w-md overflow-hidden rounded-t-3xl"
              style={glass.sheet}
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={springs.sheet}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-1 w-full" style={{ backgroundImage: spectral }} />
              <div className="flex justify-between px-5 pt-4 pb-1">
                <div className="h-1 w-10 rounded-full bg-black/10 mx-auto" />
              </div>
              <div className="px-5 pb-8 pt-2">
                <div className="mb-5 flex items-center justify-between">
                  <h3 className="display text-lg font-bold" style={{ color: 'var(--ink)' }}>New Schedule</h3>
                  <button onClick={() => setShowForm(false)}><X className="size-5" style={{ color: 'var(--muted)' }} /></button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Label</label>
                    <input
                      className="w-full rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                      style={glass.inner}
                      placeholder="e.g. Monthly rent"
                      value={label} onChange={(e) => setLabel(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Category</label>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.map((c) => (
                        <button
                          key={c}
                          onClick={() => setCategory(c)}
                          className="rounded-full px-3 py-1.5 text-xs font-medium transition-all"
                          style={{
                            ...(category === c
                              ? { background: 'var(--accent)', color: 'white' }
                              : { ...glass.pill, color: 'var(--muted)' }),
                          }}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Recipient Address</label>
                    <input
                      className="mono w-full rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                      style={glass.inner}
                      placeholder="0x..."
                      value={recipient} onChange={(e) => setRecipient(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Amount (USDC)</label>
                    <input
                      inputMode="decimal"
                      className="display w-full rounded-xl px-4 py-3 text-2xl font-bold tabular-nums outline-none focus:ring-2 focus:ring-blue-200"
                      style={glass.inner}
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => {
                        const v = e.target.value.replace(/[^0-9.]/g, '')
                        if (v === '' || /^\d*\.?\d*$/.test(v)) setAmount(v)
                      }}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Frequency</label>
                    <div className="flex gap-2">
                      {FREQUENCIES.map((f) => (
                        <button
                          key={f.value}
                          onClick={() => setFrequency(f.value)}
                          className="flex-1 rounded-xl py-2.5 text-xs font-semibold transition-all"
                          style={
                            frequency === f.value
                              ? { background: 'var(--accent)', color: 'white' }
                              : { ...glass.pill, color: 'var(--muted)' }
                          }
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Start Date</label>
                    <input
                      type="date"
                      className="w-full rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                      style={glass.inner}
                      value={startDate} onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>

                  {createSuccess && createHash && (
                    <div className="flex items-center gap-2 rounded-xl p-3 text-xs" style={glass.inner}>
                      <CheckCircle className="size-4 shrink-0" style={{ color: 'var(--success)' }} />
                      <a
                        href={buildTxExplorerUrl(ARC_CHAIN_ID, createHash)}
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
                    onClick={handleApproveAndCreate}
                    className="w-full rounded-2xl py-3.5 text-sm font-semibold text-white transition-all hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
                    style={{ background: 'var(--accent)' }}
                  >
                    {!address ? 'Connect Wallet'
                      : wrongChain ? 'Switch to Arc Mainnet'
                      : isBusy ? <span className="flex items-center justify-center gap-2"><Loader2 className="size-4 animate-spin" />{approvePending || approveConfirming ? 'Approving...' : 'Creating schedule...'}</span>
                      : 'Approve & Create Schedule'}
                  </button>
                </div>
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

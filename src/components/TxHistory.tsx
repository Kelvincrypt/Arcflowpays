import { useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, ExternalLink, Globe, Calendar, Users } from 'lucide-react'
import { glass, fadeUp, formatDate, formatTime, formatAddress } from '../lib/design'
import { loadHistory, type HistoryRecord } from '../lib/storage'
import { buildTxExplorerUrl } from '@/onchain-facts'
import { arcMainnet } from '../config'

const ARC_CHAIN_ID = arcMainnet.id

const TYPE_LABELS: Record<HistoryRecord['type'], { label: string; Icon: typeof Clock }> = {
  schedule: { label: 'Schedule', Icon: Calendar },
  remittance: { label: 'Remittance', Icon: Globe },
  split: { label: 'Split', Icon: Users },
}

const STATUS_STYLES: Record<HistoryRecord['status'], { bg: string; text: string; label: string }> = {
  pending: { bg: 'rgba(255,205,131,0.25)', text: '#9a6700', label: 'Pending' },
  confirmed: { bg: 'rgba(26,128,71,0.12)', text: 'var(--success)', label: 'Confirmed' },
  failed: { bg: 'rgba(186,43,76,0.1)', text: 'var(--danger)', label: 'Failed' },
}

const FILTERS: Array<HistoryRecord['type'] | 'all'> = ['all', 'schedule', 'remittance', 'split']

export default function TxHistory() {
  const [filter, setFilter] = useState<HistoryRecord['type'] | 'all'>('all')
  const history = loadHistory()
  const filtered = filter === 'all' ? history : history.filter((h) => h.type === filter)

  return (
    <div className="space-y-4">
      <div>
        <h2 className="display text-xl font-bold" style={{ color: 'var(--ink)' }}>Transaction History</h2>
        <p className="mt-0.5 text-xs" style={{ color: 'var(--muted)' }}>{history.length} total transactions</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="rounded-full px-3 py-1.5 text-xs font-semibold transition-all capitalize"
            style={
              filter === f
                ? { background: 'var(--accent)', color: 'white' }
                : { ...glass.pill, color: 'var(--muted)' }
            }
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <motion.div {...fadeUp} className="rounded-3xl p-10 text-center" style={glass.card}>
          <Clock className="mx-auto mb-3 size-10 opacity-30" style={{ color: 'var(--ink)' }} />
          <p className="text-sm font-medium" style={{ color: 'var(--muted)' }}>No transactions yet</p>
          <p className="mt-1 text-xs" style={{ color: 'var(--subtle)' }}>
            Scheduled transfers, remittances, and splits appear here.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-2">
          {filtered.map((h, i) => {
            const { Icon } = TYPE_LABELS[h.type] ?? { Icon: Clock }
            const status = STATUS_STYLES[h.status]
            return (
              <motion.div
                key={h.id}
                {...fadeUp}
                transition={{ delay: i * 0.04, duration: 0.24 }}
                className="rounded-2xl p-4"
                style={glass.card}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="flex size-9 shrink-0 items-center justify-center rounded-xl"
                    style={{ background: 'rgba(18,45,69,0.08)' }}
                  >
                    <Icon className="size-4" style={{ color: 'var(--accent)' }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-semibold" style={{ color: 'var(--ink)' }}>
                        {h.label}
                      </span>
                      <span
                        className="shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold"
                        style={{ background: status.bg, color: status.text }}
                      >
                        {status.label}
                      </span>
                    </div>

                    <div className="mt-0.5 flex items-center gap-2 text-xs" style={{ color: 'var(--muted)' }}>
                      {h.recipient && (
                        <span className="mono">{formatAddress(h.recipient)}</span>
                      )}
                      {h.corridorCode && (
                        <span className="flex items-center gap-1">
                          <Globe className="size-3" /> {h.corridorCode}
                        </span>
                      )}
                      <span className="ml-auto tabular-nums font-semibold" style={{ color: 'var(--ink)' }}>
                        {h.amount} USDC
                      </span>
                    </div>

                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-xs" style={{ color: 'var(--subtle)' }}>
                        {formatDate(h.createdAt)} · {formatTime(h.createdAt)}
                      </span>
                      {h.txHash && (
                        <a
                          href={buildTxExplorerUrl(ARC_CHAIN_ID, h.txHash)}
                          target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs hover:underline"
                          style={{ color: 'var(--accent-hover)' }}
                        >
                          ArcScan <ExternalLink className="size-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useAccount } from 'wagmi'
import { toast } from 'sonner'
import { QrCode, Copy, Download, Wallet } from 'lucide-react'
import { glass, fadeUp, formatAddress } from '../lib/design'
import { buildShareLink } from '../lib/share'

// Lightweight QR code using qrserver.com (no extra package needed)
function QRImage({ data, size = 220 }: { data: string; size?: number }) {
  const encoded = encodeURIComponent(data)
  return (
    <img
      src={`https://api.qrserver.com/v1/create-qr-code/?data=${encoded}&size=${size}x${size}&margin=16&color=122d45&bgcolor=ffffff`}
      alt="QR code"
      width={size}
      height={size}
      className="rounded-xl"
      style={{ imageRendering: 'pixelated' }}
    />
  )
}

export default function QRPayment() {
  const { address } = useAccount()
  const [amount, setAmount] = useState('')
  const [label, setLabel] = useState('')
  const [qrValue, setQrValue] = useState('')
  const shareLinkRef = useRef('')

  // Build the shareable link and QR value whenever inputs change
  useEffect(() => {
    if (!address) {
      shareLinkRef.current = ''
      return
    }
    const params = new URLSearchParams()
    params.set('to', address)
    if (amount) params.set('amount', amount)
    if (label) params.set('label', label)
    const path = `/?${params.toString()}`
    void buildShareLink(path).then((url) => {
      setQrValue(url)
      shareLinkRef.current = url
    })
  }, [address, amount, label])

  const handleCopy = () => {
    const link = shareLinkRef.current
    if (!link) return
    void navigator.clipboard.writeText(link).then(() => toast.success('Payment link copied!'))
  }

  const handleCopyAddress = () => {
    if (!address) return
    void navigator.clipboard.writeText(address).then(() => toast.success('Address copied!'))
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="display text-xl font-bold" style={{ color: 'var(--ink)' }}>QR Payment</h2>
        <p className="mt-0.5 text-xs" style={{ color: 'var(--muted)' }}>
          Generate a code to receive USDC
        </p>
      </div>

      {!address ? (
        <motion.div {...fadeUp} className="rounded-3xl p-10 text-center" style={glass.card}>
          <Wallet className="mx-auto mb-3 size-10 opacity-30" style={{ color: 'var(--ink)' }} />
          <p className="text-sm font-medium" style={{ color: 'var(--muted)' }}>Connect wallet to generate QR</p>
        </motion.div>
      ) : (
        <motion.div {...fadeUp} className="rounded-3xl p-5" style={glass.card}>
          {/* QR display */}
          <div className="mb-5 flex justify-center">
            <div className="rounded-2xl p-3 shadow-inner" style={{ background: '#fff' }}>
              {qrValue ? (
                <QRImage data={qrValue} size={200} />
              ) : (
                <div className="flex size-[200px] items-center justify-center rounded-xl bg-gray-50">
                  <QrCode className="size-12 opacity-20" style={{ color: 'var(--ink)' }} />
                </div>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="mb-4 flex items-center justify-between rounded-2xl px-4 py-3" style={glass.inner}>
            <div>
              <p className="text-xs font-medium" style={{ color: 'var(--muted)' }}>Your address</p>
              <p className="mono text-sm font-semibold" style={{ color: 'var(--ink)' }}>{formatAddress(address)}</p>
            </div>
            <button onClick={handleCopyAddress} className="rounded-lg p-1.5 transition-colors hover:bg-black/5">
              <Copy className="size-4" style={{ color: 'var(--muted)' }} />
            </button>
          </div>

          {/* Optional amount */}
          <div className="mb-3">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
              Amount (optional)
            </label>
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

          {/* Label */}
          <div className="mb-4">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
              Label (optional)
            </label>
            <input
              className="w-full rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              style={glass.inner}
              placeholder="e.g. Coffee"
              value={label} onChange={(e) => setLabel(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold text-white transition-all hover:scale-[1.01] active:scale-[0.99]"
              style={{ background: 'var(--accent)' }}
            >
              <Copy className="size-4" /> Copy link
            </button>
            <a
              href={qrValue ? `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrValue)}&size=400x400&margin=16` : '#'}
              download="flowpay-qr.png"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-semibold transition-all hover:scale-[1.01] active:scale-[0.99]"
              style={glass.pill}
            >
              <Download className="size-4" style={{ color: 'var(--muted)' }} />
            </a>
          </div>
        </motion.div>
      )}
    </div>
  )
}

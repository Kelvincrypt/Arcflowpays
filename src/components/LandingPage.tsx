import { motion } from 'framer-motion'
import {
  ArrowRight, Calendar, Globe, Clock, Users, QrCode, Wallet, Shield,
  Zap, Check, X, ChevronRight,
} from 'lucide-react'
import PrivyConnectButton from './PrivyConnectButton'
import { glass, spectral, fadeUp } from '../lib/design'

const features = [
  {
    icon: Calendar,
    title: 'Scheduled Transfers',
    desc: 'Set up recurring payments for rent, school fees, or subscriptions. Never miss a payment.',
  },
  {
    icon: Globe,
    title: 'Cross-border Remittances',
    desc: 'Send USDC globally with live FX previews. NGN, GHS, KES, PHP, MXN, INR corridors.',
  },
  {
    icon: Clock,
    title: 'Transaction History',
    desc: 'Full audit trail of every transfer, schedule, and remittance in one place.',
  },
  {
    icon: Users,
    title: 'Split Payments',
    desc: 'Divide a USDC amount across multiple recipients with one transaction.',
  },
  {
    icon: QrCode,
    title: 'QR Payment',
    desc: 'Generate a scannable QR code from your wallet address to receive USDC instantly.',
  },
  {
    icon: Wallet,
    title: 'Contacts',
    desc: 'Save wallet addresses with nicknames for quick, error-free sending.',
  },
]

const comparisonRows = [
  { feature: 'Stable fees (no ETH gas)', flowpay: true, bank: false, crypto: false },
  { feature: 'Recurring USDC schedules', flowpay: true, bank: true, crypto: false },
  { feature: 'Cross-border via smart contract', flowpay: true, bank: false, crypto: true },
  { feature: 'Sub-second finality', flowpay: true, bank: false, crypto: false },
  { feature: 'No KYC for sending', flowpay: true, bank: false, crypto: true },
  { feature: 'Fully self-custodial', flowpay: true, bank: false, crypto: true },
]

const steps = [
  { n: '01', title: 'Connect your wallet', desc: 'Link any Web3 wallet. FlowPay runs on Arc Mainnet where USDC is the gas token.' },
  { n: '02', title: 'Approve USDC', desc: 'Grant the FlowPay contract permission to move USDC on your behalf.' },
  { n: '03', title: 'Schedule or send', desc: 'Create a recurring schedule or fire off a remittance. The contract handles execution.' },
]

interface Props {
  onEnter: () => void
}

export default function LandingPage({ onEnter }: Props) {
  return (
    <div
      className="min-h-dvh overflow-x-hidden"
      style={{ background: 'linear-gradient(160deg, #eef4ff 0%, #fdf9f5 50%, #f0ebff 100%)' }}
    >
      {/* Blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          style={{
            position: 'absolute', top: '5%', left: '-5%', width: 400, height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(95,190,255,0.18) 0%, transparent 70%)',
            filter: 'blur(70px)',
          }}
        />
        <div
          style={{
            position: 'absolute', bottom: '10%', right: '-5%', width: 360, height: 360,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(175,143,244,0.16) 0%, transparent 70%)',
            filter: 'blur(65px)',
          }}
        />
      </div>

      {/* Nav */}
      <nav className="relative z-10 mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl" style={{ background: 'var(--accent)' }}>
            <Zap className="size-4 text-white" />
          </div>
          <span className="display text-xl font-bold" style={{ color: 'var(--ink)' }}>FlowPay</span>
        </div>
        <PrivyConnectButton />
      </nav>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 pb-16 pt-16 text-center">
        <motion.div {...fadeUp}>
          <div
            className="mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold"
            style={glass.pill}
          >
            <div className="size-1.5 rounded-full bg-green-500" />
            <span style={{ color: 'var(--muted)' }}>Live on Arc Mainnet</span>
          </div>

          <h1
            className="display mb-5 text-5xl font-bold leading-tight md:text-6xl"
            style={{ color: 'var(--ink)', letterSpacing: '-0.03em' }}
          >
            USDC payments,
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(135deg, #1061a6, #af8ff4)' }}
            >
              finally frictionless.
            </span>
          </h1>
          <p
            className="mx-auto mb-10 max-w-lg text-lg leading-relaxed"
            style={{ color: 'var(--muted)' }}
          >
            Schedule recurring transfers, send cross-border remittances, split bills, and
            more — all powered by a smart contract on Arc where USDC is the gas token.
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={onEnter}
              className="flex items-center gap-2 rounded-2xl px-8 py-3.5 text-sm font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: 'var(--accent)' }}
            >
              Launch app <ArrowRight className="size-4" />
            </button>
            <a
              href="https://explorer.arc.io/address/0x2c9d68b37654e097150abd78cdc3e4460ea7bc03"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-2xl px-8 py-3.5 text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={glass.pill}
            >
              <span style={{ color: 'var(--ink)' }}>View contract</span>
              <ChevronRight className="size-4" style={{ color: 'var(--muted)' }} />
            </a>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          className="mt-14 grid grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
        >
          {[
            { label: 'Avg. fee', value: '< $0.01' },
            { label: 'Finality', value: '< 1 sec' },
            { label: 'Gas token', value: 'USDC' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl p-4 text-center" style={glass.card}>
              <div className="display text-2xl font-bold" style={{ color: 'var(--ink)' }}>
                {stat.value}
              </div>
              <div className="mt-1 text-xs font-medium" style={{ color: 'var(--muted)' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features grid */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 pb-20">
        <motion.h2
          className="display mb-8 text-center text-3xl font-bold"
          style={{ color: 'var(--ink)' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Everything you need
        </motion.h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="rounded-2xl p-5"
              style={glass.card}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.28 }}
            >
              <div
                className="mb-3 flex size-10 items-center justify-center rounded-xl"
                style={{ background: 'rgba(18,45,69,0.08)' }}
              >
                <f.icon className="size-5" style={{ color: 'var(--accent)' }} />
              </div>
              <h3 className="mb-1.5 text-sm font-semibold" style={{ color: 'var(--ink)' }}>
                {f.title}
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 pb-20">
        <motion.h2
          className="display mb-10 text-center text-3xl font-bold"
          style={{ color: 'var(--ink)' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          How it works
        </motion.h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              className="relative rounded-3xl p-6"
              style={glass.card}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.28 }}
            >
              <div className="mb-1 h-1 w-12 rounded-full" style={{ backgroundImage: spectral }} />
              <div className="display mb-3 text-3xl font-bold" style={{ color: 'rgba(18,45,69,0.12)' }}>
                {s.n}
              </div>
              <h3 className="mb-2 text-sm font-semibold" style={{ color: 'var(--ink)' }}>
                {s.title}
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Comparison table */}
      <section className="relative z-10 mx-auto max-w-3xl px-6 pb-24">
        <motion.h2
          className="display mb-8 text-center text-3xl font-bold"
          style={{ color: 'var(--ink)' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          FlowPay vs. alternatives
        </motion.h2>
        <motion.div
          className="overflow-hidden rounded-3xl"
          style={glass.card}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* header */}
          <div className="grid grid-cols-4 border-b px-5 py-4" style={{ borderColor: 'var(--border)' }}>
            <div className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>Feature</div>
            {['FlowPay', 'Bank wire', 'Crypto'].map((h) => (
              <div key={h} className="text-center text-xs font-semibold" style={{ color: h === 'FlowPay' ? 'var(--accent)' : 'var(--muted)' }}>
                {h}
              </div>
            ))}
          </div>
          {comparisonRows.map((row, i) => (
            <div
              key={row.feature}
              className="grid grid-cols-4 items-center px-5 py-3.5"
              style={{ borderBottom: i < comparisonRows.length - 1 ? '1px solid var(--border)' : 'none' }}
            >
              <span className="text-xs" style={{ color: 'var(--ink-2)' }}>{row.feature}</span>
              {[row.flowpay, row.bank, row.crypto].map((val, j) => (
                <div key={j} className="flex justify-center">
                  {val ? (
                    <Check className="size-4" style={{ color: 'var(--success)' }} />
                  ) : (
                    <X className="size-4" style={{ color: 'var(--danger)' }} />
                  )}
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 pb-20 text-center">
        <motion.div
          className="rounded-3xl p-10"
          style={{ ...glass.card, backgroundImage: 'linear-gradient(135deg, rgba(95,190,255,0.08), rgba(175,143,244,0.08))' }}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="mb-2 flex justify-center">
            <Shield className="size-8" style={{ color: 'var(--accent)' }} />
          </div>
          <h2 className="display mb-3 text-3xl font-bold" style={{ color: 'var(--ink)' }}>
            Ready to flow?
          </h2>
          <p className="mb-7 text-sm" style={{ color: 'var(--muted)' }}>
            Connect your wallet and start sending USDC in seconds.
          </p>
          <button
            onClick={onEnter}
            className="inline-flex items-center gap-2 rounded-2xl px-8 py-3.5 text-sm font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: 'var(--accent)' }}
          >
            Open FlowPay <ArrowRight className="size-4" />
          </button>
        </motion.div>
      </section>
    </div>
  )
}

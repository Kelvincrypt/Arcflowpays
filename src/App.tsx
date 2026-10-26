import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Globe, Clock, Users, QrCode, BookUser, UserCircle, Zap } from 'lucide-react'
import { useAccount } from 'wagmi'
import PrivyConnectButton from './components/PrivyConnectButton'

import LandingPage from './components/LandingPage'
import ScheduledTransfers from './components/ScheduledTransfers'
import Remittances from './components/Remittances'
import TxHistory from './components/TxHistory'
import Contacts from './components/Contacts'
import QRPayment from './components/QRPayment'
import SplitPayment from './components/SplitPayment'
import Profile from './components/Profile'
import { springs } from './lib/design'

const TABS = [
  { id: 'schedule', label: 'Schedule', Icon: Calendar },
  { id: 'remit', label: 'Remit', Icon: Globe },
  { id: 'history', label: 'History', Icon: Clock },
  { id: 'contacts', label: 'Contacts', Icon: BookUser },
  { id: 'qr', label: 'QR', Icon: QrCode },
  { id: 'split', label: 'Split', Icon: Users },
  { id: 'profile', label: 'Profile', Icon: UserCircle },
] as const

type TabId = typeof TABS[number]['id']

const spectral = 'linear-gradient(90deg, #5fbeff, #af8ff4, #f05c6b, #ffcd83, #7ef1b3)'

export default function App() {
  const { isConnected } = useAccount()
  const [landed, setLanded] = useState(false)
  const [activeTab, setActiveTab] = useState<TabId>('schedule')
  const [darkMode, setDarkMode] = useState(false)

  // If user hasn't gone past the landing page, show it
  if (!landed) {
    return <LandingPage onEnter={() => setLanded(true)} />
  }

  return (
    <div
      className="relative min-h-dvh overflow-hidden"
      style={{
        background: darkMode
          ? 'linear-gradient(160deg, #0d1b2f 0%, #0d1b2f 58%, #122d45 100%)'
          : 'linear-gradient(160deg, #f0f4ff 0%, #fdf9f5 50%, #f5f0fb 100%)',
      }}
    >
      {/* Ambient blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          style={{
            position: 'absolute', top: '5%', left: '-5%', width: 340, height: 340,
            borderRadius: '50%',
            background: darkMode
              ? 'radial-gradient(circle, rgba(95,190,255,0.08) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(95,190,255,0.18) 0%, transparent 70%)',
            filter: 'blur(70px)',
          }}
        />
        <div
          style={{
            position: 'absolute', bottom: '10%', right: '-5%', width: 320, height: 320,
            borderRadius: '50%',
            background: darkMode
              ? 'radial-gradient(circle, rgba(175,143,244,0.08) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(175,143,244,0.16) 0%, transparent 70%)',
            filter: 'blur(65px)',
          }}
        />
      </div>

      {/* Top nav */}
      <header
        className="relative z-20 mx-auto flex max-w-md items-center justify-between px-4 py-4"
        style={{
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.2)',
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="flex size-8 items-center justify-center rounded-lg"
            style={{ background: darkMode ? 'rgba(172,198,233,0.2)' : 'var(--accent)' }}
          >
            <Zap className="size-4" style={{ color: darkMode ? '#acc6e9' : 'white' }} />
          </div>
          <span
            className="display text-lg font-bold"
            style={{ color: darkMode ? '#f9faf3' : 'var(--ink)' }}
          >
            FlowPay
          </span>
        </div>
        <PrivyConnectButton />
      </header>

      {/* Page content */}
      <main className="relative z-10 mx-auto max-w-md px-4 pb-28 pt-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={springs.gentle}
          >
            {activeTab === 'schedule' && <ScheduledTransfers />}
            {activeTab === 'remit' && <Remittances />}
            {activeTab === 'history' && <TxHistory />}
            {activeTab === 'contacts' && <Contacts />}
            {activeTab === 'qr' && <QRPayment />}
            {activeTab === 'split' && <SplitPayment />}
            {activeTab === 'profile' && (
              <Profile darkMode={darkMode} onToggleDark={() => setDarkMode((d) => !d)} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom tab bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-30 flex justify-center px-2 pb-safe"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div
          className="mx-auto mb-3 flex w-full max-w-md items-center justify-around rounded-2xl px-1 py-2"
          style={{
            background: darkMode ? 'rgba(13,27,47,0.88)' : 'rgba(255,255,255,0.88)',
            backdropFilter: 'blur(30px) saturate(200%)',
            WebkitBackdropFilter: 'blur(30px) saturate(200%)',
            border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.7)',
            boxShadow: '0 -4px 24px rgba(18,45,69,0.1)',
          }}
        >
          {TABS.map(({ id, label, Icon }) => {
            const active = activeTab === id
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className="relative flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl py-2 transition-all"
                style={{ minHeight: 52 }}
              >
                {active && (
                  <motion.div
                    layoutId="tab-bg"
                    className="absolute inset-0 rounded-xl"
                    style={{ background: darkMode ? 'rgba(172,198,233,0.15)' : 'rgba(18,45,69,0.08)' }}
                    transition={springs.snappy}
                  />
                )}
                {/* Spectral dot for active */}
                {active && (
                  <div
                    className="absolute -top-0.5 h-0.5 w-6 rounded-full"
                    style={{ backgroundImage: spectral }}
                  />
                )}
                <Icon
                  className="relative size-5"
                  style={{ color: active
                    ? darkMode ? '#acc6e9' : 'var(--accent)'
                    : darkMode ? 'rgba(249,250,243,0.4)' : 'var(--subtle)'
                  }}
                />
                <span
                  className="relative text-[10px] font-semibold leading-none"
                  style={{ color: active
                    ? darkMode ? '#acc6e9' : 'var(--accent)'
                    : darkMode ? 'rgba(249,250,243,0.4)' : 'var(--subtle)'
                  }}
                >
                  {label}
                </span>
              </button>
            )
          })}
        </div>
      </nav>

      {/* Connection nudge if not connected */}
      {!isConnected && activeTab !== 'profile' && (
        <div
          className="fixed bottom-24 left-1/2 z-40 -translate-x-1/2 rounded-2xl px-5 py-3 text-center text-sm font-medium shadow-lg"
          style={{
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.7)',
            color: 'var(--muted)',
          }}
        >
          Connect your wallet to transact
        </div>
      )}
    </div>
  )
}

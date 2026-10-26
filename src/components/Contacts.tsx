import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { UserPlus, Trash2, Copy, X, Users } from 'lucide-react'
import { glass, spectral, springs, fadeUp, formatAddress } from '../lib/design'
import { loadContacts, saveContact, deleteContact, type Contact } from '../lib/storage'

export default function Contacts({ onSelectContact }: { onSelectContact?: (addr: string) => void }) {
  const [contacts, setContacts] = useState<Contact[]>(loadContacts)
  const [showForm, setShowForm] = useState(false)
  const [nickname, setNickname] = useState('')
  const [address, setAddress] = useState('')

  const refresh = () => setContacts(loadContacts())

  const handleAdd = () => {
    if (!nickname.trim() || !address.trim()) {
      toast.error('Nickname and address are required.')
      return
    }
    if (!/^0x[0-9a-fA-F]{40}$/.test(address.trim())) {
      toast.error('Enter a valid Ethereum address.')
      return
    }
    saveContact({ nickname: nickname.trim(), address: address.trim() })
    toast.success(`${nickname} saved.`)
    setNickname('')
    setAddress('')
    setShowForm(false)
    refresh()
  }

  const handleDelete = (id: string, name: string) => {
    deleteContact(id)
    toast.success(`${name} removed.`)
    refresh()
  }

  const handleCopy = (addr: string) => {
    void navigator.clipboard.writeText(addr).then(() => toast.success('Address copied.'))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="display text-xl font-bold" style={{ color: 'var(--ink)' }}>Contacts</h2>
          <p className="mt-0.5 text-xs" style={{ color: 'var(--muted)' }}>{contacts.length} saved</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: 'var(--accent)' }}
        >
          <UserPlus className="size-4" /> Add
        </button>
      </div>

      {contacts.length === 0 ? (
        <motion.div {...fadeUp} className="rounded-3xl p-10 text-center" style={glass.card}>
          <Users className="mx-auto mb-3 size-10 opacity-30" style={{ color: 'var(--ink)' }} />
          <p className="text-sm font-medium" style={{ color: 'var(--muted)' }}>No contacts yet</p>
          <p className="mt-1 text-xs" style={{ color: 'var(--subtle)' }}>
            Save wallet addresses with nicknames for quick sending.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-2">
          {contacts.map((c, i) => (
            <motion.div
              key={c.id}
              {...fadeUp}
              transition={{ delay: i * 0.04 }}
              className="flex items-center gap-3 rounded-2xl p-4"
              style={glass.card}
            >
              {/* Avatar */}
              <div
                className="flex size-10 shrink-0 items-center justify-center rounded-2xl text-sm font-bold text-white"
                style={{ background: `hsl(${(c.nickname.charCodeAt(0) * 37) % 360}deg 50% 45%)` }}
              >
                {c.nickname[0].toUpperCase()}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold" style={{ color: 'var(--ink)' }}>{c.nickname}</p>
                <p className="mono truncate text-xs" style={{ color: 'var(--muted)' }}>{formatAddress(c.address)}</p>
              </div>

              <div className="flex items-center gap-1.5">
                {onSelectContact && (
                  <button
                    onClick={() => onSelectContact(c.address)}
                    className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white"
                    style={{ background: 'var(--accent)' }}
                  >
                    Use
                  </button>
                )}
                <button
                  onClick={() => handleCopy(c.address)}
                  className="rounded-lg p-1.5 transition-colors hover:bg-black/5"
                >
                  <Copy className="size-4" style={{ color: 'var(--muted)' }} />
                </button>
                <button
                  onClick={() => handleDelete(c.id, c.nickname)}
                  className="rounded-lg p-1.5 transition-colors hover:bg-red-50"
                >
                  <Trash2 className="size-4" style={{ color: 'var(--danger)' }} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add contact sheet */}
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
              <div className="px-5 pb-8 pt-5">
                <div className="mb-5 flex items-center justify-between">
                  <h3 className="display text-lg font-bold" style={{ color: 'var(--ink)' }}>Add Contact</h3>
                  <button onClick={() => setShowForm(false)}><X className="size-5" style={{ color: 'var(--muted)' }} /></button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Nickname</label>
                    <input
                      className="w-full rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                      style={glass.inner}
                      placeholder="e.g. Mom"
                      value={nickname} onChange={(e) => setNickname(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Wallet address</label>
                    <input
                      className="mono w-full rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                      style={glass.inner}
                      placeholder="0x..."
                      value={address} onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={handleAdd}
                    className="w-full rounded-2xl py-3.5 text-sm font-semibold text-white transition-all hover:scale-[1.01] active:scale-[0.99]"
                    style={{ background: 'var(--accent)' }}
                  >
                    Save Contact
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

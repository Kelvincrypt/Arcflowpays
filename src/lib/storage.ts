/**
 * Local storage hooks for FlowPay
 */

export interface Contact {
  id: string
  nickname: string
  address: string
  createdAt: number
}

export interface ScheduleRecord {
  id: string
  label: string
  category: string
  recipient: string
  amount: string
  frequency: number
  startDate: string
  txHash?: string
  scheduleId?: string
  createdAt: number
  status: 'active' | 'cancelled' | 'executed'
}

export interface HistoryRecord {
  id: string
  type: 'schedule' | 'remittance' | 'split'
  label: string
  recipient?: string
  recipients?: { address: string; amount: string }[]
  amount: string
  corridorCode?: string
  memo?: string
  txHash?: string
  createdAt: number
  status: 'pending' | 'confirmed' | 'failed'
}

const KEYS = {
  contacts: 'flowpay:contacts',
  schedules: 'flowpay:schedules',
  history: 'flowpay:history',
} as const

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function save<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // storage full or unavailable — silently skip
  }
}

// ─── Contacts ────────────────────────────────────────────────────────────────

export function loadContacts(): Contact[] {
  return load<Contact[]>(KEYS.contacts, [])
}

export function saveContact(contact: Omit<Contact, 'id' | 'createdAt'>): Contact {
  const contacts = loadContacts()
  const record: Contact = { ...contact, id: crypto.randomUUID(), createdAt: Date.now() }
  save(KEYS.contacts, [...contacts, record])
  return record
}

export function deleteContact(id: string): void {
  save(KEYS.contacts, loadContacts().filter((c) => c.id !== id))
}

// ─── Schedules ───────────────────────────────────────────────────────────────

export function loadSchedules(): ScheduleRecord[] {
  return load<ScheduleRecord[]>(KEYS.schedules, [])
}

export function saveSchedule(s: Omit<ScheduleRecord, 'id' | 'createdAt'>): ScheduleRecord {
  const all = loadSchedules()
  const record: ScheduleRecord = { ...s, id: crypto.randomUUID(), createdAt: Date.now() }
  save(KEYS.schedules, [...all, record])
  return record
}

export function updateScheduleStatus(id: string, status: ScheduleRecord['status'], txHash?: string): void {
  save(
    KEYS.schedules,
    loadSchedules().map((s) => (s.id === id ? { ...s, status, ...(txHash ? { txHash } : {}) } : s)),
  )
}

// ─── History ─────────────────────────────────────────────────────────────────

export function loadHistory(): HistoryRecord[] {
  return load<HistoryRecord[]>(KEYS.history, [])
}

export function saveHistory(h: Omit<HistoryRecord, 'id' | 'createdAt'>): HistoryRecord {
  const all = loadHistory()
  const record: HistoryRecord = { ...h, id: crypto.randomUUID(), createdAt: Date.now() }
  save(KEYS.history, [record, ...all])
  return record
}

export function updateHistoryStatus(id: string, status: HistoryRecord['status'], txHash?: string): void {
  save(
    KEYS.history,
    loadHistory().map((h) => (h.id === id ? { ...h, status, ...(txHash ? { txHash } : {}) } : h)),
  )
}

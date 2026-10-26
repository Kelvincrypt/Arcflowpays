/**
 * FlowPay contract ABI and constants
 * Deployed on Arc Mainnet (chain 5042) — also referenced on Arc Testnet for dev
 */

export const FLOWPAY_ADDRESS = '0x2c9d68b37654e097150abd78cdc3e4460ea7bc03' as const

export const FLOWPAY_ABI = [
  // createSchedule(address recipient, uint256 amount, uint8 frequency, uint256 startDate, string calldata label, string calldata category)
  {
    type: 'function',
    name: 'createSchedule',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' },
      { name: 'frequency', type: 'uint8' },
      { name: 'startDate', type: 'uint256' },
      { name: 'label', type: 'string' },
      { name: 'category', type: 'string' },
    ],
    outputs: [{ name: 'scheduleId', type: 'uint256' }],
  },
  // executeSchedule(uint256 scheduleId)
  {
    type: 'function',
    name: 'executeSchedule',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'scheduleId', type: 'uint256' }],
    outputs: [],
  },
  // cancelSchedule(uint256 scheduleId)
  {
    type: 'function',
    name: 'cancelSchedule',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'scheduleId', type: 'uint256' }],
    outputs: [],
  },
  // sendRemittance(address recipient, uint256 amount, string calldata corridorCode, string calldata memo)
  {
    type: 'function',
    name: 'sendRemittance',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' },
      { name: 'corridorCode', type: 'string' },
      { name: 'memo', type: 'string' },
    ],
    outputs: [],
  },
  // getSchedule(uint256 scheduleId)
  {
    type: 'function',
    name: 'getSchedule',
    stateMutability: 'view',
    inputs: [{ name: 'scheduleId', type: 'uint256' }],
    outputs: [
      { name: 'owner', type: 'address' },
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' },
      { name: 'frequency', type: 'uint8' },
      { name: 'startDate', type: 'uint256' },
      { name: 'nextExecution', type: 'uint256' },
      { name: 'label', type: 'string' },
      { name: 'category', type: 'string' },
      { name: 'active', type: 'bool' },
    ],
  },
  // scheduleCount(address owner)
  {
    type: 'function',
    name: 'scheduleCount',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  // Events
  {
    type: 'event',
    name: 'ScheduleCreated',
    inputs: [
      { name: 'scheduleId', type: 'uint256', indexed: true },
      { name: 'owner', type: 'address', indexed: true },
      { name: 'recipient', type: 'address', indexed: false },
      { name: 'amount', type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'ScheduleExecuted',
    inputs: [
      { name: 'scheduleId', type: 'uint256', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'ScheduleCancelled',
    inputs: [{ name: 'scheduleId', type: 'uint256', indexed: true }],
  },
  {
    type: 'event',
    name: 'RemittanceSent',
    inputs: [
      { name: 'sender', type: 'address', indexed: true },
      { name: 'recipient', type: 'address', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false },
      { name: 'corridorCode', type: 'string', indexed: false },
    ],
  },
] as const

// Frequency enum values matching contract
export const FREQUENCY = {
  ONCE: 0,
  WEEKLY: 1,
  MONTHLY: 2,
} as const

export type FrequencyKey = keyof typeof FREQUENCY

export const FREQUENCY_LABELS: Record<number, string> = {
  [FREQUENCY.ONCE]: 'One-time',
  [FREQUENCY.WEEKLY]: 'Weekly',
  [FREQUENCY.MONTHLY]: 'Monthly',
}

export interface Corridor {
  code: string
  label: string
  flag: string
  rate: number
}

// Corridor codes for remittance
export const CORRIDORS: Corridor[] = [
  { code: 'NGN', label: 'Nigerian Naira', flag: 'NG', rate: 1620 },
  { code: 'GHS', label: 'Ghanaian Cedi', flag: 'GH', rate: 15.8 },
  { code: 'KES', label: 'Kenyan Shilling', flag: 'KE', rate: 129 },
  { code: 'PHP', label: 'Philippine Peso', flag: 'PH', rate: 57.5 },
  { code: 'MXN', label: 'Mexican Peso', flag: 'MX', rate: 17.1 },
  { code: 'INR', label: 'Indian Rupee', flag: 'IN', rate: 84 },
]

// USDC ERC-20 address on Arc (mainnet and testnet same address)
export const USDC_ADDRESS = '0x3600000000000000000000000000000000000000' as const

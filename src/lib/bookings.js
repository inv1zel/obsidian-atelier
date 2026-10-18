// Записи хранятся только в браузере посетителя (localStorage).
// Никаких контактных данных не собирается и никуда не отправляется.
import { useEffect, useState } from 'react'

const KEY = 'obsidian.bookings.v1'
const EVENT = 'obsidian:bookings'

const read = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? []
  } catch {
    return []
  }
}

const write = (list) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(list))
  } catch {
    /* приватный режим — запись живёт до перезагрузки */
  }
  memory = list
  window.dispatchEvent(new Event(EVENT))
}

let memory = null
export const getBookings = () => memory ?? (memory = read())

export const useBookings = () => {
  const [list, setList] = useState(getBookings)
  useEffect(() => {
    const sync = () => setList([...getBookings()])
    window.addEventListener(EVENT, sync)
    return () => window.removeEventListener(EVENT, sync)
  }, [])
  return list
}

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const makeCode = () => {
  let s = ''
  for (let i = 0; i < 4; i++) s += ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
  return `OBS-${s}`
}

export const addBooking = (data) => {
  const list = getBookings()
  let code = makeCode()
  while (list.some((b) => b.code === code)) code = makeCode()
  const booking = { ...data, code, status: 'active', createdAt: Date.now() }
  write([booking, ...list])
  return booking
}

export const updateBooking = (code, patch) =>
  write(getBookings().map((b) => (b.code === code ? { ...b, ...patch } : b)))

export const removeBooking = (code) => write(getBookings().filter((b) => b.code !== code))

// ——— Расписание ———
export const TIMES = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00']

export const toISO = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export const fromISO = (s) => {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}

// детерминированная «занятость» — чтобы календарь выглядел живым
const hash = (str) => {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619)
  return (h >>> 0) / 4294967295
}

export const slotState = (iso, time, ignoreCode) => {
  const now = new Date()
  const [hh] = time.split(':').map(Number)
  const slot = fromISO(iso)
  slot.setHours(hh)
  if (slot <= now) return 'past'
  if (getBookings().some((b) => b.status === 'active' && b.code !== ignoreCode && b.date === iso && b.time === time))
    return 'mine'
  return hash(iso + time) < 0.38 ? 'busy' : 'free'
}

export const dayHasFree = (iso, ignoreCode) => TIMES.some((t) => slotState(iso, t, ignoreCode) === 'free')

export const formatDate = (iso, opts = { day: 'numeric', month: 'long', weekday: 'long' }) =>
  fromISO(iso).toLocaleDateString('ru-RU', opts)

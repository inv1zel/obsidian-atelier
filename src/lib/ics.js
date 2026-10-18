// Файл календаря .ics для записи — создаётся прямо в браузере
import { fromISO } from './bookings'
import { serviceById } from '../data/services'

const stamp = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')

export function downloadIcs(b) {
  const start = fromISO(b.date)
  const [h] = b.time.split(':').map(Number)
  start.setHours(h)
  const end = new Date(start.getTime() + 60 * 60 * 1000)
  const names = b.serviceIds.map((id) => serviceById(id)?.name).filter(Boolean).join(', ')
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//OBSIDIAN//Atelier//RU',
    'BEGIN:VEVENT',
    `UID:${b.code}@obsidian.atelier`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:OBSIDIAN — ${b.code}`,
    `DESCRIPTION:${names}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }))
  const a = document.createElement('a')
  a.href = url
  a.download = `obsidian-${b.code}.ics`
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

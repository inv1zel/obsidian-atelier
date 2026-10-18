// Фотографии с Unsplash (бесплатная лицензия Unsplash License).
// Скачиваются скриптом `npm run images` в public/images/<key>.jpg.
// Пока файла нет — на его месте показывается тёмная студийная заглушка.
// Чтобы заменить фото, поменяйте id и перезапустите скрипт.
export const images = {
  hero: { local: true, alt: 'Чёрный спорткар в студии ателье OBSIDIAN' },
  body: { local: true, alt: 'Полировка чёрного капота машинкой' },
  films: { local: true, alt: 'Нанесение защитной плёнки на капот' },
  interior: { local: true, alt: 'Салон со стёганой кожей бордового цвета' },
  options: { local: true, alt: 'Салон ночью с красной контурной подсветкой' },
  diagnostics: { local: true, alt: 'Осмотр лака под лампой: в луче видна паутинка царапин' },
  atelier: { local: true, alt: 'Тоннель осмотра со световыми рамками и автомобилем' },
  work1: { local: true, alt: 'Чёрный Porsche 911 в студии' },
  work2: { local: true, alt: 'Чёрный Mercedes-AMG G 63 в студии' },
  work3: { local: true, alt: 'Светлая кожа сиденья с волнистой стёжкой' },
  work4: { local: true, alt: 'BMW M5 в матовом графите' },
  work5: { local: true, alt: 'Салон Porsche Cayenne ночью' },
  work6: { local: true, alt: 'Матовый чёрный Lamborghini Huracán в студии' },
}

export const imageSrc = (key) => `${import.meta.env.BASE_URL}images/${key}.jpg`

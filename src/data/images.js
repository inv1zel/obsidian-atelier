// Фотографии лежат в public/images/<key>.jpg (для кейсов — ещё <key>-before.jpg).
// Если файла нет, на его месте показывается тёмная студийная заглушка.
export const images = {
  hero: { alt: 'Чёрный спорткар в студии ателье OBSIDIAN' },
  body: { alt: 'Полировка чёрного капота машинкой' },
  films: { alt: 'Нанесение защитной плёнки на капот' },
  interior: { alt: 'Салон со стёганой кожей бордового цвета' },
  options: { alt: 'Салон ночью с красной контурной подсветкой' },
  diagnostics: { alt: 'Осмотр лака под лампой: в луче видна паутинка царапин' },
  atelier: { alt: 'Тоннель осмотра со световыми рамками и автомобилем' },
  work1: { alt: 'Чёрный Porsche 911 в студии' },
  work2: { alt: 'Чёрный Mercedes-AMG G 63 в студии' },
  work3: { alt: 'Светлая кожа сиденья с волнистой стёжкой' },
  work4: { alt: 'BMW M5 в матовом графите' },
  work5: { alt: 'Салон Porsche Cayenne ночью' },
  work6: { alt: 'Матовый чёрный Lamborghini Huracán в студии' },
}

export const imageSrc = (key) => `${import.meta.env.BASE_URL}images/${key}.jpg`

// Фотографии с Unsplash (бесплатная лицензия Unsplash License).
// Скачиваются скриптом `npm run images` в public/images/<key>.jpg.
// Пока файла нет — на его месте показывается тёмная студийная заглушка.
// Чтобы заменить фото, поменяйте id и перезапустите скрипт.
export const images = {
  hero: { local: true, alt: 'Чёрный спорткар в студии ателье OBSIDIAN' },
  body: { local: true, alt: 'Полировка капота машинкой' },
  films: { local: true, alt: 'Нанесение защитной плёнки на капот' },
  interior: { id: 'photo-1503736334956-4c8f8e92946d', alt: 'Кожаный салон автомобиля' },
  options: { id: 'photo-1617814076367-b759c7d7e738', alt: 'Подсветка салона' },
  diagnostics: { local: true, alt: 'Осмотр лака под лампой: в луче видна паутинка царапин' },
  atelier: { id: 'photo-1601362840469-51e4d8d58785', alt: 'Студия ателье' },
  work1: { id: 'photo-1503376780353-7e6692767b70', alt: 'Porsche 911' },
  work2: { id: 'photo-1525609004556-c46c7d6cf023', alt: 'Чёрный внедорожник' },
  work3: { id: 'photo-1549399542-7e3f8b79c341', alt: 'Светлая кожа салона' },
  work4: { id: 'photo-1555215695-3004980ad54e', alt: 'BMW в графите' },
  work5: { id: 'photo-1614162692292-7ac56d7f7f1e', alt: 'Салон с подсветкой' },
  work6: { id: 'photo-1583121274602-3e2820c69888', alt: 'Суперкар' },
}

export const imageSrc = (key) => `${import.meta.env.BASE_URL}images/${key}.jpg`

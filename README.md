# MediaCMS Panel [beta]
## Панель керування
### Розподілена CMS для високонавантажених інтернет-видань

Панель керування відповідає за наповнення, редагування та видалення інформації.

#### Встановлення

1. Переконайтесь що у вас вже встановлено NPM, NodeJS, MongoDB
2. Встановіть код з репозиторію в каталог проєкту: \
`git clone https://github.com/MediaCMS/Panel.git`
3. Встановіть необхідні модулі npm за допомогою команди `npm install`
4. Скопіюйте файли зразки та заповніть їх відповідно до своїх потреб \
`config.example.js` в `config.js` \
`.gitignore-example` в `.gitignore` \
`src/config.example.js` в `src/config.js` \
5. Запустіть сервер NodeJS за допомогою команди `node app.js`
6. Створіть пакунок Webpack за допомогою команди `npm start` або `npm run build` 

#### Застереження

Для тестування роботи використайте колекції БД MongoDB з демонстраційними даними, які можна скачати з репозиторію [MediaCMS Data](https://github.com/MediaCMS/Data.git)

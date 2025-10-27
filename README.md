# Веб-мессенджер

Учебный проект — веб-приложение мессенджера.  
Реализованы базовые страницы и компоненты: авторизация, регистрация, список чатов, профиль и страницы с ошибками.

## 🌐 Деплой

Проект доступен по ссылке:  
[Ссылка на Netlify](https://radiant-daffodil-6a03ff.netlify.app/)

## 📐 Макеты

Дизайн-макеты можно посмотреть по ссылке:  
[Ссылка на макеты](https://www.figma.com/design/jF5fFFzgGOxQeB4CmKWTiE/Chat_external_link?node-id=0-1&p=f)

## 🚀 Команды для запуска и сборки

В проекте используются стандартные npm-скрипты:

### Основные команды
- `npm install` — установка зависимостей
- `npm run dev` — запуск проекта в режиме разработки (Vite dev-сервер)
- `npm run build` — сборка проекта для продакшена
- `npm run start` — сборка проекта и запуск через Express сервер
- `npm run preview` — локальный предпросмотр собранного проекта

### Проверка качества кода
- `npm run type:check` — проверка TypeScript типов (без генерации JS файлов)
- `npm run lint` — проверка TypeScript кода с ESLint (правила Airbnb)
- `npm run lint:fix` — автоматическое исправление ошибок ESLint
- `npm run lint:style` — проверка CSS стилей с Stylelint
- `npm run lint:style:fix` — автоматическое исправление ошибок Stylelint
- `npm run validate` — полная проверка проекта (типы + код + стили)

## 🛠️ Технологии и инструменты

### Frontend
- **TypeScript** — статическая типизация
- **Vite** — сборка и разработка
- **Handlebars (hbs)** — шаблонизатор

### Архитектура
- **Component-based architecture** — компонентный подход
- **MVC pattern** — Model-View-Controller архитектура
- **Custom Block class** — базовый класс для компонентов
- **Event Bus** — система событий

### Стилизация
- **PostCSS** — обработка CSS
- **Stylelint** — линтинг стилей

### Валидация
- **Единая система валидации форм** — валидация по blur и submit
- **Регулярные выражения** — проверка полей ввода

### API
- **Custom HTTPTransport** — класс для работы с запросами (XHR)
- **REST API** — методы GET, POST, PUT, DELETE

### Code Quality
- **ESLint** — линтинг кода (правила Airbnb)
- **TypeScript Compiler** — строгая проверка типов
- **Stylelint** — линтинг CSS стилей

---

✍️ Автор: valyatar  
📅 Год: 2025

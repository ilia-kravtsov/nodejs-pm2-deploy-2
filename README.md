# Деплой приложения на сервер с использованием PM2

## Публичный доступ к серверу

| Сервис   | URL / IP адрес                                                                                   |
|----------|--------------------------------------------------------------------------------------------------|
| IP адрес | 158.160.195.220                                                                                  |
| Frontend | [https://mesto.kravtsov.nomorepartiessbs.ru](https://mesto.kravtsov.nomorepartiessbs.ru)         |
| Backend  | [https://api.mesto.kravtsov.nomorepartiessbs.ru](https://api.mesto.kravtsov.nomorepartiessbs.ru) |

## Деплой через PM2

Для управления процессами и деплоя использовал один файл `ecosystem.config.js` на уровне проекта.  
В этом файле описаны бэкенд и фронтенд:

- **backend** — Node.js API сервер (`./backend/dist/app.js`)  
- **frontend** — React-приложение, отдаваемое через `serve` (`./frontend/build`)  

Файл `.env.deploy.example` содержит пример заполнения.  
Файл `.env.deploy` **не хранится в репозитории**.

### Деплой бэкенда

Pre-deploy команда:

- копирует файл `.env` на сервер  

Post-deploy команда выполняет:

- установку зависимостей (`npm install`)  
- сборку бэкенда (`npm run build`)  
- запуск бэкенда через PM2 (`pm2 reload ecosystem.config.js --env production`)  

---

### Деплой фронтенда

Post-deploy команда выполняет:

- установку зависимостей (`npm install`)  
- сборку фронтенда (`npm run build`)  
- запуск фронтенда через PM2 (`pm2 reload ecosystem.config.js --env production`)

### Автоматический перезапуск бэкенда

Бэкенд-сервис управляется PM2 и настроен на автоматический перезапуск в случае падения.  

### Эндпоинт для краш-теста

Для проверки автоматического перезапуска бэкенд-сервиса через PM2 в проекте добавлен эндпоинт:

Пример реализации в `backend/src/routes/index.ts`:

```ts
router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
```

### Автоматическое восстановление после краша

После обращения к эндпоинту `/crash-test` сервер намеренно падает, но PM2 автоматически перезапускает процесс.
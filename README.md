# Supabase Edge Functions

Автоматический деплой функций на Supabase через GitHub Actions.

## Функции

- **admin-api** — API для админ-панели (одобрение/отклонение заявок, отправка QR-кодов и счётов)
- **contract-sender** — автоматическая отправка подписанных договоров после одобрения

## Деплой

При пуше в `main` или `master` GitHub Actions автоматически развернёт обе функции.

### Вручную через CLI:

```bash
supabase functions deploy admin-api --project-ref eavmpfjkbhkuegpubtwx
supabase functions deploy contract-sender --project-ref eavmpfjkbhkuegpubtwx
```

## Переменные окружения

Добавь в GitHub Secrets:
- `SUPABASE_ACCESS_TOKEN` — Supabase Personal Access Token (sbp_...)

## URLs

После деплоя функции будут доступны по:
- https://eavmpfjkbhkuegpubtwx.functions.supabase.co/admin-api
- https://eavmpfjkbhkuegpubtwx.functions.supabase.co/contract-sender

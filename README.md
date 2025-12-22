# Survey Service API

---

## Auth

- `POST /auth/local/signup` — реєстрація користувача.
- `POST /auth/local/signin` — вхід користувача.
- `POST /auth/logout` — вихід користувача.
- `POST /auth/refresh` — оновлення токена доступу.

---

## Surveys

- `GET /surveys` — повертає всі опитування поточного користувача.
- `GET /surveys/:id` — повертає одне опитування по ID.
- `POST /surveys` — створює нове опитування.
- `PATCH /surveys/:id` — оновлює існуюче опитування.
- `DELETE /surveys/:id` — видаляє опитування.

---

## Questions

- `GET /surveys/:surveyId/questions` — повертає всі питання опитування.
- `POST /surveys/:surveyId/questions` — створює нове питання.
- `PATCH /questions/:id` — оновлює питання.
- `DELETE /questions/:id` — видаляє питання.

---

## Responses

- `GET /questions/:questionId/responses` — повертає всі відповіді на питання.
- `POST /questions/:questionId/responses` — створює нову відповідь.
- `PATCH /questions/:questionId/responses/:responseId` — оновлення відповіді (не дозволено, можна видаляти).
- `DELETE /questions/:questionId/responses/:responseId` — видаляє відповідь.

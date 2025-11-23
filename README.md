# Сервіс опитувань (NestJS) – Маршрути

## 1. AuthModule (Аутентифікація)
| Метод | Шлях | Опис |
|-------|------|-----|
| POST  | /auth/local/signup | Реєстрація користувача |
| POST  | /auth/local/signin | Логін користувача |
| POST  | /auth/refresh | Оновлення JWT токена |
| GET   | /auth/logout | Вийти |
| GET   | /auth/profile | Отримати профіль користувача |

---

## 2. UsersModule (Користувачі)
| Метод  | Шлях        | Опис |
|--------|------------|-----|
| GET    | /users     | Список всіх користувачів (Admin) |
| GET    | /users/:id | Профіль користувача |
| PATCH  | /users/:id | Оновлення профілю користувача |
| DELETE | /users/:id | Видалення користувача (Admin) |

---

## 3. SurveysModule (Опитування)
| Метод  | Шлях           | Опис |
|--------|----------------|-----|
| POST   | /surveys       | Створити опитування (Admin) |
| GET    | /surveys       | Список опитувань |
| GET    | /surveys/:id   | Деталі опитування |
| PATCH  | /surveys/:id   | Оновити опитування (Admin) |
| DELETE | /surveys/:id   | Видалити опитування (Admin) |

---

## 4. QuestionsModule (Питання)
| Метод  | Шлях                             | Опис |
|--------|---------------------------------|-----|
| POST   | /surveys/:surveyId/questions    | Додати питання до опитування |
| GET    | /surveys/:surveyId/questions    | Отримати всі питання опитування |
| PATCH  | /questions/:id                  | Оновити питання |
| DELETE | /questions/:id                  | Видалити питання |

---

## 5. ResponsesModule (Відповіді)
| Метод  | Шлях                             | Опис |
|--------|---------------------------------|-----|
| POST   | /surveys/:surveyId/responses    | Відповісти на опитування |
| GET    | /surveys/:surveyId/responses    | Отримати всі відповіді (Admin) |
| GET    | /responses/:id                  | Деталі конкретної відповіді |
| DELETE | /responses/:id                  | Видалити відповідь |

---

## 6. Optional: AnalyticsModule (Статистика)
| Метод | Шлях                      | Опис |
|-------|---------------------------|-----|
| GET   | /surveys/:surveyId/stats  | Статистика по опитуванню (кількість відповідей, розподіл по варіантах тощо) |

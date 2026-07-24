# Baig Tours API — Platform Core (Dev 1)

This README is the written contract referenced in the blueprint's Dev 1
completion checklist: *"apiResponse helper and error shapes shared with
the team in writing."* Every other developer's controller must follow
this shape exactly.

## Setup

```bash
cd server
cp .env.example .env      # fill in your local MONGO_URI, JWT_SECRET, etc.
npm install
npm run seed:admin        # creates the first superadmin from .env values
npm run dev                # starts on http://localhost:5000
```

Health check: `GET /api/health` → `{ "success": true, "message": "API is running." }`

## Response contract

Every endpoint, in every module, responds through `utils/apiResponse.js`.
There are exactly two shapes:

**Success**
```json
{
  "success": true,
  "message": "Logged in successfully.",
  "data": { "id": "...", "name": "...", "email": "...", "role": "admin" }
}
```

**Error**
```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": [{ "field": "email", "message": "Enter a valid email address" }]
}
```

`errors` is always an array — empty (`[]`) when there's nothing field-specific
to report, populated with `{ field, message }` objects for validation failures.

## Standard status codes

| Code | Meaning | Triggered by |
|---|---|---|
| 400 | Validation Error | `validateMiddleware` (failed express-validator chain) |
| 401 | Unauthorized | `verifyToken` — missing/invalid/expired cookie |
| 403 | Forbidden | `requireAdmin` — valid session, wrong role |
| 404 | Not Found | `notFoundMiddleware` — unmatched route |
| 409 | Conflict | Duplicate unique field (e.g. slug, email) — caught in `errorMiddleware` |
| 500 | Server Error | Anything unexpected — message is always generic, never leaks stack traces |

## Writing a controller (copy this pattern)

```js
const { asyncHandler } = require('../middleware/errorMiddleware');
const apiResponse = require('../utils/apiResponse');

exports.createSomething = asyncHandler(async (req, res) => {
  const doc = await SomeModel.create(req.body);
  return apiResponse(res, true, 'Created successfully.', doc, null, 201);
});
```

- Always wrap the function in `asyncHandler` — thrown errors (including
  Mongoose errors) are forwarded automatically to `errorMiddleware`.
  **Never** use raw `try/catch` + manual 500s in your controllers.
- Never query the database with anything other than your own model.
- Never call `res.json(...)` directly — always go through `apiResponse`.

## Protecting a route

```js
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

router.post('/admin/packages', verifyToken, requireAdmin(), upload.array('images', 10), validatePackage, createPackage);

// Role-restricted (e.g. Settings — superadmin only):
router.put('/admin/settings', verifyToken, requireAdmin(['superadmin']), updateSettings);
```

`verifyToken` must always run before `requireAdmin`. Order matters —
`requireAdmin` reads `req.user`, which only `verifyToken` sets.

## Validating a request body

```js
// validators/packageValidator.js
const { body } = require('express-validator');
exports.createPackageValidator = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
];

// routes/packageRoutes.js
const validateMiddleware = require('../middleware/validateMiddleware');
router.post('/admin/packages', verifyToken, requireAdmin(), createPackageValidator, validateMiddleware, createPackage);
```

## Mounting your router

Add one line to `app.js` under the "Route mounts" section:
```js
app.use('/api/packages', packageRoutes);
```
Open a PR against `app.js` for this — it's a shared file (see blueprint §3.1).

## Auth endpoints (owned by Dev 1)

| Method | Endpoint | Auth | Notes |
|---|---|---|---|
| POST | /api/auth/login | Public | Sets httpOnly `token` cookie on success |
| POST | /api/auth/logout | Private | Clears the cookie |
| GET | /api/auth/me | Private | Used by `AuthContext` on app load + `ProtectedRoute` |

## Files owned by this module — do not edit without a PR

- `server/config/*`, `server/middleware/*`
- `server/controllers/authController.js`, `server/models/User.js`
- `client/src/context/AuthContext.jsx`, `client/src/pages/admin/Login.jsx`
- `client/src/api/axiosClient.js`, `client/src/api/authApi.js`, `client/src/hooks/useAuth.js`

## Completion checklist

- [x] Server boots and connects to MongoDB (with retry logic)
- [x] Admin can log in and receive a valid session (httpOnly JWT cookie)
- [x] Protected route behavior: 401 without token, 200 with a valid token
- [x] `apiResponse` helper and error shapes documented here for the team

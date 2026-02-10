## Arika Encryption

`@arikajs/encryption` provides secure, application-level encryption for the ArikaJS framework.

It is responsible for encrypting and decrypting sensitive data such as sessions, cookies, signed payloads, and internal framework values — similar in spirit to Laravel’s `Illuminate\Encryption`.

This package is framework-agnostic at runtime, but designed to integrate seamlessly with `@arikajs/foundation` via service providers.

---

## ✨ Features

- 🔐 **AES-256-GCM encryption** (modern & secure)
- 🔑 **Single application key** (`APP_KEY`)
- 🧾 **Authenticated encryption** (tamper detection)
- 🔄 **Encrypt / decrypt strings & JSON**
- 🧠 **Stateless design** (safe for queues & workers)
- 🧩 **Framework service friendly**
- 🟦 **TypeScript-first**

---

## 📦 Installation

```bash
npm install @arikajs/encryption
# or
yarn add @arikajs/encryption
# or
pnpm add @arikajs/encryption
```

---

## 🔑 Application Key (Required)

This package requires an application key, usually provided via:

```ini
APP_KEY=base64:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

> **Note:** The key must be 32 bytes, Base64-encoded.
> You can generate one using:
> `arika key:generate`

---

## 🚀 Basic Usage (Standalone)

```ts
import { Encrypter } from '@arikajs/encryption';

const encrypter = new Encrypter('base64:your-app-key');

const encrypted = encrypter.encrypt('secret data');
const decrypted = encrypter.decrypt(encrypted);

console.log(decrypted); // "secret data"
```

### 📦 Encrypting Objects / JSON

```ts
const payload = {
  userId: 1,
  role: 'admin',
};

const token = encrypter.encrypt(payload);

const data = encrypter.decrypt(token);
// { userId: 1, role: 'admin' }
```

Internally, objects are JSON-serialized automatically.

---

## 🧠 Integration with ArikaJS

### Register as a service (via Foundation)

```ts
import { Encrypter } from '@arikajs/encryption';

this.app.singleton('encrypter', () => {
  const key = config('app.key');

  if (!key) {
    throw new Error('APP_KEY is not defined.');
  }

  return new Encrypter(key);
});
```

### Usage anywhere in the app

```ts
const encrypter = app.make<Encrypter>('encrypter');

const value = encrypter.encrypt('hello');
```

---

## 🔒 Security Guarantees

- Uses **AES-256-GCM**
- Every payload includes:
  - Random IV (Initialization Vector)
  - Authentication tag
- Any tampering → automatic decryption failure
- No weak or legacy algorithms
- If data is modified, `decrypt()` will throw.

---

## 🧩 Intended Consumers

This package is a core dependency for:

| Package | Usage |
| :--- | :--- |
| `@arikajs/session` | Encrypted sessions |
| `@arikajs/http` | Encrypted cookies |
| `@arikajs/queue` | Secure job payloads |
| `@arikajs/auth` | Token encryption |
| `@arikajs/mail` | Signed mail data |

---

## 🧠 API Reference

### `new Encrypter(key: string)`
Creates a new encrypter instance.

### `encrypt(value: string | object): string`
Encrypts a value and returns a string payload.

### `decrypt(payload: string): any`
Decrypts a payload and returns the original value.

Throws if:
- Payload is invalid
- Payload is tampered
- Key is incorrect

---

## 🏗 Architecture

```
encryption/
├── src/
│   ├── Encrypter.ts
│   ├── Contracts/
│   │   └── Encrypter.ts
│   ├── Exceptions/
│   │   └── DecryptionException.ts
│   └── index.ts
├── tests/
├── package.json
├── tsconfig.json
├── README.md
└── LICENSE
```

---

## 🚧 Planned (v1.x+)

- 🔄 Key rotation support
- 🧪 Encrypted payload versioning
- 🔑 Multiple key support (fallback decryption)
- 🧷 Signed-only (non-encrypted) payloads

---

## 🧭 Philosophy

> "Encryption should be invisible, mandatory, and impossible to misuse."

This package:
- Enforces strong defaults
- Centralizes cryptography
- Avoids configuration sprawl
- Keeps security boring and safe

---

## 📄 License

`@arikajs/encryption` is open-source software licensed under the **MIT License**.

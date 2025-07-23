# SmartSet

[![CI](https://github.com/gurbano/smartset/actions/workflows/test.yml/badge.svg)](https://github.com/gurbano/smartset/actions/workflows/test.yml)
[![Coverage](https://img.shields.io/badge/coverage-via--vitest-brightgreen)](https://vitest.dev/guide/coverage.html)
[![npm version](https://badge.fury.io/js/@gurbano%2Fsmartset.svg)](https://www.npmjs.com/package/@gurbano/smartset)

> A smart alternative to JavaScript's native `Set`, with custom key functions, array methods, immutability, and functional operations.

---

## ✨ Features

- 🔑 Custom key function for identity (`(item) => string | number`)
- 🔄 Mutable or immutable behavior per instance
- 🎯 Set operations: `union`, `intersection`, `difference`, `equals`, etc.
- 🧩 Supports array methods like `map`, `filter`, `reduce`, etc.
- 🧪 Fully tested with [Vitest](https://vitest.dev)

---

## 📦 Installation

```sh
npm install @gurbano/smartset
```

---

## 🚀 Usage

```ts
import { SmartSet } from '@gurbano/smartset';

type User = { id: number, name: string };

// Use a key function to identify items
const keyById = (u: User) => u.id;

// Immutable by default (set mutable = false)
const users = new SmartSet<User>(keyById, false)
  .add({ id: 1, name: 'Alice' })
  .add({ id: 2, name: 'Bob' });

console.log(users.size); // 2

const filtered = users.filter(u => u.name.startsWith('A'));
console.log(filtered); // [{ id: 1, name: 'Alice' }]
```

---

## 🧠 API Highlights

Construction:
  new SmartSet<T>(keyFn: (item: T) => string | number, mutable?: boolean)

Common Methods:
  - add(item, options?)         Adds item (optionally replace or override immutability)
  - delete(item, options?)      Deletes item
  - clear(options?)             Empties the set
  - clone()                     Clones the set
  - sortBy(fn, options?)        Sorts the set

Set Operations:
  - union(other)
  - intersection(other)
  - difference(other)
  - equals(other)
  - isSubsetOf(other)
  - isSupersetOf(other)

Array-like Methods:
  map, filter, reduce, some, every, find, forEach, toArray, values

---

## 🧪 Running tests

npx vitest run
npx vitest --coverage

---

## 📚 Documentation

Docs: https://gurbano.github.io/smartset/api/

---

## 🧑‍💻 Author

Made with ❤️ by [@gurbano](https://github.com/gurbano)
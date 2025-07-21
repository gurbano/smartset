# SmartSet

[![CI](https://github.com/gurbano/smartset/actions/workflows/test.yml/badge.svg)](https://github.com/gurbano/smartset/actions/workflows/test.yml)
[![Coverage](https://img.shields.io/badge/coverage-via--vitest-brightgreen)](https://vitest.dev/guide/coverage.html)
[![npm version](https://badge.fury.io/js/@gurbano%2Fsmartset.svg)](https://www.npmjs.com/package/@gurbano/smartset)

> A smart alternative to JavaScript's native `Set`, with custom comparators, array methods, immutability, and functional operations.

---

## ✨ Features

- 🔁 Custom comparator logic (`(a, b) => boolean`)
- 🔄 Mutable or immutable behavior per instance
- 🎯 Set operations: `union`, `intersection`, `difference`, `equals`, etc.
- 🧩 Supports array methods like `map`, `filter`, `reduce`, etc.
- 🧪 Fully tested with [Vitest](https://vitest.dev)

---

## 📦 Installation

npm install @gurbano/smartset

---

## 🚀 Usage

```ts

import { SmartSet } from '@gurbano/smartset';

type User = { id: number, name: string };

const comparator = (a: User, b: User) => a.id === b.id;

// Immutabile per default
const users = new SmartSet<User>(comparator, false)
  .add({ id: 1, name: 'Alice' })
  .add({ id: 2, name: 'Bob' });

console.log(users.size); // 2

const filtered = users.filter(u => u.name.startsWith('A'));
```



## 🧠 API Highlights

Construction:
  new SmartSet<T>(comparator: (a, b) => boolean, mutable?: boolean)

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

## 🛠️ Build & Publish

npm run build
npm version patch
npm publish --access public

---

## 📚 Documentation

Docs: https://gurbano.github.io/smartset/api/

---

## 🧑‍💻 Author

Made with ❤️ by [@gurbano](https://github.com/gurbano)
# SmartSet

> A smart alternative to JavaScript's native `Set`, with custom key functions, array methods, immutability, and functional operations.

[![CI](https://github.com/gurbano/smartset/actions/workflows/test.yml/badge.svg)](https://github.com/gurbano/smartset/actions/workflows/test.yml)
[![Coverage](https://img.shields.io/badge/coverage-via--vitest-brightgreen)](https://vitest.dev/guide/coverage.html)
[![npm version](https://badge.fury.io/js/@gurbano%2Fsmartset.svg)](https://www.npmjs.com/package/@gurbano/smartset)

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
```ts
new SmartSet<T>(keyFn: (item: T) => string | number, mutable?: boolean)
SmartSet.fromArray(array: T[], keyFn, mutable?)
```

Core Methods:
- `add(item, options?)`  
  Adds an item. Options: `{ replace?: boolean; mutable?: boolean }`
- `delete(item, options?)`  
  Removes an item. Returns `true`/`false` or a new SmartSet.
- `clear(options?)`  
  Empties the set.
- `clone()`  
  Returns a deep copy.
- `sortBy(compareFn, options?)`  
  Sorts the set.

Set Operations:
- `union(other: SmartSet<T>)`  
  Returns the union of two sets.
- `intersection(other: SmartSet<T>)`  
  Returns the intersection.
- `difference(other: SmartSet<T>)`  
  Returns the difference.
- `symmetricDifference(other: SmartSet<T>)`  
  Returns elements in either set but not both.
- `xor(other: SmartSet<T>)`  
  Alias for `symmetricDifference`.
- `isSubsetOf(other: SmartSet<T>)`  
  Checks if this set is a subset.
- `isSupersetOf(other: SmartSet<T>)`  
  Checks if this set is a superset.
- `equals(other: SmartSet<T>)`  
  Checks equality.
- `overlaps(other: SmartSet<T>)`  
  Checks if sets share at least one element.
- `without(itemsToExclude: SmartSet<T>)`  
  Returns a set without specified items.
- `withOnly(itemsToInclude: SmartSet<T>)`  
  Returns a set with only specified items.
- `filteredIntersection(other, predicate)`  
  Intersection filtered by a predicate.

Array-like Methods:
- `map(fn)`
- `filter(fn)`
- `reject(fn)`  
  Inverse of filter.
- `find(fn)`
- `some(fn)`
- `every(fn)`
- `reduce(fn, initialValue)`
- `forEach(fn)`
- `toArray()`
- `values()`
- `flatMap(fn, keyFn, options?)`
- `groupBy(fn)`
- `partition(fn)`
- `uniqBy(fn)`

Other:
- `size`  
  Number of items.
- `isImmutable()`  
  Returns `true` if immutable.
- `[Symbol.iterator]()`  
  Enables iteration with `for...of`.
  
## 🧪 Running tests

npx vitest run
npx vitest --coverage

---

## 📚 Documentation

Docs: https://gurbano.github.io/smartset/api/

---

## 🧑‍💻 Author

Made with ❤️ by [@gurbano](https://github.com/gurbano)
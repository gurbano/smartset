# SmartSet

SmartSet è una classe `Set`-like scritta in TypeScript con:

- supporto a comparator custom
- metodi funzionali (`map`, `filter`, ecc.)
- comportamento mutabile o immutabile per istanza
- operazioni insiemistiche (`union`, `intersection`, ecc.)

## Uso base

```ts
const set = new SmartSet<User>((a, b) => a.id === b.id);
set.add({ id: 1 });
```

## API completa

👉 [Consulta il README completo](../README.md)

type KeyFn<T> = (item: T) => string | number;

export class SmartSet<T> {
  private items: T[] = [];
  private indexMap: Map<string | number, number> = new Map();

  constructor(
    private keyFn: KeyFn<T>,
    private mutable: boolean = true
  ) {}

  static fromArray<T>(
    array: T[],
    keyFn: KeyFn<T>,
    mutable = true
  ): SmartSet<T> {
    return array.reduce(
      (set, item) => set.add(item) as SmartSet<T>,
      new SmartSet<T>(keyFn, mutable)
    );
  }

  isImmutable(): boolean {
    return !this.mutable;
  }

  clone(): SmartSet<T> {
    const clone = new SmartSet<T>(this.keyFn, this.mutable);
    clone.items = [...this.items];
    clone.indexMap = new Map(this.indexMap);
    return clone;
  }

  add(item: T, options?: { replace?: boolean; mutable?: boolean }): this | SmartSet<T> {
    const isMutable = options?.mutable ?? this.mutable;
    const target = isMutable ? this : this.clone();
    const key = target.keyFn(item);

    if (target.indexMap.has(key)) {
      if (options?.replace) {
        const idx = target.indexMap.get(key)!;
        target.items[idx] = item;
      }
    } else {
      target.items.push(item);
      target.indexMap.set(key, target.items.length - 1);
    }
    return target;
  }

  delete(item: T, options?: { mutable?: boolean }): boolean | SmartSet<T> {
    const isMutable = options?.mutable ?? this.mutable;
    const target = isMutable ? this : this.clone();
    const key = target.keyFn(item);

    if (target.indexMap.has(key)) {
      const idx = target.indexMap.get(key)!;
      target.items.splice(idx, 1);
      target.indexMap.delete(key);
      // Aggiorna gli indici nella mappa dopo la rimozione
      for (let i = idx; i < target.items.length; i++) {
        const k = target.keyFn(target.items[i]);
        target.indexMap.set(k, i);
      }
      return isMutable ? true : target;
    }
    return isMutable ? false : target;
  }

  clear(options?: { mutable?: boolean }): void | SmartSet<T> {
    const isMutable = options?.mutable ?? this.mutable;
    if (isMutable) {
      this.items = [];
      this.indexMap.clear();
      return;
    } else {
      return new SmartSet<T>(this.keyFn, this.mutable);
    }
  }

  sortBy(compareFn: (a: T, b: T) => number, options?: { mutable?: boolean }): this | SmartSet<T> {
    const isMutable = options?.mutable ?? this.mutable;
    const target = isMutable ? this : this.clone();
    target.items.sort(compareFn);
    // Ricostruisci la mappa degli indici
    target.indexMap.clear();
    target.items.forEach((item, idx) => {
      target.indexMap.set(target.keyFn(item), idx);
    });
    return target;
  }

  has(item: T): boolean {
    const key = this.keyFn(item);
    return this.indexMap.has(key);
  }

  get size(): number {
    return this.items.length;
  }

  values(): T[] {
    return [...this.items];
  }

  toArray(): T[] {
    return this.values();
  }

  forEach(callback: (value: T, index: number, array: T[]) => void): void {
    this.items.forEach(callback);
  }

  map<U>(callback: (value: T, index: number, array: T[]) => U): U[] {
    return this.items.map(callback);
  }

  filter(predicate: (value: T, index: number, array: T[]) => boolean): T[] {
    return this.items.filter(predicate);
  }

  find(predicate: (value: T, index: number, array: T[]) => boolean): T | undefined {
    return this.items.find(predicate);
  }

  some(predicate: (value: T, index: number, array: T[]) => boolean): boolean {
    return this.items.some(predicate);
  }

  every(predicate: (value: T, index: number, array: T[]) => boolean): boolean {
    return this.items.every(predicate);
  }

  reduce<U>(callback: (acc: U, value: T, index: number, array: T[]) => U, initialValue: U): U {
    return this.items.reduce(callback, initialValue);
  }

  union(other: SmartSet<T>): SmartSet<T> {
    const result = this.mutable ? this : this.clone();
    for (const item of other) {
      result.add(item);
    }
    return result;
  }

  intersection(other: SmartSet<T>): SmartSet<T> {
    const result = new SmartSet<T>(this.keyFn, this.mutable);
    for (const item of this) {
      if (other.has(item)) {
        result.add(item);
      }
    }
    return this.mutable ? (this.clear(), result.addAll(result)) : result;
  }

  difference(other: SmartSet<T>): SmartSet<T> {
    const result = new SmartSet<T>(this.keyFn, this.mutable);
    for (const item of this) {
      if (!other.has(item)) {
        result.add(item);
      }
    }
    return this.mutable ? (this.clear(), result.addAll(result)) : result;
  }

  isSubsetOf(other: SmartSet<T>): boolean {
    for (const item of this) {
      if (!other.has(item)) return false;
    }
    return true;
  }

  isSupersetOf(other: SmartSet<T>): boolean {
    return other.isSubsetOf(this);
  }

  equals(other: SmartSet<T>): boolean {
    return this.size === other.size && this.isSubsetOf(other);
  }

  private addAll(other: SmartSet<T>): this {
    for (const item of other) {
      this.add(item);
    }
    return this;
  }

  [Symbol.iterator](): Iterator<T> {
    return this.items[Symbol.iterator]();
  }
}
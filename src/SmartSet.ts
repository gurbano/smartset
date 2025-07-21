type Comparator<T> = (a: T, b: T) => boolean;

export class SmartSet<T> {
  private items: T[] = [];

  constructor(
    private comparator: Comparator<T>,
    private mutable: boolean = true
  ) {}

  static fromArray<T>(
  array: T[],
  comparator: Comparator<T>,
  mutable = true
): SmartSet<T> {
  return array.reduce(
    (set, item) => set.add(item) as SmartSet<T>,
    new SmartSet<T>(comparator, mutable)
  );
}

  isImmutable(): boolean {
    return !this.mutable;
  }

  clone(): SmartSet<T> {
    return SmartSet.fromArray([...this.items], this.comparator, this.mutable);
  }


  add(item: T, options?: { replace?: boolean; mutable?: boolean }): this | SmartSet<T> {
    const isMutable = options?.mutable ?? this.mutable;
    const target = isMutable ? this : this.clone();
    const index = target.items.findIndex(existing => this.comparator(existing, item));
    if (index === -1) {
      target.items.push(item);
    } else if (options?.replace) {
      target.items[index] = item;
    }
    return target;
  }

  delete(item: T, options?: { mutable?: boolean }): boolean | SmartSet<T> {
    const isMutable = options?.mutable ?? this.mutable;
    const target = isMutable ? this : this.clone();
    
    const index = target.items.findIndex(existing => this.comparator(existing, item));
    if (index !== -1) {
      target.items.splice(index, 1);
      return isMutable ? true : target;
    }
    return isMutable ? false : target;
  }

  clear(options?: { mutable?: boolean }): void | SmartSet<T> {
    const isMutable = options?.mutable ?? this.mutable;
    return isMutable ? (this.items = []) as unknown as void : new SmartSet<T>(this.comparator, this.mutable);
  }

  sortBy(compareFn: (a: T, b: T) => number, options?: { mutable?: boolean }): this | SmartSet<T> {
    const isMutable = options?.mutable ?? this.mutable;
    const target = isMutable ? this : this.clone();
    target.items.sort(compareFn);
    return target;
  }

  has(item: T): boolean {
    return this.items.some(existing => this.comparator(existing, item));
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
    const result = new SmartSet<T>(this.comparator, this.mutable);
    for (const item of this) {
      if (other.has(item)) {
        result.add(item);
      }
    }
    return this.mutable ? (this.clear(), result.addAll(result)) : result;
  }

  difference(other: SmartSet<T>): SmartSet<T> {
    const result = new SmartSet<T>(this.comparator, this.mutable);
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

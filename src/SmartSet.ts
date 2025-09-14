/**
 * A key function used to uniquely identify elements in the SmartSet.
 */
type KeyFn<T> = (item: T) => string | number;

/**
 * SmartSet is a data structure that combines Set semantics with array methods.
 * It allows custom comparison via key functions and supports both mutable and immutable modes.
 */
export default class SmartSet<T> {
  private items: T[] = [];
  private indexMap: Map<string | number, number> = new Map();

  /**
   * Creates a new SmartSet.
   * @param keyFn A function to extract a unique key from each element.
   * @param mutable If false, methods return a new instance instead of mutating.
   */
  constructor(
    private keyFn: KeyFn<T>,
    private mutable: boolean = true
  ) {}

  /**
   * Creates a SmartSet from an array.
   * @param array Input array.
   * @param keyFn Key extraction function.
   * @param mutable Optional flag to control mutability.
   */
  static fromArray<T>(
    array: T[],
    keyFn: KeyFn<T>,
    mutable = true
  ): SmartSet<T> {
  const set = new SmartSet<T>(keyFn, mutable);

  if (mutable) {
    // Se mutabile usiamo add normalmente (supporta replace e regole extra)
    for (const item of array) {
      set.add(item);
    }
  } else {
    // Se immutabile, popola direttamente senza creare cloni
    const seen = new Set<string | number>();
    for (const item of array) {
      const key = keyFn(item);
      if (!seen.has(key)) {
        seen.add(key);
        set.items.push(item);
        set.indexMap.set(key, set.items.length - 1);
      }
    }
  }

  return set;
  }

  /**
   * Checks if the set is immutable.
   */
  isImmutable(): boolean {
    return !this.mutable;
  }

  /**
   * Returns a deep copy of the SmartSet.
   */
  clone(): SmartSet<T> {
    const clone = new SmartSet<T>(this.keyFn, this.mutable);
    clone.items = [...this.items];
    clone.indexMap = new Map(this.indexMap);
    return clone;
  }

  /**
   * Adds an element to the set.
   * @param item Element to add.
   * @param options Optional settings: replace existing, override mutability.
   */
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

  /**
   * Removes an item from the set.
   * @param item Item to remove.
   * @param options Optional mutability setting.
   */
  delete(item: T, options?: { mutable?: boolean }): boolean | SmartSet<T> {
    const isMutable = options?.mutable ?? this.mutable;
    const target = isMutable ? this : this.clone();
    const key = target.keyFn(item);

    if (!target.indexMap.has(key)) return isMutable ? false : target;

    const idx = target.indexMap.get(key)!;
    const lastIdx = target.items.length - 1;

    if (idx !== lastIdx) {
      const lastItem = target.items[lastIdx];
      target.items[idx] = lastItem;
      target.indexMap.set(target.keyFn(lastItem), idx);
    }
    target.items.pop();
    target.indexMap.delete(key);

    return isMutable ? true : target;
  }

  /**
   * Clears the set.
   * @param options Optional mutability setting.
   */
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

  /**
   * Sorts the set using the provided compare function.
   * @param compareFn Comparison function.
   * @param options Optional mutability setting.
   */
  sortBy(compareFn: (a: T, b: T) => number, options?: { mutable?: boolean }): this | SmartSet<T> {
    const isMutable = options?.mutable ?? this.mutable;
    const target = isMutable ? this : this.clone();
    target.items.sort(compareFn);
    target.indexMap.clear();
    target.items.forEach((item, idx) => {
      target.indexMap.set(target.keyFn(item), idx);
    });
    return target;
  }

  /**
   * Checks if an item is in the set.
   */
  has(item: T): boolean {
    const key = this.keyFn(item);
    return this.indexMap.has(key);
  }

  /**
   * Returns the number of items in the set.
   */
  get size(): number {
    return this.items.length;
  }

  /**
   * Returns all items as an array.
   */
  values(): T[] {
    return [...this.items];
  }

  /**
   * Alias for `values()`.
   */
  toArray(): T[] {
    return this.values();
  }

  /**
   * Executes a provided function once for each element.
   */
  forEach(callback: (value: T, index: number, array: T[]) => void): void {
    this.items.forEach(callback);
  }

  /**
   * Creates a new array with the results of calling a function on every element.
   */
  map<U>(callback: (value: T, index: number, array: T[]) => U): U[] {
    return this.items.map(callback);
  }

  /**
   * Creates a new array with all elements that pass the test.
   */
  filter(predicate: (value: T, index: number, array: T[]) => boolean): T[] {
    return this.items.filter(predicate);
  }

  /**
   * Returns the first element that satisfies the test.
   */
  find(predicate: (value: T, index: number, array: T[]) => boolean): T | undefined {
    return this.items.find(predicate);
  }

  /**
   * Tests whether at least one element passes the test.
   */
  some(predicate: (value: T, index: number, array: T[]) => boolean): boolean {
    return this.items.some(predicate);
  }

  /**
   * Tests whether all elements pass the test.
   */
  every(predicate: (value: T, index: number, array: T[]) => boolean): boolean {
    return this.items.every(predicate);
  }

  /**
   * Applies a function against an accumulator and each element.
   */
  reduce<U>(callback: (acc: U, value: T, index: number, array: T[]) => U, initialValue: U): U {
    return this.items.reduce(callback, initialValue);
  }

  /**
   * Returns the union of this set with another.
   */
  union(other: SmartSet<T>): SmartSet<T> {
    const result = this.mutable ? this : this.clone();
    for (const item of other) {
      result.add(item);
    }
    return result;
  }

  /**
   * Returns the intersection of this set with another.
   */
  intersection(other: SmartSet<T>): SmartSet<T> {
    const result = new SmartSet<T>(this.keyFn, this.mutable);
    for (const item of this) {
      if (other.has(item)) {
        result.add(item);
      }
    }
    return this.mutable ? (this.clear(), result.addAll(result)) : result;
  }

  /**
   * Returns the difference between this set and another.
   */
  difference(other: SmartSet<T>): SmartSet<T> {
    const result = new SmartSet<T>(this.keyFn, this.mutable);
    for (const item of this) {
      if (!other.has(item)) {
        result.add(item);
      }
    }
    return this.mutable ? (this.clear(), result.addAll(result)) : result;
  }

  /**
   * Checks if this set is a subset of another.
   */
  isSubsetOf(other: SmartSet<T>): boolean {
    for (const item of this) {
      if (!other.has(item)) return false;
    }
    return true;
  }

  /**
   * Checks if this set is a superset of another.
   */
  isSupersetOf(other: SmartSet<T>): boolean {
    return other.isSubsetOf(this);
  }

  /**
   * Checks if two sets are equal.
   */
  equals(other: SmartSet<T>): boolean {
    return this.size === other.size && this.isSubsetOf(other);
  }

  /**
   * Returns the symmetric difference between this set and another.
   * Includes elements that are in either set but not in both.
   */
  symmetricDifference(other: SmartSet<T>): SmartSet<T> {
    const result = new SmartSet<T>(this.keyFn, this.mutable);
    for (const item of this) {
      if (!other.has(item)) {
        result.add(item);
      }
    }
    for (const item of other) {
      if (!this.has(item)) {
        result.add(item);
      }
    }
    return result;
  }

  /**
   * Returns a new set excluding the specified items.
   * @param itemsToExclude Items to remove from the set.
   */
  without(itemsToExclude: SmartSet<T>): SmartSet<T> {
    return this.difference(itemsToExclude);
  }

  /**
   * Returns a new set containing only the specified items if they exist in the set.
   * @param itemsToInclude Items to keep in the set.
   */
  withOnly(itemsToInclude: SmartSet<T>): SmartSet<T> {
    return this.intersection(itemsToInclude);
  }

  /**
   * Adds all items from another set.
   */
  private addAll(other: SmartSet<T>): this {
    for (const item of other) {
      this.add(item);
    }
    return this;
  }

  /**
   * Maps each item and flattens the result into a single SmartSet.
   * @param fn Function to apply to each item.
   * @param keyFn Key extraction function for the resulting type.
   * @param options Optional mutability setting.
   */
  flatMap<U>(fn: (item: T) => U[], keyFn: KeyFn<U>, options?: { mutable?: boolean }): SmartSet<U> {
    const result = new SmartSet<U>(keyFn, options?.mutable ?? this.mutable);
    for (const item of this.items) {
      for (const mapped of fn(item)) {
        result.add(mapped);
      }
    }
    return result;
  }

  /**
   * Groups items by the key returned by the provided function.
   */
  groupBy<K extends string | number>(fn: (item: T) => K): Record<K, SmartSet<T>> {
    const groups: Record<K, SmartSet<T>> = {} as any;
    for (const item of this.items) {
      const key = fn(item);
      if (!groups[key]) {
        groups[key] = new SmartSet<T>(this.keyFn, this.mutable);
      }
      groups[key].add(item);
    }
    return groups;
  }

  /**
   * Splits items into two sets based on the predicate result.
   */
  partition(fn: (item: T) => boolean): [SmartSet<T>, SmartSet<T>] {
    const a = new SmartSet<T>(this.keyFn, this.mutable);
    const b = new SmartSet<T>(this.keyFn, this.mutable);
    for (const item of this.items) {
      (fn(item) ? a : b).add(item);
    }
    return [a, b];
  }

  /**
   * Returns a new SmartSet with items that do NOT match the predicate.
   * It is the inverse of `filter`.
   */
  reject(fn: (item: T) => boolean): SmartSet<T> {
    return SmartSet.fromArray(
      this.items.filter(item => !fn(item)),
      this.keyFn,
      this.mutable
    );
  }

  /**
   * Deduplicates items using a custom function.
   */
  uniqBy<K>(fn: (item: T) => K): SmartSet<T> {
    const seen = new Set<K>();
    const result = new SmartSet<T>(this.keyFn, this.mutable);
    for (const item of this.items) {
      const key = fn(item);
      if (!seen.has(key)) {
        seen.add(key);
        result.add(item);
      }
    }
    return result;
  }

  /**
   * Enables iteration with `for...of`.
   */
  [Symbol.iterator](): Iterator<T> {
    return this.items[Symbol.iterator]();
  }

  /**
   * Returns true if the current set and the provided set share at least one common element.
   * @param other Another SmartSet instance.
   */
  overlaps(other: SmartSet<T>): boolean {
    for (const item of this) {
      if (other.has(item)) return true;
    }
    return false;
  }

  /**
   * Returns a new SmartSet containing elements that are only in one of the two sets (exclusive or).
   * @param other Another SmartSet instance.
   */
  xor(other: SmartSet<T>): SmartSet<T> {
    return this.symmetricDifference(other);
  }

  /**
   * Returns a SmartSet that contains only the items that are in both sets and satisfy a given condition.
   * @param other Another SmartSet instance.
   * @param predicate Optional predicate to filter intersected elements.
   */
  filteredIntersection(other: SmartSet<T>, predicate: (item: T) => boolean): SmartSet<T> {
    const result = new SmartSet<T>(this.keyFn, this.mutable);
    for (const item of this) {
      if (other.has(item) && predicate(item)) {
        result.add(item);
      }
    }
    return result;
  }
}

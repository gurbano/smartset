import { SmartSet } from '../src/SmartSet.js';

type User = { id: number; name: string };
const keyById = (u: User) => u.id;
const keyByName = (u: User) => u.name;

describe('🟢 🔵 SmartSet 🟡 ⚫', () => {

  //  Basic Set methods
  describe('🟢 Basic methods', () => {
    it('add + size', () => {
      const set = new SmartSet<User>(keyById);
      set.add({ id: 1, name: 'Alice' });
      set.add({ id: 1, name: 'Alicia' }); // Duplicate
      expect(set.size).toBe(1);
    });

    it('add + size', () => {
      const set = new SmartSet<User>(keyByName);
      set.add({ id: 1, name: 'Alice' });
      set.add({ id: 2, name: 'Alice' }); // Duplicate
      expect(set.size).toBe(1);
    });

    it('add with replace', () => {
      const set = new SmartSet<User>(keyById);
      set.add({ id: 1, name: 'Alice' });
      set.add({ id: 1, name: 'Alicia' }, { replace: true });
      expect(set.size).toBe(1);
      expect(set.toArray()[0].name).toBe('Alicia');
    });

    it('delete', () => {
      const set = new SmartSet<User>(keyById);
      set.add({ id: 1, name: 'Alice' });
      const deleted = set.delete({ id: 1, name: 'Alice' });
      expect(deleted).toBe(true);
      expect(set.size).toBe(0);
    });

    it('clear', () => {
      const set = new SmartSet<User>(keyById);
      set.add({ id: 1, name: 'Alice' });
      set.clear();
      expect(set.size).toBe(0);
    });

    it('clone', () => {
      const set = new SmartSet<User>(keyById);
      set.add({ id: 1, name: 'Alice' });
      const cloned = set.clone();
      expect(cloned.size).toBe(1);
      expect(cloned).not.toBe(set);
    });

    it('has', () => {
      const set = new SmartSet<User>(keyById);
      set.add({ id: 1, name: 'Alice' });
      expect(set.has({ id: 1, name: 'Alicia' })).toBe(true);
    });

    it('isImmutable', () => {
      const mut = new SmartSet<User>(keyById, true);
      const immut = new SmartSet<User>(keyById, false);
      expect(mut.isImmutable()).toBe(false);
      expect(immut.isImmutable()).toBe(true);
    });

    it('fromArray mutable', () => {
      const arr = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 1, name: 'Alicia' } // duplicate id
      ];
      const set = SmartSet.fromArray(arr, keyById, true);
      expect(set.size).toBe(2);
      expect(set.isImmutable()).toBe(false);
      expect(set.has({ id: 1, name: 'Alice' })).toBe(true);
      expect(set.has({ id: 2, name: 'Bob' })).toBe(true);
    });

    it('fromArray immutable', () => {
      const arr = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 1, name: 'Alicia' } // duplicate id
      ];
      const set = SmartSet.fromArray(arr, keyById, false);
      expect(set.size).toBe(2);
      expect(set.isImmutable()).toBe(true);
      expect(set.has({ id: 1, name: 'Alice' })).toBe(true);
      expect(set.has({ id: 2, name: 'Bob' })).toBe(true);
    });
  });

  describe('🔵 Array-like methods', () => {
    const set = new SmartSet<User>(keyById);
    set.add({ id: 1, name: 'Alice' }).add({ id: 2, name: 'Bob' });

    it('map', () => {
      expect(set.map(u => u.name)).toEqual(['Alice', 'Bob']);
    });

    it('filter', () => {
      expect(set.filter(u => u.id === 1).length).toBe(1);
    });

    it('find', () => {
      expect(set.find(u => u.name === 'Bob')?.id).toBe(2);
    });

    it('some', () => {
      expect(set.some(u => u.name === 'Alice')).toBe(true);
    });

    it('every', () => {
      expect(set.every(u => u.id > 0)).toBe(true);
    });

    it('reduce', () => {
      const total = set.reduce((acc, u) => acc + u.id, 0);
      expect(total).toBe(3);
    });

    it('forEach', () => {
      const names: string[] = [];
      set.forEach(u => names.push(u.name));
      expect(names).toEqual(['Alice', 'Bob']);
    });

    it('toArray / values', () => {
      const arr = set.toArray();
      const vals = set.values();
      expect(arr.length).toBe(2);
      expect(vals).toEqual(arr);
    });

    it('sortBy', () => {
      const sorted = set.sortBy((a, b) => a.name.localeCompare(b.name), { mutable: false });
      expect(sorted.toArray()[0].name).toBe('Alice');
    });
  });

  describe('🟣 Set operations', () => {
    it('union', () => {
      const a = SmartSet.fromArray([{ id: 1, name:'Alice'}, { id: 2, name:'Bob' }], keyById);
      const b = SmartSet.fromArray([{ id: 2, name:'Alice' }, { id: 3, name:'Bob' }], keyById);

      const result = a.union(b);
      expect(result.toArray().length).toBe(3);
    });

    it('intersection', () => {
      const a = SmartSet.fromArray([{ id: 1, name:'Alice'}, { id: 2, name:'Bob' }], keyById);
      const b = SmartSet.fromArray([{ id: 2, name:'Alice' }, { id: 3, name:'Bob' }], keyById);

      const result = a.intersection(b);
      expect(result.toArray()).toEqual([{ id: 2, name:'Bob' }]);
    });

    it('difference', () => {
      const a = SmartSet.fromArray([{ id: 1, name:'Alice'}, { id: 2, name:'Bob' }], keyById);
      const b = SmartSet.fromArray([{ id: 2, name:'Alice' }, { id: 3, name:'Bob' }], keyById);

      const result = a.difference(b);
      expect(result.toArray()).toEqual([{ id: 1, name: "Alice", }]);
    });

    it('isSubsetOf / isSupersetOf', () => {
      const a = SmartSet.fromArray([{ id: 1, name:'Alice'}, { id: 2, name:'Bob' }], keyById);
      const b = SmartSet.fromArray([{ id: 2, name:'Alice' }, { id: 3, name:'Bob' }], keyById);
      const sub = SmartSet.fromArray([{ id: 2, name:'Alice' }], keyById);
      expect(sub.isSubsetOf(a)).toBe(true);
      expect(a.isSupersetOf(sub)).toBe(true);
    });

    it('equals', () => {
      const a = SmartSet.fromArray([{ id: 1, name:'Alice'}, { id: 2, name:'Bob' }], keyById);
      const b = SmartSet.fromArray([{ id: 2, name:'Alice' }, { id: 3, name:'Bob' }], keyById);
      const c = SmartSet.fromArray([{ id: 1, name:'Alice' }, { id: 2, name:'Alice' }], keyById);
      expect(a.equals(c)).toBe(true);
    });
  });

  describe('🟡 Immutability', () => {
    it('add immutable', () => {
      const immut = new SmartSet<User>(keyById, false);
      const result = (immut.add({ id: 5, name: 'Zoe' }) as SmartSet<User>)
        .add({ id: 5, name: 'Zoe' })
        .add({ id: 2, name: 'Zoe' });
      expect(immut.size).toBe(0);
      expect(result.size).toBe(2);
    });

    it('delete immutable', () => {
      const base = SmartSet.fromArray([{ id: 1, name:'Alice' }, { id: 2, name:'Bob' }, { id: 3, name:'Gino' }], keyById, false);
      const result = base.delete({ id: 1, name:'Alice' });
      expect((result as SmartSet<User>).size).toBe(2);
    });

    it('clear immutable', () => {
      const base = SmartSet.fromArray([{ id: 1, name:'Alice' }, { id: 2, name:'Alice' }], keyById, false);
      const result = base.clear();
      expect((result as SmartSet<User>).size).toBe(0);
    });

    it('sortBy immutable', () => {
      const base = SmartSet.fromArray([
        { id: 2, name: 'B' },
        { id: 1, name: 'A' }
      ], keyById, false);
      const sorted = base.sortBy((a, b) => a.id - b.id);
      expect(sorted.toArray()[0].id).toBe(1);
    });
  });

  describe('🔴 Additional functional methods', () => {
    const set = SmartSet.fromArray(
      [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Alice' }
      ],
      keyById
    );

    it('flatMap', () => {
      const result = set.flatMap(
        (user) => [user.name, user.name.toUpperCase()],
        (val) => val
      );
      expect(result.has('ALICE')).toBe(true);
      expect(result.size).toBe(4);
    });

    it('groupBy', () => {
      const groups = set.groupBy(user => user.name);
      expect(groups['Alice']).toBeDefined();
      expect(groups['Bob']).toBeDefined();
      expect(groups['Alice'].size).toBe(2);
    });

    it('partition', () => {
      const [startsWithA, others] = set.partition(user => user.name.startsWith('A'));
      expect(startsWithA.size).toBe(2);
      expect(others.size).toBe(1);
    });

    it('reject', () => {
      const result = set.reject(user => user.name === 'Alice');
      expect(result.size).toBe(1);
      expect(result.toArray()[0].name).toBe('Bob');
    });

    it('uniqBy', () => {
      const duplicatedSet = SmartSet.fromArray(
        [
          { id: 1, name: 'Alice' },
          { id: 2, name: 'Alice' },
          { id: 3, name: 'Bob' }
        ],
        keyById
      );
      const result = duplicatedSet.uniqBy(user => user.name);
      expect(result.size).toBe(2);
    });
  });

  describe('⚫ Additional set operators', () => {
    it('symmetricDifference', () => {
      const a = SmartSet.fromArray([{ id: 1, name: 'A' }, { id: 2, name: 'B' }], keyById);
      const b = SmartSet.fromArray([{ id: 2, name: 'C' }, { id: 3, name: 'D' }], keyById);
      const result = a.symmetricDifference(b);
      expect(result.toArray()).toEqual([{ id: 1, name: 'A' }, { id: 3, name: 'D' }]);
    });

    it('withOnly', () => {
      const base = SmartSet.fromArray([{ id: 1, name: 'A' }, { id: 2, name: 'B' }], keyById);
      const filter = SmartSet.fromArray([{ id: 2, name: 'B' }], keyById);
      const result = base.withOnly(filter);
      expect(result.size).toBe(1);
      expect(result.toArray()[0].id).toBe(2);
    });

    it('without', () => {
      const base = SmartSet.fromArray([{ id: 1, name: 'A' }, { id: 2, name: 'B' }], keyById);
      const exclude = SmartSet.fromArray([{ id: 1, name: 'A' }], keyById);
      const result = base.without(exclude);
      expect(result.size).toBe(1);
      expect(result.toArray()[0].id).toBe(2);
    });
  });

  describe('🟣 New set operators', () => {
    it('overlaps', () => {
      const a = SmartSet.fromArray([{ id: 1, name: 'A' }, { id: 2, name: 'B' }], keyById);
      const b = SmartSet.fromArray([{ id: 2, name: 'C' }, { id: 3, name: 'D' }], keyById);
      const c = SmartSet.fromArray([{ id: 4, name: 'E' }], keyById);

      expect(a.overlaps(b)).toBe(true);  // share element with id=2
      expect(a.overlaps(c)).toBe(false); // no common elements
    });

    it('xor (alias for symmetricDifference)', () => {
      const a = SmartSet.fromArray([{ id: 1, name: 'A' }, { id: 2, name: 'B' }], keyById);
      const b = SmartSet.fromArray([{ id: 2, name: 'B' }, { id: 3, name: 'C' }], keyById);

      const result = a.xor(b);
      expect(result.toArray()).toEqual([
        { id: 1, name: 'A' },
        { id: 3, name: 'C' }
      ]);
    });

    it('filteredIntersection', () => {
      const a = SmartSet.fromArray(
        [{ id: 1, name: 'A' }, { id: 2, name: 'B' }, { id: 3, name: 'C' }],
        keyById
      );
      const b = SmartSet.fromArray(
        [{ id: 2, name: 'B' }, { id: 3, name: 'C' }],
        keyById
      );

      const result = a.filteredIntersection(b, item => item.name === 'B');
      expect(result.size).toBe(1);
      expect(result.toArray()[0]).toEqual({ id: 2, name: 'B' });
    });
  });

});
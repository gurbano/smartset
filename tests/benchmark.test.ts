#!/usr/bin/env ts-node

import { performance } from 'perf_hooks';
import { SmartSet } from '../src/SmartSet';

type User = { id: number; name: string };
const keyById = (u: User) => u.id;

class Benchmark {
  private iterations: number;

  constructor(iterations: number = 100000) {
    this.iterations = iterations;
  }

  private measure(name: string, fn: () => void) {
    const start = performance.now();
    fn();
    const end = performance.now();
    console.log(`${name.padEnd(35)} ${(end - start).toFixed(2)} ms`);
  }

  run() {
    const data: User[] = Array.from({ length: this.iterations }, (_, i) => ({
      id: i,
      name: `User-${i}`
    }));

    console.log(`\n=== BENCHMARK (${this.iterations} elements) ===\n`);

    // -----------------------------------------------------
    // INSERT
    // -----------------------------------------------------
    this.measure('SmartSet add()', () => {
      const ss = new SmartSet<User>(keyById);
      for (const item of data) ss.add(item);
    });

    this.measure('Native Set add()', () => {
      const s = new Set<number>();
      for (const item of data) s.add(item.id);
    });

    this.measure('Array push()', () => {
      const arr: User[] = [];
      for (const item of data) arr.push(item);
    });

    
    // Prepare for next benchmarks
    const ss = SmartSet.fromArray(data, keyById);
    const s = new Set(data.map(d => d.id));
    const arr = [...data];

    // -----------------------------------------------------
    // HAS
    // -----------------------------------------------------

    console.log('');
    console.log('');
    this.measure('SmartSet has()', () => {
      for (let i = 0; i < this.iterations; i++) ss.has({ id: i, name: '' });
    });

    this.measure('Native Set has()', () => {
      for (let i = 0; i < this.iterations; i++) s.has(i);
    });

    // this.measure('Array find()', () => {
    //   for (let i = 0; i < this.iterations; i++) arr.find(u => u.id === i);
    // });

    // -----------------------------------------------------
    // DELETE
    // -----------------------------------------------------

    console.log('');
    console.log('');
    this.measure('SmartSet delete()', () => {
      const tmp = SmartSet.fromArray(data, keyById);
      for (let i = 0; i < this.iterations; i++) tmp.delete({ id: i, name: '' });
    });

    this.measure('Native Set delete()', () => {
      const tmp = new Set(data.map(d => d.id));
      for (let i = 0; i < this.iterations; i++) tmp.delete(i);
    });

    // this.measure('Array filter (delete)', () => {
    //   let tmp = [...data];
    //   for (let i = 0; i < this.iterations; i++) {
    //     tmp = tmp.filter(u => u.id !== i);
    //   }
    // });

    // -----------------------------------------------------
    // CLONE
    // -----------------------------------------------------
    console.log('');
    console.log('');
    this.measure('SmartSet clone()', () => {
      ss.clone();
    });

    this.measure('Native Set clone (spread)', () => {
      new Set(s);
    });

    this.measure('Array clone (slice)', () => {
      arr.slice();
    });

    // -----------------------------------------------------
    // SET OPERATIONS
    // -----------------------------------------------------
    console.log('');
    console.log('');
    const half = Math.floor(this.iterations / 2);
    const dataA = data.slice(0, half);
    const dataB = data.slice(half);

    const ssA = SmartSet.fromArray(dataA, keyById);
    const ssB = SmartSet.fromArray(dataB, keyById);

    const sA = new Set(dataA.map(d => d.id));
    const sB = new Set(dataB.map(d => d.id));

    const arrA = [...dataA];
    const arrB = [...dataB];

    // UNION
    this.measure('SmartSet union()', () => {
      ssA.union(ssB);
    });

    this.measure('Native Set union()', () => {
      sA.union(sB);
    });
    
    // this.measure('Array union (concat+filter)', () => {
    //   [...arrA, ...arrB].filter(
    //     (v, i, self) => self.findIndex(u => u.id === v.id) === i
    //   );
    // });

    this.measure('Array union concat', () => {
      arrA.concat(arrB);
    });

    console.log('');
    console.log('');
    // INTERSECTION
    this.measure('SmartSet intersection()', () => {
      ssA.intersection(ssB);
    });

    this.measure('Native Set intersection()', () => {
      sA.intersection(sB);
    });

    // this.measure('Array intersection', () => {
    //   arrA.filter(a => arrB.find(b => b.id === a.id));
    // });

    console.log('');
    console.log('');
    // DIFFERENCE
    this.measure('SmartSet difference()', () => {
      ssA.difference(ssB);
    });

     this.measure('Native Set difference()', () => {
      sA.difference(sB);
    });
    // this.measure('Array difference', () => {
    //   arrA.filter(a => !arrB.find(b => b.id === a.id));
    // });

    console.log('');
    console.log('');

    // SYMMETRIC DIFFERENCE
    this.measure('SmartSet symmetricDifference()', () => {
      ssA.symmetricDifference(ssB);
    });

    this.measure('Native Set symmetricDifference()', () => {
      sA.symmetricDifference(sB);
    });

    console.log('');
    console.log('');

    // -----------------------------------------------------
    // ITERATION + MAP/FILTER
    // -----------------------------------------------------
    this.measure('SmartSet map()', () => {
      ss.map(x => x.name);
    });

    this.measure('Array map()', () => {
      arr.map(x => x.name);
    });

    console.log('');
    console.log('');


    this.measure('SmartSet filter()', () => {
      ss.filter(x => x.id % 2 === 0);
    });

    this.measure('Array filter()', () => {
      arr.filter(x => x.id % 2 === 0);
    });

    console.log('');
    console.log('');

    // Iteration
    this.measure('SmartSet iteration', () => {
      for (const x of ss) {
        void x.id;
      }
    });

    this.measure('Array iteration', () => {
      for (const x of arr) {
        void x.id;
      }
    });
  }
}

describe('index exports', () => {
  it('runs benchmark', () => {
    const benchmark = new Benchmark(1000 * 1000);
    benchmark.run();
  })
});


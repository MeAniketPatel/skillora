interface Counter {
  name: string;
  value: number;
  labels?: Record<string, string>;
}

const counters: Map<string, Counter> = new Map();

function key(name: string, labels?: Record<string, string>): string {
  if (!labels) return name;
  const sorted = Object.keys(labels).sort();
  return `${name}|${sorted.map((k) => `${k}=${labels[k]}`).join(",")}`;
}

export const metrics = {
  increment(name: string, labels?: Record<string, string>, by = 1) {
    const k = key(name, labels);
    const existing = counters.get(k);
    if (existing) {
      existing.value += by;
    } else {
      counters.set(k, { name, value: by, labels });
    }
  },
  gauge(name: string, value: number, labels?: Record<string, string>) {
    counters.set(key(name, labels), { name, value, labels });
  },
  snapshot(): Counter[] {
    return Array.from(counters.values());
  },
  reset() {
    counters.clear();
  },
};

export type { Counter };

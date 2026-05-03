import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

vi.mock("next/font/google", () => {
  const makeFont = () => (options: { variable?: string } = {}) => ({
    className: "",
    style: {},
    variable: options.variable ?? "",
  });

  return {
    Archivo: makeFont(),
    JetBrains_Mono: makeFont(),
    Newsreader: makeFont(),
    Roboto_Slab: makeFont(),
    Space_Grotesk: makeFont(),
  };
});

const createStorage = () => {
  const store = new Map<string, string>();

  return {
    clear: () => store.clear(),
    getItem: (key: string) => store.get(key) ?? null,
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    removeItem: (key: string) => {
      store.delete(key);
    },
    setItem: (key: string, value: string) => {
      store.set(key, String(value));
    },
    get length() {
      return store.size;
    },
  } satisfies Storage;
};

Object.defineProperty(window, "localStorage", {
  value: createStorage(),
  configurable: true,
});

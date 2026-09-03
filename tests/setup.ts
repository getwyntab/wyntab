import { vi } from 'vitest'
import '@testing-library/jest-dom/vitest'
import pkg from '../package.json'

// WebExtension browser API mock
const storageData: Record<string, any> = {}

const fakeStorageArea = {
  get: vi.fn(async (keys?: string | string[] | Record<string, any> | null) => {
    if (!keys) return { ...storageData }
    if (typeof keys === 'string') return { [keys]: storageData[keys] }
    if (Array.isArray(keys)) {
      const res: Record<string, any> = {}
      for (const k of keys) res[k] = storageData[k]
      return res
    }
    const res: Record<string, any> = { ...keys }
    for (const k of Object.keys(keys)) {
      if (storageData[k] !== undefined) res[k] = storageData[k]
    }
    return res
  }),
  set: vi.fn(async (items: Record<string, any>) => {
    Object.assign(storageData, items)
  }),
  remove: vi.fn(async (keys: string | string[]) => {
    const list = Array.isArray(keys) ? keys : [keys]
    for (const k of list) delete storageData[k]
  }),
  clear: vi.fn(async () => {
    for (const k of Object.keys(storageData)) delete storageData[k]
  }),
}

const browserMock = {
  runtime: {
    id: 'test-mock-id',
    getManifest: vi.fn(() => ({ version: pkg.version, name: pkg.name })),
    getURL: vi.fn((path: string) => `chrome-extension://mock-id${path}`),
    onInstalled: { addListener: vi.fn() },
  },
  action: {
    onClicked: { addListener: vi.fn() },
  },
  tabs: {
    create: vi.fn(async (opts: any) => ({ id: 1, ...opts })),
    query: vi.fn(async () => []),
    update: vi.fn(async (id: number, opts: any) => ({ id, ...opts })),
  },
  windows: {
    update: vi.fn(async (id: number, opts: any) => ({ id, ...opts })),
  },
  storage: {
    local: fakeStorageArea,
    onChanged: { addListener: vi.fn(), removeListener: vi.fn() },
  },
}

;(globalThis as any).browser = browserMock
;(globalThis as any).chrome = browserMock

// Stub Blob URL methods if missing
if (typeof URL.createObjectURL !== 'function') {
  URL.createObjectURL = vi.fn(() => 'blob:mock-preview-url')
}
if (typeof URL.revokeObjectURL !== 'function') {
  URL.revokeObjectURL = vi.fn()
}

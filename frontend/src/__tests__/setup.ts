/**
 * Jest test environment setup
 */

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

global.localStorage = localStorageMock as any;

// Mock crypto.subtle for tests
if (!global.crypto) {
  global.crypto = {} as any;
}

if (!global.crypto.subtle) {
  global.crypto.subtle = {
    importKey: jest.fn(),
    deriveKey: jest.fn(),
    deriveBits: jest.fn(),
    encrypt: jest.fn(),
    decrypt: jest.fn(),
    sign: jest.fn(),
    verify: jest.fn(),
  };
}

// Mock fetch
global.fetch = jest.fn();

// Suppress console warnings during tests
beforeEach(() => {
  jest.clearAllMocks();
  localStorageMock.getItem.mockClear();
  localStorageMock.setItem.mockClear();
  localStorageMock.removeItem.mockClear();
});

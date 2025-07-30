import { vi } from 'vitest';

// Mock Convex client
export const mockConvexClient = {
  query: vi.fn(),
  mutation: vi.fn(),
  action: vi.fn(),
};

// Mock useConvexAuth
export const mockUseConvexAuth = vi.fn(() => ({
  isAuthenticated: false,
  isLoading: false,
}));

// Mock useAuthActions
export const mockUseAuthActions = vi.fn(() => ({
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

// Mock useQuery
export const mockUseQuery = vi.fn();

// Mock user identity
export const mockUserIdentity = {
  tokenIdentifier: 'test-token',
  subject: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
};

// Mock auth context
export const mockAuthContext = {
  getUserIdentity: vi.fn().mockResolvedValue(mockUserIdentity),
  getUserId: vi.fn().mockReturnValue('test-user-id'),
};

// Mock Convex database context
export const mockDbContext = {
  auth: mockAuthContext,
  db: {
    insert: vi.fn(),
    get: vi.fn(),
    query: vi.fn(() => ({
      filter: vi.fn().mockReturnThis(),
      unique: vi.fn(),
      collect: vi.fn(),
      first: vi.fn(),
    })),
    patch: vi.fn(),
    delete: vi.fn(),
  },
};

// Test data factories
export const createTestUser = (overrides = {}) => ({
  _id: 'test-user-id',
  _creationTime: Date.now(),
  email: 'test@example.com',
  name: 'Test User',
  tokenIdentifier: 'test-token',
  ...overrides,
});

export const createTestFormData = (overrides = {}) => {
  const formData = new FormData();
  const defaults = {
    email: 'test@example.com',
    name: 'Test User',
    password: 'password123',
    flow: 'signUp',
    ...overrides,
  };
  
  Object.entries(defaults).forEach(([key, value]) => {
    formData.set(key, value);
  });
  
  return formData;
};
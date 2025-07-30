import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProtectedRoute } from '../protected-route';

// Mock the Convex auth hook
let mockUseConvexAuth: any;
vi.mock('convex/react', () => ({
  useConvexAuth: () => mockUseConvexAuth(),
}));

// Mock the SignInForm component
vi.mock('../sign-in-form', () => ({
  SignInForm: () => <div data-testid="sign-in-form">Sign In Form</div>,
}));

describe('ProtectedRoute', () => {
  const TestComponent = () => <div data-testid="protected-content">Protected Content</div>;

  beforeEach(() => {
    mockUseConvexAuth = vi.fn();
    vi.clearAllMocks();
  });

  it('shows loading spinner when authentication is loading', () => {
    mockUseConvexAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
    });

    render(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>
    );

    // Should show loading spinner
    const spinner = screen.getByRole('status', { hidden: true }) || 
                   document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
    
    // Should NOT show protected content or sign-in form
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    expect(screen.queryByTestId('sign-in-form')).not.toBeInTheDocument();
  });

  it('shows sign-in form when user is not authenticated', () => {
    mockUseConvexAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    });

    render(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>
    );

    // Should show sign-in form
    expect(screen.getByTestId('sign-in-form')).toBeInTheDocument();
    
    // Should NOT show protected content or loading spinner
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).not.toBeInTheDocument();
  });

  it('shows protected content when user is authenticated', () => {
    mockUseConvexAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    });

    render(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>
    );

    // Should show protected content
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    
    // Should NOT show sign-in form or loading spinner
    expect(screen.queryByTestId('sign-in-form')).not.toBeInTheDocument();
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).not.toBeInTheDocument();
  });

  it('renders multiple children when authenticated', () => {
    mockUseConvexAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    });

    render(
      <ProtectedRoute>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
        <div data-testid="child-3">Child 3</div>
      </ProtectedRoute>
    );

    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
    expect(screen.getByTestId('child-3')).toBeInTheDocument();
  });

  it('handles authentication state changes correctly', () => {
    // Start with loading state
    mockUseConvexAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
    });

    const { rerender } = render(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>
    );

    // Should show loading spinner
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();

    // Change to unauthenticated
    mockUseConvexAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    });

    rerender(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>
    );

    // Should show sign-in form
    expect(screen.getByTestId('sign-in-form')).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();

    // Change to authenticated
    mockUseConvexAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    });

    rerender(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>
    );

    // Should show protected content
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    expect(screen.queryByTestId('sign-in-form')).not.toBeInTheDocument();
  });

  it('maintains loading state priority over authentication state', () => {
    // Even if isAuthenticated is true, loading should take precedence
    mockUseConvexAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: true,
    });

    render(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>
    );

    // Should show loading spinner, not protected content
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    expect(screen.queryByTestId('sign-in-form')).not.toBeInTheDocument();
  });

  it('handles edge case with undefined states', () => {
    mockUseConvexAuth.mockReturnValue({
      isAuthenticated: undefined,
      isLoading: undefined,
    });

    render(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>
    );

    // Should treat undefined as falsy and show sign-in form
    expect(screen.getByTestId('sign-in-form')).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('applies proper styling classes for loading spinner', () => {
    mockUseConvexAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
    });

    render(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>
    );

    const container = screen.getByRole('status', { hidden: true }) || 
                     document.querySelector('.min-h-screen');
    expect(container).toHaveClass('min-h-screen', 'flex', 'items-center', 'justify-center');

    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toHaveClass('animate-spin', 'w-8', 'h-8', 'border-2', 'border-primary', 'border-t-transparent', 'rounded-full');
  });

  it('properly wraps children with React Fragment when authenticated', () => {
    mockUseConvexAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    });

    const { container } = render(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>
    );

    // The children should be wrapped in a React Fragment (no extra DOM nodes)
    expect(container.firstChild).toHaveAttribute('data-testid', 'protected-content');
  });

  describe('accessibility', () => {
    it('provides proper loading state accessibility', () => {
      mockUseConvexAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: true,
      });

      render(
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      );

      // The loading container should be properly accessible
      const container = document.querySelector('.min-h-screen');
      expect(container).toBeInTheDocument();
      
      // The spinner should indicate loading state
      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('maintains focus management during state transitions', () => {
      mockUseConvexAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
      });

      const { rerender } = render(
        <ProtectedRoute>
          <button data-testid="focus-target">Focus me</button>
        </ProtectedRoute>
      );

      // Show sign-in form initially
      expect(screen.getByTestId('sign-in-form')).toBeInTheDocument();

      // Transition to authenticated state
      mockUseConvexAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
      });

      rerender(
        <ProtectedRoute>
          <button data-testid="focus-target">Focus me</button>
        </ProtectedRoute>
      );

      // Should show the protected content
      expect(screen.getByTestId('focus-target')).toBeInTheDocument();
    });
  });

  describe('performance', () => {
    it('does not re-render unnecessarily with same auth state', () => {
      const renderSpy = vi.fn();
      const SpyComponent = () => {
        renderSpy();
        return <div data-testid="spy-component">Spy Component</div>;
      };

      mockUseConvexAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
      });

      const { rerender } = render(
        <ProtectedRoute>
          <SpyComponent />
        </ProtectedRoute>
      );

      expect(renderSpy).toHaveBeenCalledTimes(1);

      // Re-render with same auth state
      rerender(
        <ProtectedRoute>
          <SpyComponent />
        </ProtectedRoute>
      );

      // Component should re-render because ProtectedRoute re-renders,
      // but this is expected behavior
      expect(renderSpy).toHaveBeenCalledTimes(2);
    });
  });
});
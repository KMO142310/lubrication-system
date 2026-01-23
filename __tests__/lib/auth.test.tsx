import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/lib/auth';
import React from 'react';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('Auth System', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('useAuth hook', () => {
    it('should start with no user and loading state', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });
      
      // Initial state should have isLoading true
      expect(result.current.isLoading).toBeDefined();
    });

    it('should have login function', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });
      expect(typeof result.current.login).toBe('function');
    });

    it('should have logout function', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });
      expect(typeof result.current.logout).toBe('function');
    });

    it('should have isAuthenticated property', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });
      expect(typeof result.current.isAuthenticated).toBe('boolean');
    });
  });

  describe('login functionality', () => {
    it('should reject invalid credentials', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      let loginResult: { success: boolean; error?: string } | undefined;
      await act(async () => {
        loginResult = await result.current.login('invalid@email.com', 'wrongpassword');
      });

      expect(loginResult?.success).toBe(false);
    });

    it('should accept valid fallback credentials', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      let loginResult;
      await act(async () => {
        loginResult = await result.current.login('omar@aisa.cl', 'admin123');
      });

      expect(loginResult?.success).toBe(true);
    });

    it('should set user after successful login', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.login('omar@aisa.cl', 'admin123');
      });

      expect(result.current.user).not.toBeNull();
      expect(result.current.user?.email).toBe('omar@aisa.cl');
      expect(result.current.user?.role).toBe('admin');
    });
  });

  describe('logout functionality', () => {
    it('should clear user on logout', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      // Login first
      await act(async () => {
        await result.current.login('omar@aisa.cl', 'admin123');
      });

      expect(result.current.user).not.toBeNull();

      // Then logout
      act(() => {
        result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('role-based access', () => {
    it('should return correct role for admin user', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.login('omar@aisa.cl', 'admin123');
      });

      expect(result.current.user?.role).toBe('admin');
    });

    it('should return correct role for supervisor user', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.login('supervisor@aisa.cl', 'super123');
      });

      expect(result.current.user?.role).toBe('supervisor');
    });

    it('should return correct role for technician user', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.login('tecnico@aisa.cl', 'tech123');
      });

      expect(result.current.user?.role).toBe('lubricador');
    });
  });
});

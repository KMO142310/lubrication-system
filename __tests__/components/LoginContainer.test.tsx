import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginContainer from '@/components/auth/LoginContainer';
import React from 'react';

// Mocks
const mockLogin = jest.fn();
const mockLoginWithGoogle = jest.fn();
const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: mockPush }),
}));

jest.mock('@/lib/auth', () => ({
    useAuth: () => ({
        login: mockLogin,
        loginWithGoogle: mockLoginWithGoogle,
    }),
}));

describe('LoginContainer', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render Google login by default', () => {
        render(<LoginContainer />);
        expect(screen.getByText('Continuar con Google')).toBeInTheDocument();
        expect(screen.getByText('AISA Lubricación')).toBeInTheDocument();
    });

    it('should call loginWithGoogle when button is clicked', async () => {
        mockLoginWithGoogle.mockResolvedValue({ success: true });
        render(<LoginContainer />);

        const googleBtn = screen.getByText('Continuar con Google');
        fireEvent.click(googleBtn);

        expect(mockLoginWithGoogle).toHaveBeenCalled();
    });

    it('should switch to password mode when clicking fallback link', () => {
        render(<LoginContainer />);

        const switchBtn = screen.getByText('¿Problemas? Usar contraseña');
        fireEvent.click(switchBtn);

        expect(screen.getByPlaceholderText('tu@email.com')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    });

    it('should call login with credentials', async () => {
        mockLogin.mockResolvedValue({ success: true });
        render(<LoginContainer />);

        // Switch to password mode
        const switchBtn = screen.getByText('¿Problemas? Usar contraseña');
        fireEvent.click(switchBtn);

        // Fill in credentials
        const emailInput = screen.getByPlaceholderText('tu@email.com');
        const passwordInput = screen.getByPlaceholderText('••••••••');

        fireEvent.change(emailInput, { target: { value: 'dev@aisa.cl' } });
        fireEvent.change(passwordInput, { target: { value: 'dev2026!' } });

        // Submit
        const loginBtn = screen.getByText('Iniciar Sesión');
        await act(async () => {
            fireEvent.click(loginBtn);
        });

        expect(mockLogin).toHaveBeenCalledWith('dev@aisa.cl', 'dev2026!');
    });

    it('should show error on failed login', async () => {
        mockLogin.mockResolvedValue({ success: false, error: 'Credenciales inválidas' });
        render(<LoginContainer />);

        // Switch to password mode
        const switchBtn = screen.getByText('¿Problemas? Usar contraseña');
        fireEvent.click(switchBtn);

        // Fill in wrong credentials
        const emailInput = screen.getByPlaceholderText('tu@email.com');
        const passwordInput = screen.getByPlaceholderText('••••••••');

        fireEvent.change(emailInput, { target: { value: 'wrong@email.com' } });
        fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });

        // Submit
        const loginBtn = screen.getByText('Iniciar Sesión');
        await act(async () => {
            fireEvent.click(loginBtn);
        });

        expect(await screen.findByText('Credenciales inválidas')).toBeInTheDocument();
    });

    it('should show back to biometric button in password mode', () => {
        render(<LoginContainer />);

        // Switch to password mode
        const switchBtn = screen.getByText('¿Problemas? Usar contraseña');
        fireEvent.click(switchBtn);

        expect(screen.getByText('← Volver a Biometría')).toBeInTheDocument();
    });
});

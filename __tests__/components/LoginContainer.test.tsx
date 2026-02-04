import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginContainer from '@/components/auth/LoginContainer';
import React from 'react';

// Mocks
const mockLogin = jest.fn();
const mockLoginWithGoogle = jest.fn();
const mockLoginWithPasskey = jest.fn();
const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: mockPush }),
}));

jest.mock('@/lib/auth', () => ({
    useAuth: () => ({
        login: mockLogin,
        loginWithGoogle: mockLoginWithGoogle,
        loginWithPasskey: mockLoginWithPasskey,
    }),
}));

describe('LoginContainer', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render biometric/google login by default', () => {
        render(<LoginContainer />);

        expect(screen.getByText('Ingresar con Huella / FaceID')).toBeInTheDocument();
        expect(screen.getByText('Google Workspace')).toBeInTheDocument();
    });

    it('should call loginWithGoogle when button is clicked', async () => {
        mockLoginWithGoogle.mockResolvedValue({ success: true });
        render(<LoginContainer />);

        const googleBtn = screen.getByText('Google Workspace');
        fireEvent.click(googleBtn);

        expect(mockLoginWithGoogle).toHaveBeenCalled();
    });

    it('should show error if biometric login fails without email', async () => {
        render(<LoginContainer />);

        const bioBtn = screen.getByText('Ingresar con Huella / FaceID');
        fireEvent.click(bioBtn);

        expect(await screen.findByText('Ingresa tu email para identificar tu Passkey')).toBeInTheDocument();
    });

    it('should call loginWithPasskey when email is provided', async () => {
        mockLoginWithPasskey.mockResolvedValue({ success: true });
        render(<LoginContainer />);

        const emailInput = screen.getByPlaceholderText('tu@email.com');
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

        const bioBtn = screen.getByText('Ingresar con Huella / FaceID');
        await act(async () => {
            fireEvent.click(bioBtn);
        });

        expect(mockLoginWithPasskey).toHaveBeenCalledWith('test@example.com');
        expect(mockPush).toHaveBeenCalledWith('/');
    });

    it('should switch to legacy password mode', () => {
        render(<LoginContainer />);

        const switchBtn = screen.getByText('Usar contraseña tradicional');
        fireEvent.click(switchBtn);

        expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
        expect(screen.queryByText('Google Workspace')).not.toBeInTheDocument();
    });
});

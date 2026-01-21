import { useState, type FormEvent } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from '../services/api';
import PasswordStrength, { validatePassword } from '../components/PasswordStrength';
import './ResetPassword.css';

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token') || '';

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        const validation = validatePassword(password);
        if (!validation.isValid) {
            setError('Password does not meet requirements');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, new_password: password })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => navigate('/'), 3000);
            } else {
                setError(data.detail || 'Failed to reset password');
            }
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="reset-password-page">
                <div className="reset-card">
                    <div className="reset-icon error-icon">❌</div>
                    <h1>Invalid Link</h1>
                    <p>This password reset link is invalid or has expired.</p>
                    <Link to="/forgot-password" className="reset-btn-link">Request New Link</Link>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="reset-password-page">
                <div className="reset-card">
                    <div className="reset-icon success-icon">✅</div>
                    <h1>Password Reset!</h1>
                    <p>Your password has been successfully reset.</p>
                    <p className="redirect-text">Redirecting to login...</p>
                </div>
            </div>
        );
    }

    const passwordsMatch = confirmPassword === '' || password === confirmPassword;

    return (
        <div className="reset-password-page">
            <div className="reset-card">
                <div className="reset-icon">🔑</div>
                <h1>Create New Password</h1>
                <p>Enter your new password below</p>

                {error && <div className="reset-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>New Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Create a strong password"
                            required
                            autoFocus
                        />
                        <PasswordStrength password={password} />
                    </div>

                    <div className="form-group">
                        <label>Confirm Password</label>
                        <div className={`input-with-indicator ${!passwordsMatch ? 'input-error' : ''}`}>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                placeholder="Confirm your password"
                                required
                            />
                            {confirmPassword && (
                                <span className={`match-indicator ${passwordsMatch ? 'match' : 'no-match'}`}>
                                    {passwordsMatch ? '✓' : '✗'}
                                </span>
                            )}
                        </div>
                    </div>

                    <button type="submit" className="reset-btn" disabled={loading}>
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>

                <Link to="/" className="back-link">← Back to Login</Link>
            </div>
        </div>
    );
}

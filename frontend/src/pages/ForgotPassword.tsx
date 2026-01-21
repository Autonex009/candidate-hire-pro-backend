import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../services/api';
import './ForgotPassword.css';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            if (response.ok) {
                setSubmitted(true);
            } else {
                setError('Something went wrong. Please try again.');
            }
        } catch {
            setError('Failed to send reset email. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="forgot-password-page">
                <div className="forgot-card success-card">
                    <div className="success-icon">✉️</div>
                    <h1>Check Your Email</h1>
                    <p>
                        If an account exists for <strong>{email}</strong>,
                        we've sent a password reset link.
                    </p>
                    <p className="check-spam">Don't see it? Check your spam folder.</p>
                    <Link to="/" className="back-to-login">Back to Login</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="forgot-password-page">
            <div className="forgot-card">
                <div className="forgot-icon">🔐</div>
                <h1>Forgot Password?</h1>
                <p>No worries! Enter your email and we'll send you a reset link.</p>

                {error && <div className="forgot-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                            autoFocus
                        />
                    </div>

                    <button type="submit" className="forgot-btn" disabled={loading}>
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>

                <Link to="/" className="back-link">← Back to Login</Link>
            </div>
        </div>
    );
}

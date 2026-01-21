import { useMemo } from 'react';
import './PasswordStrength.css';

interface PasswordStrengthProps {
    password: string;
    showRequirements?: boolean;
}

interface PasswordRule {
    id: string;
    label: string;
    test: (password: string) => boolean;
}

const passwordRules: PasswordRule[] = [
    { id: 'length', label: 'At least 8 characters', test: (p) => p.length >= 8 },
    { id: 'uppercase', label: 'One uppercase letter (A-Z)', test: (p) => /[A-Z]/.test(p) },
    { id: 'lowercase', label: 'One lowercase letter (a-z)', test: (p) => /[a-z]/.test(p) },
    { id: 'number', label: 'One number (0-9)', test: (p) => /[0-9]/.test(p) },
    { id: 'special', label: 'One special character (!@#$%^&*)', test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors = passwordRules
        .filter(rule => !rule.test(password))
        .map(rule => rule.label);
    return { isValid: errors.length === 0, errors };
}

export default function PasswordStrength({ password, showRequirements = true }: PasswordStrengthProps) {
    const results = useMemo(() => {
        return passwordRules.map(rule => ({
            ...rule,
            passed: rule.test(password)
        }));
    }, [password]);

    const passedCount = results.filter(r => r.passed).length;
    const totalRules = passwordRules.length;
    const strengthPercentage = (passedCount / totalRules) * 100;

    const getStrengthLabel = () => {
        if (password.length === 0) return { label: '', color: 'gray' };
        if (passedCount <= 1) return { label: 'Very Weak', color: '#dc3545' };
        if (passedCount <= 2) return { label: 'Weak', color: '#fd7e14' };
        if (passedCount <= 3) return { label: 'Fair', color: '#ffc107' };
        if (passedCount <= 4) return { label: 'Good', color: '#20c997' };
        return { label: 'Strong', color: '#28a745' };
    };

    const strength = getStrengthLabel();

    if (password.length === 0) return null;

    return (
        <div className="password-strength">
            <div className="strength-meter">
                <div className="strength-bar">
                    <div
                        className="strength-fill"
                        style={{
                            width: `${strengthPercentage}%`,
                            backgroundColor: strength.color
                        }}
                    />
                </div>
                <span className="strength-label" style={{ color: strength.color }}>
                    {strength.label}
                </span>
            </div>

            {showRequirements && (
                <div className="password-requirements">
                    {results.map(rule => (
                        <div
                            key={rule.id}
                            className={`requirement ${rule.passed ? 'passed' : 'failed'}`}
                        >
                            <span className="requirement-icon">
                                {rule.passed ? '✓' : '✗'}
                            </span>
                            <span className="requirement-text">{rule.label}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

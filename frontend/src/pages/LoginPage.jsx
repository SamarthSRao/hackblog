import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authAPI, setAuthToken, setStoredUser } from "../services/api";
import api from '../services/api';


function LoginPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        if (!email || !password) {
            setError("Please enter both email and password");
            return;
        }
        setIsLoading(true);
        try {
            const data = await authAPI.login(email, password); // This might be a promise that resolves to data

            // The mock API returns data directly, but axios returns {data: ...}
            // Adjust based on actual API implementation. Assuming authAPI handles standardizing response.
            if (data?.token) {
                setAuthToken(data.token);
                if (data.user) setStoredUser(data.user);

                navigate('/', { replace: true });
            }
            else {
                throw new Error("Invalid response from server");
            }
        } catch (err) {
            setError(err.response?.data?.error || err.message || "Login Failed");
        }
        finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const checkToken = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    await api.get('/auth/me'); // Check if token is valid
                    navigate('/', { replace: true });
                } catch (err) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }
            setIsLoading(false);
        };
        checkToken();
    }, [navigate]);

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loading-text">Loading...</div>
            </div>
        );
    }

    return (
        <div className="login-container">
            <div className="login-box">
                <h2 className="login-title">Login</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label className="form-label">Email or Username</label>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-input"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-input"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="submit-button"
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
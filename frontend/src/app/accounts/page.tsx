"use client";

import { useState, FormEvent } from "react";

interface AccountData {
    accountNo: string;
    holderName: string;
    balance: number;
    isKYCVerified: boolean;
    createdAt: string;
}

export default function CreateAccountPage() {
    const [holderName, setHolderName] = useState("");
    const [isKYCVerified, setIsKYCVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const [successData, setSuccessData] = useState<AccountData | null>(null);
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccessData(null);
        setErrorMsg("");

        try {
            const res = await fetch("http://localhost:5000/api/accounts/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ holderName, isKYCVerified }),
            });

            const json = await res.json();

            if (!res.ok) {
                setErrorMsg(json.message || "Something went wrong.");
            } else {
                setSuccessData(json.data);
                setHolderName("");
                setIsKYCVerified(false);
            }
        } catch {
            setErrorMsg("Could not connect to the server. Make sure the backend is running.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{`
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

                body {
                    background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
                    min-height: 100vh;
                    font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
                    color: #e2e8f0;
                }

                .page {
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem 1rem;
                }

                .header {
                    text-align: center;
                    margin-bottom: 2.5rem;
                }

                .header h1 {
                    font-size: 2rem;
                    font-weight: 800;
                    background: linear-gradient(90deg, #a78bfa, #60a5fa);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    letter-spacing: -0.5px;
                }

                .header p {
                    margin-top: 0.5rem;
                    color: #94a3b8;
                    font-size: 0.95rem;
                }

                .card {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(20px);
                    border-radius: 1.25rem;
                    padding: 2.5rem;
                    width: 100%;
                    max-width: 440px;
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
                }

                .form-group {
                    margin-bottom: 1.5rem;
                }

                label {
                    display: block;
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: #cbd5e1;
                    margin-bottom: 0.5rem;
                    letter-spacing: 0.4px;
                    text-transform: uppercase;
                }

                input[type="text"] {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    background: rgba(255, 255, 255, 0.07);
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    border-radius: 0.75rem;
                    color: #f1f5f9;
                    font-size: 1rem;
                    outline: none;
                    transition: border-color 0.2s, box-shadow 0.2s;
                }

                input[type="text"]:focus {
                    border-color: #a78bfa;
                    box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.2);
                }

                .checkbox-row {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    cursor: pointer;
                }

                input[type="checkbox"] {
                    width: 1.15rem;
                    height: 1.15rem;
                    accent-color: #a78bfa;
                    cursor: pointer;
                }

                .checkbox-label {
                    font-size: 0.9rem;
                    font-weight: 500;
                    color: #cbd5e1;
                    text-transform: none;
                    letter-spacing: 0;
                    margin-bottom: 0;
                }

                button[type="submit"] {
                    width: 100%;
                    padding: 0.85rem;
                    background: linear-gradient(135deg, #7c3aed, #4f46e5);
                    color: white;
                    font-size: 1rem;
                    font-weight: 700;
                    border: none;
                    border-radius: 0.75rem;
                    cursor: pointer;
                    transition: opacity 0.2s, transform 0.15s;
                    margin-top: 0.5rem;
                    letter-spacing: 0.3px;
                }

                button[type="submit"]:hover:not(:disabled) {
                    opacity: 0.9;
                    transform: translateY(-1px);
                }

                button[type="submit"]:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .alert {
                    margin-top: 1.5rem;
                    padding: 1.25rem 1.5rem;
                    border-radius: 0.75rem;
                    font-size: 0.9rem;
                }

                .alert-success {
                    background: rgba(16, 185, 129, 0.12);
                    border: 1px solid rgba(16, 185, 129, 0.35);
                    color: #6ee7b7;
                }

                .alert-error {
                    background: rgba(239, 68, 68, 0.12);
                    border: 1px solid rgba(239, 68, 68, 0.35);
                    color: #fca5a5;
                }

                .account-detail {
                    display: flex;
                    justify-content: space-between;
                    padding: 0.3rem 0;
                    border-bottom: 1px solid rgba(255,255,255,0.06);
                    font-size: 0.88rem;
                }

                .account-detail:last-child { border-bottom: none; }
                .account-detail span:first-child { color: #94a3b8; }
                .account-detail span:last-child { font-weight: 600; color: #e2e8f0; }

                .success-title {
                    font-weight: 700;
                    font-size: 1rem;
                    margin-bottom: 0.75rem;
                    color: #6ee7b7;
                }
            `}</style>

            <div className="page">
                <div className="header">
                    <h1>🏦 Online Bank Mini System</h1>
                    <p>Open a new account in seconds</p>
                </div>

                <div className="card">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="holderName">Holder Name</label>
                            <input
                                id="holderName"
                                type="text"
                                placeholder="e.g. Prashant Kushwaha"
                                value={holderName}
                                onChange={(e) => setHolderName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>KYC Verification</label>
                            <div className="checkbox-row" onClick={() => setIsKYCVerified(!isKYCVerified)}>
                                <input
                                    id="kycVerified"
                                    type="checkbox"
                                    checked={isKYCVerified}
                                    onChange={(e) => setIsKYCVerified(e.target.checked)}
                                />
                                <label htmlFor="kycVerified" className="checkbox-label">
                                    KYC Verified
                                </label>
                            </div>
                        </div>

                        <button type="submit" disabled={loading}>
                            {loading ? "Creating Account…" : "Create Account"}
                        </button>
                    </form>

                    {errorMsg && (
                        <div className="alert alert-error">
                            ✗ {errorMsg}
                        </div>
                    )}

                    {successData && (
                        <div className="alert alert-success">
                            <div className="success-title">✓ Account Created Successfully!</div>
                            <div className="account-detail">
                                <span>Account No</span>
                                <span>{successData.accountNo}</span>
                            </div>
                            <div className="account-detail">
                                <span>Holder</span>
                                <span>{successData.holderName}</span>
                            </div>
                            <div className="account-detail">
                                <span>Balance</span>
                                <span>₹{successData.balance.toLocaleString()}</span>
                            </div>
                            <div className="account-detail">
                                <span>KYC</span>
                                <span>{successData.isKYCVerified ? "✓ Verified" : "✗ Not Verified"}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

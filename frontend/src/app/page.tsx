"use client";

import { useEffect, useState, useCallback } from "react";
import Nav from "@/components/Nav";

interface Account {
    _id: string;
    accountNo: string;
    holderName: string;
    balance: number;
    isKYCVerified: boolean;
    createdAt: string;
}

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AccountListingPage() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchAccounts = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`${API}/api/accounts`);
            if (!res.ok) throw new Error(`Server responded with ${res.status}`);
            const json = await res.json();
            setAccounts(json.data ?? []);
        } catch (err: any) {
            setError(err.message || "Failed to load accounts.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchAccounts(); }, [fetchAccounts]);

    return (
        <>
            <style>{`
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

                body {
                    background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
                    min-height: 100vh;
                    font-family: 'Inter','Segoe UI',system-ui,sans-serif;
                    color: #e2e8f0;
                }

                .page {
                    min-height: 100vh;
                    padding: 3rem 1.5rem 4rem;
                    max-width: 1000px;
                    margin: 0 auto;
                }

                .header { text-align: center; margin-bottom: 2.5rem; }

                .header h1 {
                    font-size: 2rem;
                    font-weight: 800;
                    background: linear-gradient(90deg, #a78bfa, #60a5fa);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .header p { margin-top: 0.5rem; color: #94a3b8; font-size: 0.95rem; }

                .toolbar {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 1.25rem;
                    flex-wrap: wrap;
                    gap: 0.75rem;
                }

                .toolbar-title {
                    font-size: 0.78rem;
                    font-weight: 700;
                    letter-spacing: 1.2px;
                    text-transform: uppercase;
                    color: #64748b;
                }

                .count-badge {
                    background: rgba(167,139,250,0.15);
                    border: 1px solid rgba(167,139,250,0.3);
                    color: #a78bfa;
                    font-size: 0.78rem;
                    font-weight: 700;
                    padding: 0.2rem 0.65rem;
                    border-radius: 99px;
                }

                .btn-refresh {
                    padding: 0.45rem 1rem;
                    background: rgba(255,255,255,0.06);
                    border: 1px solid rgba(255,255,255,0.12);
                    border-radius: 0.6rem;
                    color: #94a3b8;
                    font-size: 0.82rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                }
                .btn-refresh:hover { color: #e2e8f0; border-color: rgba(255,255,255,0.25); }

                .table-wrap {
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.09);
                    border-radius: 1.1rem;
                    overflow: hidden;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.35);
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                }

                thead tr {
                    background: rgba(255,255,255,0.04);
                    border-bottom: 1px solid rgba(255,255,255,0.08);
                }

                th {
                    padding: 0.9rem 1.25rem;
                    text-align: left;
                    font-size: 0.72rem;
                    font-weight: 700;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    color: #64748b;
                }

                tbody tr {
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                    transition: background 0.15s;
                }
                tbody tr:last-child { border-bottom: none; }
                tbody tr:hover { background: rgba(255,255,255,0.035); }

                td {
                    padding: 1rem 1.25rem;
                    font-size: 0.88rem;
                    vertical-align: middle;
                }

                .td-accno {
                    font-family: 'Courier New', monospace;
                    font-size: 0.8rem;
                    color: #a78bfa;
                    letter-spacing: 0.3px;
                }

                .td-name { font-weight: 600; color: #f1f5f9; }

                .td-balance { font-weight: 700; color: #e2e8f0; }

                .kyc-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.3rem;
                    padding: 0.2rem 0.65rem;
                    border-radius: 99px;
                    font-size: 0.75rem;
                    font-weight: 700;
                }
                .kyc-yes { background: rgba(52,211,153,0.15); color: #34d399; border: 1px solid rgba(52,211,153,0.25); }
                .kyc-no  { background: rgba(239,68,68,0.12);  color: #f87171; border: 1px solid rgba(239,68,68,0.2); }

                .state-box {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 200px;
                    gap: 1rem;
                    padding: 2rem;
                }

                .spinner {
                    width: 36px;
                    height: 36px;
                    border: 3px solid rgba(167,139,250,0.2);
                    border-top-color: #a78bfa;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }

                @keyframes spin { to { transform: rotate(360deg); } }

                .state-text { color: #64748b; font-size: 0.9rem; }

                .error-box {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.75rem;
                    min-height: 200px;
                    justify-content: center;
                }
                .error-icon { font-size: 2rem; }
                .error-msg { color: #f87171; font-size: 0.9rem; text-align: center; max-width: 320px; }

                .empty-box {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.75rem;
                    min-height: 200px;
                    justify-content: center;
                }
                .empty-icon { font-size: 2.5rem; opacity: 0.4; }
                .empty-text { color: #475569; font-size: 0.9rem; }
            `}</style>

            <div className="page">
                <div className="header">
                    <h1>🏦 Online Bank Mini System</h1>
                    <p>Manage accounts and transactions</p>
                </div>

                <Nav />

                <div className="toolbar">
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <span className="toolbar-title">All Accounts</span>
                        {!loading && !error && (
                            <span className="count-badge">{accounts.length} total</span>
                        )}
                    </div>
                    <button className="btn-refresh" onClick={fetchAccounts} disabled={loading}>
                        ↻ Refresh
                    </button>
                </div>

                <div className="table-wrap">
                    {loading && (
                        <div className="state-box">
                            <div className="spinner" />
                            <span className="state-text">Loading accounts…</span>
                        </div>
                    )}

                    {!loading && error && (
                        <div className="state-box error-box">
                            <span className="error-icon">⚠</span>
                            <span className="error-msg">{error}</span>
                            <button className="btn-refresh" onClick={fetchAccounts}>Try again</button>
                        </div>
                    )}

                    {!loading && !error && accounts.length === 0 && (
                        <div className="state-box empty-box">
                            <span className="empty-icon">🏦</span>
                            <span className="empty-text">No accounts yet. Create one to get started.</span>
                        </div>
                    )}

                    {!loading && !error && accounts.length > 0 && (
                        <table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Account No</th>
                                    <th>Holder Name</th>
                                    <th>Balance</th>
                                    <th>KYC Status</th>
                                    <th>Created</th>
                                </tr>
                            </thead>
                            <tbody>
                                {accounts.map((acc, idx) => (
                                    <tr key={acc._id}>
                                        <td style={{ color: "#475569", fontSize: "0.78rem" }}>{idx + 1}</td>
                                        <td className="td-accno">{acc.accountNo}</td>
                                        <td className="td-name">{acc.holderName}</td>
                                        <td className="td-balance">₹{acc.balance.toLocaleString()}</td>
                                        <td>
                                            {acc.isKYCVerified
                                                ? <span className="kyc-badge kyc-yes">✓ Verified</span>
                                                : <span className="kyc-badge kyc-no">✗ Pending</span>
                                            }
                                        </td>
                                        <td style={{ color: "#64748b", fontSize: "0.8rem" }}>
                                            {new Date(acc.createdAt).toLocaleDateString("en-IN", {
                                                day: "2-digit", month: "short", year: "numeric",
                                            })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </>
    );
}

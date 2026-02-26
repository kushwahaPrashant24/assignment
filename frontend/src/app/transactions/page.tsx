"use client";

import { useState, FormEvent } from "react";
import Nav from "@/components/Nav";

interface TransactionResult {
    accountNo: string;
    holderName: string;
    balance: number;
}

type TxType = "deposit" | "withdraw";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function TransactionPage() {
    const [accountNo, setAccountNo] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState<TxType | null>(null);
    const [result, setResult] = useState<TransactionResult | null>(null);
    const [lastTx, setLastTx] = useState<{ type: TxType; amount: number } | null>(null);
    const [errorMsg, setErrorMsg] = useState("");

    const handleTransaction = async (type: TxType, e?: FormEvent) => {
        e?.preventDefault();
        const parsedAmount = parseFloat(amount);

        if (!accountNo.trim()) { setErrorMsg("Please enter an account number."); return; }
        if (isNaN(parsedAmount) || parsedAmount <= 0) { setErrorMsg("Please enter a valid positive amount."); return; }

        setLoading(type);
        setResult(null);
        setErrorMsg("");

        try {
            const res = await fetch(`${API}/api/accounts/${type}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ accountNo: accountNo.trim(), amount: parsedAmount }),
            });

            const json = await res.json();

            if (!res.ok) {
                setErrorMsg(json.message || "Something went wrong.");
            } else {
                setResult(json.data);
                setLastTx({ type, amount: parsedAmount });
                setAmount("");
            }
        } catch {
            setErrorMsg("Could not connect to the server. Make sure the backend is running.");
        } finally {
            setLoading(null);
        }
    };

    return (
        <>
            <style>{`
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                body { background: linear-gradient(135deg, #0f0c29, #302b63, #24243e); min-height: 100vh; font-family: 'Inter','Segoe UI',system-ui,sans-serif; color: #e2e8f0; }
                .page { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem 1rem; }
                .header { text-align: center; margin-bottom: 2.5rem; }
                .header h1 { font-size: 2rem; font-weight: 800; background: linear-gradient(90deg,#a78bfa,#60a5fa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
                .header p { margin-top: 0.5rem; color: #94a3b8; font-size: 0.95rem; }
                .card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(20px); border-radius: 1.25rem; padding: 2.5rem; width: 100%; max-width: 460px; box-shadow: 0 25px 50px rgba(0,0,0,0.4); }
                .form-group { margin-bottom: 1.25rem; }
                label { display: block; font-size: 0.8rem; font-weight: 600; color: #94a3b8; margin-bottom: 0.45rem; letter-spacing: 0.5px; text-transform: uppercase; }
                input[type="text"], input[type="number"] { width: 100%; padding: 0.75rem 1rem; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12); border-radius: 0.75rem; color: #f1f5f9; font-size: 1rem; outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
                input:focus { border-color: #a78bfa; box-shadow: 0 0 0 3px rgba(167,139,250,0.2); }
                input[type="number"]::-webkit-inner-spin-button { -webkit-appearance: none; }
                .btn-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-top: 0.5rem; }
                .btn { padding: 0.85rem; font-size: 0.95rem; font-weight: 700; border: none; border-radius: 0.75rem; cursor: pointer; transition: opacity 0.2s, transform 0.15s; }
                .btn:hover:not(:disabled) { opacity: 0.88; transform: translateY(-2px); }
                .btn:disabled { opacity: 0.55; cursor: not-allowed; }
                .btn-deposit { background: linear-gradient(135deg,#059669,#10b981); color: white; }
                .btn-withdraw { background: linear-gradient(135deg,#dc2626,#ef4444); color: white; }
                .divider { height: 1px; background: rgba(255,255,255,0.08); margin: 1.75rem 0; }
                .result-card { border-radius: 1rem; padding: 1.25rem 1.5rem; font-size: 0.9rem; }
                .result-success { background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); }
                .result-error { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); color: #fca5a5; padding: 1rem 1.25rem; border-radius: 0.75rem; margin-top: 1.5rem; }
                .result-label { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.75rem; }
                .result-label.deposit { color: #34d399; }
                .result-label.withdraw { color: #f87171; }
                .row { display: flex; justify-content: space-between; align-items: center; padding: 0.35rem 0; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 0.88rem; }
                .row:last-child { border-bottom: none; }
                .row span:first-child { color: #94a3b8; }
                .row span:last-child { font-weight: 600; color: #e2e8f0; }
                .balance-value { font-size: 1.4rem !important; font-weight: 800 !important; background: linear-gradient(90deg,#34d399,#60a5fa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
            `}</style>

            <div className="page">
                <div className="header">
                    <h1>🏦 Online Bank Mini System</h1>
                    <p>Deposit or withdraw from any account</p>
                </div>

                <Nav />

                <div className="card">
                    <div className="form-group">
                        <label htmlFor="accountNo">Account Number</label>
                        <input id="accountNo" type="text" placeholder="e.g. ACC-..." value={accountNo} onChange={(e) => setAccountNo(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="amount">Amount (₹)</label>
                        <input id="amount" type="number" placeholder="e.g. 5000" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} />
                    </div>

                    <div className="btn-row">
                        <button className="btn btn-deposit" disabled={loading !== null} onClick={() => handleTransaction("deposit")}>
                            {loading === "deposit" ? "Processing…" : "⬆ Deposit"}
                        </button>
                        <button className="btn btn-withdraw" disabled={loading !== null} onClick={() => handleTransaction("withdraw")}>
                            {loading === "withdraw" ? "Processing…" : "⬇ Withdraw"}
                        </button>
                    </div>

                    {errorMsg && <div className="result-error">✗ {errorMsg}</div>}

                    {result && lastTx && (
                        <>
                            <div className="divider" />
                            <div className="result-card result-success">
                                <div className={`result-label ${lastTx.type}`}>
                                    {lastTx.type === "deposit" ? "✓ Deposit Successful" : "✓ Withdrawal Successful"}
                                </div>
                                <div className="row"><span>Account No</span><span>{result.accountNo}</span></div>
                                <div className="row"><span>Holder</span><span>{result.holderName}</span></div>
                                <div className="row"><span>Transaction</span><span>{lastTx.type === "deposit" ? "+" : "-"}₹{lastTx.amount.toLocaleString()}</span></div>
                                <div className="row"><span>New Balance</span><span className="balance-value">₹{result.balance.toLocaleString()}</span></div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

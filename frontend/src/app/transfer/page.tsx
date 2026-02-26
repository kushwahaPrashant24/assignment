"use client";

import { useState } from "react";
import Nav from "@/components/Nav";

interface AccountSummary { accountNo: string; holderName: string; balance: number; }
interface TransferResult { sender: AccountSummary; receiver: AccountSummary; amount: number; }

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function TransferPage() {
    const [senderAccount, setSenderAccount] = useState("");
    const [receiverAccount, setReceiverAccount] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<TransferResult | null>(null);
    const [errorMsg, setErrorMsg] = useState("");

    const handleTransfer = async () => {
        const parsedAmount = parseFloat(amount);
        if (!senderAccount.trim()) { setErrorMsg("Please enter the sender account number."); return; }
        if (!receiverAccount.trim()) { setErrorMsg("Please enter the receiver account number."); return; }
        if (isNaN(parsedAmount) || parsedAmount <= 0) { setErrorMsg("Please enter a valid positive amount."); return; }

        setLoading(true); setResult(null); setErrorMsg("");

        try {
            const res = await fetch(`${API}/api/accounts/transfer`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ senderAccount: senderAccount.trim(), receiverAccount: receiverAccount.trim(), amount: parsedAmount }),
            });
            const json = await res.json();
            if (!res.ok) { setErrorMsg(json.message || "Transfer failed."); }
            else { setResult(json.data); setAmount(""); }
        } catch { setErrorMsg("Could not connect to the server. Make sure the backend is running."); }
        finally { setLoading(false); }
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
                .card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(20px); border-radius: 1.25rem; padding: 2.5rem; width: 100%; max-width: 480px; box-shadow: 0 25px 50px rgba(0,0,0,0.4); }
                .section-title { font-size: 0.7rem; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; color: #64748b; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.06); }
                .form-group { margin-bottom: 1.2rem; }
                label { display: block; font-size: 0.8rem; font-weight: 600; color: #94a3b8; margin-bottom: 0.4rem; letter-spacing: 0.4px; text-transform: uppercase; }
                .input-wrapper { position: relative; }
                .input-badge { position: absolute; left: 0.85rem; top: 50%; transform: translateY(-50%); font-size: 0.75rem; font-weight: 700; padding: 0.15rem 0.5rem; border-radius: 4px; pointer-events: none; }
                .badge-sender { background: rgba(239,68,68,0.2); color: #f87171; }
                .badge-receiver { background: rgba(52,211,153,0.2); color: #34d399; }
                input[type="text"], input[type="number"] { width: 100%; padding: 0.75rem 1rem; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12); border-radius: 0.75rem; color: #f1f5f9; font-size: 0.95rem; outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
                .has-badge input { padding-left: 4.5rem; }
                input:focus { border-color: #a78bfa; box-shadow: 0 0 0 3px rgba(167,139,250,0.2); }
                input[type="number"]::-webkit-inner-spin-button { -webkit-appearance: none; }
                .arrow-row { display: flex; align-items: center; justify-content: center; margin: 0.5rem 0 1.2rem; }
                .arrow-icon { width: 32px; height: 32px; border-radius: 50%; background: rgba(167,139,250,0.12); border: 1px solid rgba(167,139,250,0.25); display: flex; align-items: center; justify-content: center; font-size: 1rem; }
                .divider { height: 1px; background: rgba(255,255,255,0.06); margin: 1.5rem 0; }
                .btn-transfer { width: 100%; padding: 0.9rem; background: linear-gradient(135deg,#7c3aed,#4f46e5); color: white; font-size: 1rem; font-weight: 700; border: none; border-radius: 0.75rem; cursor: pointer; transition: opacity 0.2s, transform 0.15s; }
                .btn-transfer:hover:not(:disabled) { opacity: 0.88; transform: translateY(-2px); }
                .btn-transfer:disabled { opacity: 0.55; cursor: not-allowed; }
                .alert-error { margin-top: 1.5rem; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); color: #fca5a5; padding: 1rem 1.25rem; border-radius: 0.75rem; font-size: 0.9rem; }
                .result-box { margin-top: 1.75rem; background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.25); border-radius: 1rem; overflow: hidden; }
                .result-header { padding: 0.9rem 1.25rem; background: rgba(16,185,129,0.1); border-bottom: 1px solid rgba(16,185,129,0.15); font-size: 0.78rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #34d399; }
                .accounts-grid { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; }
                .account-box { padding: 1.25rem; }
                .account-box-label { font-size: 0.7rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 0.6rem; }
                .account-box-label.sender { color: #f87171; }
                .account-box-label.receiver { color: #34d399; }
                .account-name { font-size: 0.92rem; font-weight: 700; color: #f1f5f9; margin-bottom: 0.25rem; }
                .account-no { font-size: 0.75rem; color: #64748b; margin-bottom: 0.6rem; font-family: monospace; }
                .balance-tag { display: inline-block; padding: 0.25rem 0.65rem; border-radius: 99px; font-size: 0.8rem; font-weight: 700; }
                .balance-tag.sender { background: rgba(239,68,68,0.15); color: #fca5a5; }
                .balance-tag.receiver { background: rgba(52,211,153,0.15); color: #6ee7b7; }
                .transfer-arrow-col { display: flex; flex-direction: column; align-items: center; gap: 0.35rem; padding: 0 0.5rem; border-left: 1px solid rgba(255,255,255,0.06); border-right: 1px solid rgba(255,255,255,0.06); }
                .t-arrow { font-size: 1.5rem; }
                .t-amount { font-size: 0.9rem; font-weight: 800; background: linear-gradient(90deg,#a78bfa,#60a5fa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; white-space: nowrap; }
            `}</style>

            <div className="page">
                <div className="header">
                    <h1>🏦 Online Bank Mini System</h1>
                    <p>Transfer funds between accounts instantly</p>
                </div>

                <Nav />

                <div className="card">
                    <div className="section-title">Transfer Details</div>
                    <div className="form-group">
                        <label htmlFor="senderAccount">Sender Account</label>
                        <div className="input-wrapper has-badge">
                            <span className="input-badge badge-sender">FROM</span>
                            <input id="senderAccount" type="text" placeholder="ACC-..." value={senderAccount} onChange={(e) => setSenderAccount(e.target.value)} />
                        </div>
                    </div>
                    <div className="arrow-row"><div className="arrow-icon">↓</div></div>
                    <div className="form-group">
                        <label htmlFor="receiverAccount">Receiver Account</label>
                        <div className="input-wrapper has-badge">
                            <span className="input-badge badge-receiver">TO</span>
                            <input id="receiverAccount" type="text" placeholder="ACC-..." value={receiverAccount} onChange={(e) => setReceiverAccount(e.target.value)} />
                        </div>
                    </div>
                    <div className="divider" />
                    <div className="form-group">
                        <label htmlFor="transferAmount">Amount (₹)</label>
                        <input id="transferAmount" type="number" placeholder="e.g. 2500" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} />
                    </div>
                    <button className="btn-transfer" disabled={loading} onClick={handleTransfer}>
                        {loading ? "Processing…" : "↗ Initiate Transfer"}
                    </button>

                    {errorMsg && <div className="alert-error">✗ {errorMsg}</div>}

                    {result && (
                        <div className="result-box">
                            <div className="result-header">✓ Transfer Successful</div>
                            <div className="accounts-grid">
                                <div className="account-box">
                                    <div className="account-box-label sender">Sender</div>
                                    <div className="account-name">{result.sender.holderName}</div>
                                    <div className="account-no">{result.sender.accountNo}</div>
                                    <span className="balance-tag sender">₹{result.sender.balance.toLocaleString()}</span>
                                </div>
                                <div className="transfer-arrow-col">
                                    <span className="t-arrow">→</span>
                                    <span className="t-amount">₹{result.amount.toLocaleString()}</span>
                                </div>
                                <div className="account-box">
                                    <div className="account-box-label receiver">Receiver</div>
                                    <div className="account-name">{result.receiver.holderName}</div>
                                    <div className="account-no">{result.receiver.accountNo}</div>
                                    <span className="balance-tag receiver">₹{result.receiver.balance.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

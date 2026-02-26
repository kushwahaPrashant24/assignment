import { Request, Response } from "express";
import Account from "../models/account.model";

const generateAccountNo = (): string => {
    const timestamp = Date.now();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `ACC-${timestamp}-${random}`;
};

// ── GET /api/accounts ────────────────────────────────────────────────────────
export const getAllAccounts = async (_req: Request, res: Response): Promise<void> => {
    try {
        const accounts = await Account.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: accounts.length, data: accounts });
    } catch (error) {
        console.error("getAllAccounts error:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};

// ── POST /api/accounts/create ────────────────────────────────────────────────
export const createAccount = async (req: Request, res: Response): Promise<void> => {
    try {
        const { holderName, isKYCVerified } = req.body;

        if (!holderName || typeof holderName !== "string" || holderName.trim() === "") {
            res.status(400).json({ success: false, message: "holderName is required and must be a non-empty string." });
            return;
        }
        if (typeof isKYCVerified !== "boolean") {
            res.status(400).json({ success: false, message: "isKYCVerified is required and must be a boolean." });
            return;
        }

        const accountNo = generateAccountNo();
        const account = await Account.create({ accountNo, holderName: holderName.trim(), isKYCVerified });

        res.status(201).json({ success: true, message: "Account created successfully.", data: account });
    } catch (error: any) {
        if (error.code === 11000) {
            res.status(409).json({ success: false, message: "Account number conflict. Please try again." });
            return;
        }
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((e: any) => e.message);
            res.status(400).json({ success: false, message: messages.join(", ") });
            return;
        }
        console.error("createAccount error:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};

// ── POST /api/accounts/deposit ───────────────────────────────────────────────
export const deposit = async (req: Request, res: Response): Promise<void> => {
    try {
        const { accountNo, amount } = req.body;

        if (!accountNo || typeof accountNo !== "string" || accountNo.trim() === "") {
            res.status(400).json({ success: false, message: "accountNo is required." });
            return;
        }
        if (typeof amount !== "number" || isNaN(amount) || amount <= 0) {
            res.status(400).json({ success: false, message: "amount must be a positive number." });
            return;
        }

        const account = await Account.findOne({ accountNo: accountNo.trim() });
        if (!account) {
            res.status(404).json({ success: false, message: `Account '${accountNo}' not found.` });
            return;
        }

        account.balance += amount;
        await account.save();

        res.status(200).json({
            success: true,
            message: "Deposited successfully.",
            data: { accountNo: account.accountNo, holderName: account.holderName, balance: account.balance },
        });
    } catch (error) {
        console.error("deposit error:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};

// ── POST /api/accounts/withdraw ──────────────────────────────────────────────
export const withdraw = async (req: Request, res: Response): Promise<void> => {
    try {
        const { accountNo, amount } = req.body;

        if (!accountNo || typeof accountNo !== "string" || accountNo.trim() === "") {
            res.status(400).json({ success: false, message: "accountNo is required." });
            return;
        }
        if (typeof amount !== "number" || isNaN(amount) || amount <= 0) {
            res.status(400).json({ success: false, message: "amount must be a positive number." });
            return;
        }

        const account = await Account.findOne({ accountNo: accountNo.trim() });
        if (!account) {
            res.status(404).json({ success: false, message: `Account '${accountNo}' not found.` });
            return;
        }
        if (account.balance < amount) {
            res.status(400).json({
                success: false,
                message: `Insufficient balance. Available: ${account.balance}, Requested: ${amount}.`,
            });
            return;
        }

        account.balance -= amount;
        await account.save();

        res.status(200).json({
            success: true,
            message: "Withdrawn successfully.",
            data: { accountNo: account.accountNo, holderName: account.holderName, balance: account.balance },
        });
    } catch (error) {
        console.error("withdraw error:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};

// ── POST /api/accounts/transfer ──────────────────────────────────────────────
export const transfer = async (req: Request, res: Response): Promise<void> => {
    try {
        const { senderAccount, receiverAccount, amount } = req.body;

        if (!senderAccount || typeof senderAccount !== "string" || senderAccount.trim() === "") {
            res.status(400).json({ success: false, message: "senderAccount is required." });
            return;
        }
        if (!receiverAccount || typeof receiverAccount !== "string" || receiverAccount.trim() === "") {
            res.status(400).json({ success: false, message: "receiverAccount is required." });
            return;
        }
        if (typeof amount !== "number" || isNaN(amount) || amount <= 0) {
            res.status(400).json({ success: false, message: "amount must be a positive number." });
            return;
        }

        const senderNo = senderAccount.trim();
        const receiverNo = receiverAccount.trim();

        if (senderNo.toLowerCase() === receiverNo.toLowerCase()) {
            res.status(400).json({ success: false, message: "Sender and receiver accounts must be different." });
            return;
        }

        const [sender, receiver] = await Promise.all([
            Account.findOne({ accountNo: senderNo }),
            Account.findOne({ accountNo: receiverNo }),
        ]);

        if (!sender) {
            res.status(404).json({ success: false, message: `Sender account '${senderNo}' not found.` });
            return;
        }
        if (!receiver) {
            res.status(404).json({ success: false, message: `Receiver account '${receiverNo}' not found.` });
            return;
        }
        if (!sender.isKYCVerified) {
            res.status(403).json({ success: false, message: "Sender account is not KYC verified. Transfers are not allowed." });
            return;
        }
        if (sender.balance < amount) {
            res.status(400).json({
                success: false,
                message: `Insufficient balance. Available: ${sender.balance}, Requested: ${amount}.`,
            });
            return;
        }

        sender.balance -= amount;
        receiver.balance += amount;
        await Promise.all([sender.save(), receiver.save()]);

        res.status(200).json({
            success: true,
            message: `Transfer of ${amount} completed successfully.`,
            data: {
                sender: { accountNo: sender.accountNo, holderName: sender.holderName, balance: sender.balance },
                receiver: { accountNo: receiver.accountNo, holderName: receiver.holderName, balance: receiver.balance },
                amount,
            },
        });
    } catch (error) {
        console.error("transfer error:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};

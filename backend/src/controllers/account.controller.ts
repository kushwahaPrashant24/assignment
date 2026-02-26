import { Request, Response } from "express";
import Account from "../models/account.model";

const generateAccountNo = (): string => {
    const timestamp = Date.now();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `ACC-${timestamp}-${random}`;
};

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

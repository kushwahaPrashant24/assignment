import mongoose, { Document, Schema } from "mongoose";

export interface IAccount extends Document {
    accountNo: string;
    holderName: string;
    balance: number;
    isKYCVerified: boolean;
}

const accountSchema = new Schema<IAccount>(
    {
        accountNo: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        holderName: {
            type: String,
            required: [true, "Holder name is required"],
            trim: true,
        },
        balance: {
            type: Number,
            default: 0,
        },
        isKYCVerified: {
            type: Boolean,
            required: [true, "KYC verification status is required"],
        },
    },
    { timestamps: true }
);

const Account = mongoose.model<IAccount>("Account", accountSchema);
export default Account;

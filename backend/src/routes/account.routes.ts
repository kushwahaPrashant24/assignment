import { Router } from "express";
import { getAllAccounts, createAccount, deposit, withdraw, transfer } from "../controllers/account.controller";

const router = Router();

router.get("/", getAllAccounts);
router.post("/create", createAccount);
router.post("/deposit", deposit);
router.post("/withdraw", withdraw);
router.post("/transfer", transfer);

export default router;

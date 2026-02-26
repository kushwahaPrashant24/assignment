import { Router } from "express";
import { createAccount, deposit, withdraw, transfer } from "../controllers/account.controller";

const router = Router();

router.post("/create", createAccount);
router.post("/deposit", deposit);
router.post("/withdraw", withdraw);
router.post("/transfer", transfer);

export default router;

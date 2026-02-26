import { Router } from "express";
import { createAccount, deposit, withdraw } from "../controllers/account.controller";

const router = Router();

router.post("/create", createAccount);
router.post("/deposit", deposit);
router.post("/withdraw", withdraw);

export default router;

import "dotenv/config";
import express from "express";
import cors from "cors";
import healthRouter from "./routes/health.routes";
import accountRouter from "./routes/account.routes";
import connectDB from "./config/db";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", healthRouter);
app.use("/api/accounts", accountRouter);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});

export default app;

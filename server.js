import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

let tallyData = {
    ledger: [],
    invoices: []
};

let invoiceRequests = [];

app.get("/", (req, res) => res.send("Backend running"));

app.post("/sync/tally-data", (req, res) => {
    tallyData = req.body;
    console.log("📥 Received Tally Data");
    res.json({ success: true });
});

app.get("/sync/invoice-requests", (req, res) => {
    const pending = [...invoiceRequests];
    invoiceRequests = []; // clear after sending
    res.json(pending);
});

app.post("/invoice/create", (req, res) => {
    invoiceRequests.push(req.body);
    res.json({ success: true });
});

app.listen(process.env.PORT, () =>
    console.log(`Backend running on port ${process.env.PORT}`)
);

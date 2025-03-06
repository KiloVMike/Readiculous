const express = require("express");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const router = express.Router();

router.post("/generate-invoice", async (req, res) => {
    try {
        const { order } = req.body;

        // Validate order structure
        if (!Array.isArray(order) || order.length === 0 || order.some(item => !item.title || !item.price)) {
            return res.status(400).json({ message: "Invalid order data" });
        }

        const invoiceId = `invoice_${Date.now()}.pdf`;
        const invoiceDir = path.join(__dirname, "../invoices");
        const invoicePath = path.join(invoiceDir, invoiceId);

        // Ensure invoices directory exists
        if (!fs.existsSync(invoiceDir)) {
            fs.mkdirSync(invoiceDir, { recursive: true });
        }

        // Create PDF document
        const doc = new PDFDocument();
        const stream = fs.createWriteStream(invoicePath);
        doc.pipe(stream);

        doc.fontSize(20).text("Invoice", { align: "center" });
        doc.moveDown();
        order.forEach((item, index) => {
            doc.fontSize(12).text(`${index + 1}. ${item.title} - ₹${item.price}`);
        });
        doc.moveDown();
        doc.fontSize(14).text(`Total: ₹${order.reduce((acc, item) => acc + item.price, 0)}`);

        doc.end();

        // Wait until file is fully written
        stream.on("finish", () => {
            res.status(200).json({ message: "Invoice generated", invoiceUrl: `/invoices/${invoiceId}` });
        });

    } catch (error) {
        console.error("Invoice generation error:", error);
        res.status(500).json({ message: "Error generating invoice" });
    }
});

module.exports = router;

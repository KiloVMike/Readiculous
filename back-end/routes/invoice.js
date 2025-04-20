const express = require("express");
const fs = require("fs");
const path = require("path");
const { jsPDF } = require("jspdf");
const User = require("../modals/users");
const Order = require("../modals/orders"); // Assuming you have an Order model

const router = express.Router();

// POST: Generate invoice with jsPDF and store in DB
router.post("/generate-invoice", async (req, res) => {
    try {
        const { order } = req.body;
        const userId = req.headers.id;

        if (!userId || !Array.isArray(order) || order.length === 0) {
            return res.status(400).json({ message: "Invalid user or order data" });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const sanitizedUsername = user.username.replace(/\s+/g, '_').replace(/[^\w\-]/g, '');
        const invoiceId = `${sanitizedUsername}_${Date.now()}.pdf`;
        const invoiceDir = path.join(__dirname, "..", "invoices");

        if (!fs.existsSync(invoiceDir)) fs.mkdirSync(invoiceDir);
        const filePath = path.join(invoiceDir, invoiceId);

        // Create a new PDF document with jsPDF
        const doc = new jsPDF();
        
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("INVOICE", 105, 30, { align: "center" });

        // Company Information
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text("Readiculous Bookstore", 20, 50);
        doc.text("123 Book Lane", 20, 55);
        doc.text("Book City, 10001", 20, 60);
        doc.text("India", 20, 65);
        doc.text("Phone: +91 123 456 7890", 20, 70);
        doc.text("Email: support@readiculous.com", 20, 75);

        // Customer Information
        doc.text(`Bill To: ${user.username}`, 140, 50);
        doc.text(user.address, 140, 55);
        doc.text("Customer City, 20002", 140, 60);
        doc.text("India", 140, 65);

        // Invoice Details
        doc.text(`Invoice Number: INV-${Date.now()}`, 20, 85);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 140, 85);

        // Table Header
        doc.setFontSize(12);
        doc.text("Item", 20, 95);
        doc.text("Quantity", 100, 95);
        doc.text("Unit Price (INR)", 140, 95);
        doc.text("Total (INR)", 180, 95);
        doc.line(20, 98, 190, 98); // Horizontal line

        let currentY = 105;
        let totalAmount = 0;

        // Loop through each order item
        order.forEach(item => {
            doc.text(item.title, 20, currentY);
            doc.text(`1`, 100, currentY);  // Assuming quantity is 1 for simplicity
            doc.text(`₹ ${item.price.toFixed(2)}`, 140, currentY);
            doc.text(`₹ ${item.price.toFixed(2)}`, 180, currentY);
            currentY += 10;
            totalAmount += item.price;
        });

        // Taxes and Shipping (optional, add them if needed)
        const taxRate = 0.18;  // Assuming 18% tax
        const taxAmount = totalAmount * taxRate;
        const shipping = 50; // Assuming flat shipping cost

        // Total Section
        doc.line(20, currentY + 5, 190, currentY + 5); // Horizontal line
        doc.text("Subtotal", 20, currentY + 10);
        doc.text(`₹ ${totalAmount.toFixed(2)}`, 180, currentY + 10);
        doc.text("Tax (18%)", 20, currentY + 20);
        doc.text(`₹ ${taxAmount.toFixed(2)}`, 180, currentY + 20);
        doc.text("Shipping", 20, currentY + 30);
        doc.text(`₹ ${shipping.toFixed(2)}`, 180, currentY + 30);

        const grandTotal = totalAmount + taxAmount + shipping;
        doc.line(20, currentY + 35, 190, currentY + 35); // Horizontal line
        doc.text("Total Amount", 20, currentY + 40);
        doc.text(`₹ ${grandTotal.toFixed(2)}`, 180, currentY + 40);

        // Footer: Terms and Contact
        doc.setFontSize(8);
        doc.text("Thank you for your purchase! Visit us at www.readiculous.com", 105, currentY + 60, { align: "center" });
        doc.text("Terms and conditions apply. All rights reserved.", 105, currentY + 65, { align: "center" });

        // Save the generated invoice as a PDF
        const pdfBuffer = doc.output("arraybuffer");

        // Write the PDF file to the filesystem
        fs.writeFileSync(filePath, Buffer.from(pdfBuffer));

        // Optional: Store base64 version in DB for backup
        const base64 = Buffer.from(pdfBuffer).toString("base64");

        // Store invoice with associated orderId
        const invoice = {
            fileName: invoiceId,
            pdf: base64,
            orderId: order[0]._id // Assuming the first order's ID is used here
        };

        user.invoices.push(invoice);

        // Optionally, you can also store this in the Order document for reference
        await Order.updateOne(
            { _id: order[0]._id }, 
            { $push: { invoices: invoice } }
        );

        await user.save();
        res.status(200).json({ message: "Invoice generated successfully", invoiceId });
    } catch (err) {
        console.error("Invoice generation failed:", err);
        res.status(500).json({ message: "Error generating invoice", error: err });
    }
});

// GET: Download invoice
router.get("/invoice/:invoiceId", async (req, res) => {
    try {
        const { invoiceId } = req.params;

        const user = await User.findOne({ "invoices.fileName": invoiceId });
        if (!user) return res.status(404).json({ message: "Invoice not found" });

        const invoice = user.invoices.find(inv => inv.fileName === invoiceId);
        if (!invoice) return res.status(404).json({ message: "Invoice not found" });

        const buffer = invoice.pdf
            ? Buffer.from(invoice.pdf, "base64")
            : fs.readFileSync(path.join(__dirname, "..", "invoices", invoice.fileName));

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="${invoice.fileName}"`);
        res.send(buffer);
    } catch (err) {
        console.error("Invoice download error:", err);
        res.status(500).json({ message: "Error downloading invoice" });
    }
});

module.exports = router;

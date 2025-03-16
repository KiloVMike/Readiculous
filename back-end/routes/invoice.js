const express = require("express");
const fs = require("fs");
const path = require("path");
const easyinvoice = require("easyinvoice");
const User = require("../modals/users");

const router = express.Router();

router.post("/generate-invoice", async (req, res) => {
    try {
        const { order } = req.body;
        const userId = req.headers.id;

        if (!Array.isArray(order) || order.length === 0 || order.some(item => !item.title || !item.price)) {
            return res.status(400).json({ message: "Invalid order data" });
        }

        const userInfo = await User.findById(userId).select("username address");
        console.log("Fetched User Info:", userInfo); // Debugging log

        if (!userInfo) {
            return res.status(404).json({ message: "User not found" });
        }

        const invoiceId = `invoice_${Date.now()}.pdf`;
        const invoiceDir = path.join(__dirname, "../invoices");
        const invoicePath = path.join(invoiceDir, invoiceId);

        if (!fs.existsSync(invoiceDir)) {
            fs.mkdirSync(invoiceDir, { recursive: true });
        }

        const invoiceData = {
            documentTitle: "Invoice", 
            sender: {
                company: "Readiculous",
                address: "Smt. CHM College, Ulhasnagar",
                country: "India",
                phone: "+91 9876543210",
                email: "support@readiculous.com",
                website: "www.readiculous.com"
            },
            client: {
                company: `Buyer: ${userInfo.username}`,
                address: `Address: ${userInfo.address}`,
            },
            information: {
                number: `INV-${Date.now()}`,
                date: new Date().toISOString().split("T")[0],
            },
            products: order.map(item => ({
                quantity: 1,
                description: item.title,
                price: item.price,
            })),
            settings: {
                currency: "INR",
                marginTop: 20,
                marginRight: 20,
                marginLeft: 20,
                marginBottom: 20,
                background: "https://www.example.com/invoice-background.png", // Make sure it's a valid image URL
                logo: "/front-end/src/asset/sitelogo.png", // Ensure it's accessible
                color: "#003366", // Primary Theme Color
            },
            translate: {
                invoice: "INVOICE",
                number: "Invoice No.",
                date: "Date",
                subtotal: "Subtotal",
                total: "TOTAL",
                product: "Item",
                quantity: "Qty",
                price: "Price",
            },
            bottomNotice: "Thank you for shopping with Readiculous! If you have any queries, contact support@readiculous.com.",
        };
        
        

        const result = await easyinvoice.createInvoice(invoiceData);
        fs.writeFileSync(invoicePath, result.pdf, "base64");

        res.status(200).json({ message: "Invoice generated", invoiceUrl: `/invoices/${invoiceId}` });
    } catch (error) {
        console.error("Invoice generation error:", error);
        res.status(500).json({ message: "Error generating invoice" });
    }
});

module.exports = router;

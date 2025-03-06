const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path"); // ✅ Corrected Import

const user = require("./routes/user.js");
const book = require("./routes/book.js");
const favourite = require("./routes/favourite.js");
const cart = require("./routes/cart.js");
const order = require("./routes/order.js");
const paymentRoutes = require("./routes/payment.js");
const invoiceRouter = require("./routes/invoice");

require("dotenv").config();
const port = process.env.PORT || 4000;

require("./configure/config.js");

app.use(cors());
app.use(express.json());

app.use("/api/v1", user);
app.use("/api/v1", book);
app.use("/api/v1", favourite);
app.use("/api/v1", cart);
app.use("/api/v1", order);
app.use("/api/v1", paymentRoutes);
app.use("/api/v1", invoiceRouter);
// ✅ Serve invoices
app.use("/invoices", express.static(path.join(__dirname, "invoices")));

app.listen(port, () => {
    console.log(`Server started successfully at ${port}.`);
});


const Order = require("../modals/orders")
const User = require("../modals/users")



exports.placeOrder = async (req, res) => {
    try {
        const { id } = req.headers;
        const { order, paymentMethod } = req.body;

        console.log("🛠️ Received placeOrder request:");
        console.log("Headers:", req.headers);
        console.log("Body:", req.body);

        if (!order || order.length === 0) {
            return res.status(400).json({ message: "Order data is missing" });
        }

        // Ensure order is an array
        for (const orderData of order) {
            const newOrder = new Order({ 
                user: id, 
                book: orderData._id,
                paymentMethod, // Save payment method
            });

            const orderDataFromDb = await newOrder.save();

            // Add order to user's schema
            await User.findByIdAndUpdate(id, { $push: { order: orderDataFromDb._id } });

            // Remove from cart
            await User.findByIdAndUpdate(id, { $pull: { cart: orderData._id } });
        }

        return res.json({
            status: "Success",
            message: "Order placed successfully",
        });

    } catch (error) {
        console.log("❌ Error placing order:", error);
        return res.status(400).json({ message: "Failed to place order" });
    }
};

exports.orderHistory = async (req, res) => {
    try {
        const { id } = req.headers;

        // Fetch the user along with orders, books, and invoices
        const userData = await User.findById(id)
            .populate({
                path: "order",
                populate: { path: "book" }
            })
            .select("order invoices"); // Make sure invoices are included in the response

        const ordersData = userData.order;

        // Return the orders with invoices included
        return res.json({
            status: "success",
            data: ordersData,
            invoices: userData.invoices,  // Include invoices here
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Failed to load orders" });
    }
};


exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        await Order.findByIdAndUpdate(id, {
            status: req.body.status
        })
        return res.json({
            status: "success",
            mesage: "order status updated"
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "failed"
        })
    }
}

exports.getAllOrders = async (req, res) => {

    const { id } = req.headers;
    const userData = await Order.find().populate("user").populate("book").sort({ createdAt: -1 })


    return res.status(200).json({
        data: userData,
    })
}



// Get the latest order with user email
exports.getLatestOrder = async (req, res) => {
  try {
    const latestOrder = await Order.findOne()
      .sort({ createdAt: -1 }) // Get the latest order
      .populate("user", "email") // Populate user details to get email
      .populate("book"); // Populate book details if needed

    if (!latestOrder) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.json({
      order: latestOrder,
      email: latestOrder.user.email, // Extract email from populated user
    });
  } catch (error) {
    console.error("Error fetching latest order:", error);
    res.status(500).json({ message: "Server error" });
  }
};

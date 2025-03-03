const { default: mongoose } = require("mongoose");
const User = require("../modals/users");
const books = require("../modals/books");


exports.addtocart = async (req, res) => {
  try {
    const { userId, bookId, quantity } = req.body;

    console.log("🛒 Add to Cart Request:", req.body); // Log incoming request

    if (!userId || !bookId || !quantity || quantity < 1) {
      console.log("❌ Invalid request:", req.body);
      return res.status(400).json({ error: "Invalid request: userId, bookId, and quantity are required." });
    }

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(bookId)) {
      console.log("❌ Invalid ObjectId:", userId, bookId);
      return res.status(400).json({ error: "Invalid userId or bookId format." });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.log("❌ User not found:", userId);
      return res.status(404).json({ error: "User not found." });
    }

    const bookObjectId = new mongoose.Types.ObjectId(bookId);

    if (!user.cart.some(id => id.equals(bookObjectId))) {
      user.cart.push(bookObjectId);
      await user.save();
      
      console.log("✅ Book added successfully. Cart:", user.cart);
      return res.status(200).json({ message: "Book added to cart successfully.", cart: user.cart });
    }

    console.log("❌ Book is already in the cart.");
    return res.status(400).json({ error: "Book is already in the cart." });

  } catch (error) {
    console.error("❌ Error in addtocart:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};


exports.removetocart = async (req, res) => {
    try {
        const { id } = req.headers;
        const { bookid } = req.params;
        const userData = await User.findById(id);
        const isInCart = userData.cart.includes(bookid);
        if (isInCart) {
            await User.findByIdAndUpdate(id, { $pull: { cart: bookid } })
            res.status(200).json({ message: "removed item from cart" })
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "failed to remove in cart" })
    }
}


exports.getUserCart = async (req, res) => {
  const { id } = req.headers;
  const userData = await User.findById(id).populate("cart");
  const cart = userData.cart.reverse();
  return res.status(200).json({
      data: cart,
  })
}





exports.updateCartQuantity = async (req, res) => {
  try {
    const userId = req.user.id; // Ensure you're extracting user ID correctly
    const bookId = req.params.bookId;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const cartItem = user.cart.find((item) => item.book.toString() === bookId);
    if (!cartItem) {
      return res.status(404).json({ message: 'Book not found in cart' });
    }

    cartItem.quantity = quantity;
    await user.save();

    res.status(200).json({ message: 'Cart updated successfully', cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
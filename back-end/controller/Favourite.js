const User = require("../modals/users.js")


exports.addFavourite = async (req, res) => {
    try {
        const { bookid, id } = req.headers;
        const userData = await User.findById(id);
        const isFav = userData.fav.includes(bookid);
        if (isFav) {
            return res.status(200).json({ message: "already exists" })

        }
        await User.findByIdAndUpdate(id, { $push: { fav: bookid } })
        res.status(200).json({ message: "added" })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "failed to add in fav" })
    }
}


exports.removeFavourite = async (req, res) => {
    try {
        const { id } = req.headers; // User ID from headers
        const { bookid } = req.body; // Book ID should be in the body!

        if (!bookid) {
            return res.status(400).json({ message: "Book ID is required" });
        }

        const userData = await User.findById(id);
        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        const isFav = userData.fav.includes(bookid);
        if (!isFav) {
            return res.status(400).json({ message: "Book not found in favorites" });
        }

        // Remove book from favorites
        await User.findByIdAndUpdate(id, { $pull: { fav: bookid } });

        return res.status(200).json({ message: "Removed from favorites" });
    } catch (error) {
        console.error("Error removing favorite book:", error);
        return res.status(500).json({ message: "Failed to remove favorite book" });
    }
};

exports.getFavBooks = async (req, res) => {

    const { id } = req.headers;
    const userData = await User.findById(id).populate("fav");
    const favBooks = userData.fav;

    return res.status(200).json({
        data: favBooks,
    })
}
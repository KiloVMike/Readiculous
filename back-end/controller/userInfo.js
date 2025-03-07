const User = require("../modals/users");

exports.userInfo = async (req, res) => {
    try {
        const { id } = req.headers;
        const data = await User.findById(id).select("-password");
        return res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ message: "check userinfo" })

    }

}

exports.updateUserInfo = async (req, res) => {
    try {
        console.log("User from req.user:", req.user); // Debugging
        console.log("Request Body:", req.body); // Debugging

        const userId = req.user?.id;
        if (!userId) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const { username, email, address, avatar } = req.body;
        if (!username || !email) {
            return res.status(400).json({ message: "Username and Email are required" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { username, email, address, avatar },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Update User Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};


exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, "-password");
        res.status(200).json({ success: true, data: users }); // Ensure "data" key is present
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params; // Get user ID from request parameters
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        console.error("Delete User Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
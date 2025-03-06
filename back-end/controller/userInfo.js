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

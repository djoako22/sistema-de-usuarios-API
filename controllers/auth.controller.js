const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const login = async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password)
        return res.status(401).json({ error: "Username or password is incorrect" });

    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password)))
        return res.status(401).json({ error: "Username or password is incorrect" });

    try {
        await User.findByIdAndUpdate(user.id, { status: "ACTIVE" });

        const token = jwt.sign({ id: user.id }, process.env.JWT_KEY, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });

        const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_KEY, {
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
        });

        res.json({
            user: user.hiddenFields(),
            token,
            refreshToken,
        });
    } catch (err) {
        next(err);
    }
};

const signup = async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password)
        return res.status(401).json({ error: "Username or password is incorrect" });

    if (await User.findOne({ username }))
        return res.status(400).json({ error: "Username already exists" });

    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            username,
            password: passwordHash,
        });
        res.json({ user: newUser.hiddenFields() });
    } catch (err) {
        next(err);
    }
};

const logout = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user.id, { status: "INACTIVE" });
        res.json({ message: "Logged out" });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    login,
    signup,
    logout,
};

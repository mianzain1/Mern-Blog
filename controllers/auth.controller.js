const UserModel = require("../models/User.model.js");
const bcrypt = require("bcrypt")
const validateRegisterInput = require("../validation/registerValidation");
const jwt = require("jsonwebtoken")
// @Test Get
const testReq = async (req, res) => {
    res.status(200).json("Auth Root is working")
}

// @Register-User POST
// @Route : api/auth/register
const register = async (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body)
    if (!isValid) {
        return res.status(400).json(errors)
    }
    //checking for existing user
    const existingUser = await UserModel.findOne({
        email: new RegExp("^" + req.body.email + "$", "i")
    });
    if (existingUser) {
        return res
            .status(200).json("this email is already Registered")
    }
    try {
        const salt = await bcrypt.genSalt(12);
        const hashedPass = await bcrypt.hash(req.body.password, salt)
        const user = new UserModel({
            username: req.body.username,
            email: req.body.email,
            password: hashedPass,
        });
        const savedUser = await user.save();
        const { password, ...others } = savedUser._doc;
        res.status(200).json(others)
    } catch (error) {
        res.status(500).json("something went wrong" + error)
    }
}

// @Login-User POST
// @Route : api/auth/register
// @ desc : Login User and Assign JWT
const loginUser = async (req, res) => {
    try {
        const user = await UserModel.findOne({
            email: new RegExp("^" + req.body.email + "$", "i"),
        })
        if (!user) {
            return res.status(400).json({ error: "wrong credential" })
        }
        //compare the password
        const passwordMatch = await bcrypt.compare(req.body.password, user.password)
        if (!passwordMatch) {
            return res.status(400).json({ error: "wrong credential" })
        }
        const payload = { userId: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        res.cookie("access_token", token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        });
        const { password, ...others } = user._doc;
        res.status(200).json({ user: others, token: token });
    } catch (error) {
        res.status(500).json(error)
    }
}

// @Get Current User Get
// @Route : api/auth/current
// @ desc : Get the Current Login User



module.exports = { testReq, register, loginUser }
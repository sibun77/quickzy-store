const userCollection = require("../model/user")
const productCollection = require("../model/Product")
const queryCollection = require("../model/query")
const bcrypt = require("bcrypt")
const cartCollection = require("../model/cart")
const jwt = require("jsonwebtoken")
const RazorPay = require("razorpay")
const crypto = require("crypto")
const orderCollection = require("../model/order")

const razorpay = new RazorPay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})

const OrderController = async (req, res) => {
    console.log(req.body)
    const { amount, currency, receipt } = req.body;
    const options = {
        amount: amount * 100,
        currency,
        receipt,
    }
    try {
        const order = await razorpay.orders.create(options)
        res.status(200).json(order)
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error.." });
    }
}

const VerifyController = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount,userId} = req.body
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id)
    const generate_Signature = hmac.digest("hex")
    if (generate_Signature === razorpay_signature) {
        const record = new orderCollection({
            userId: userId,
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            singnature: razorpay_signature,
            amount: amount,
            status: "Paid",
        })
        await record.save()
        res.json({ success: true, message: "Payment Verify Successfully" })
    } else {
        res.json({ success: false, message: "Payment Verify Fail" })
    }
}

const regDataController = async (req, res) => {
    //console.log(req.body)
    try {
        const { fname, email, pass } = req.body;
        if (!fname || !email || !pass) {
            res.status(400).json({ message: "All fields are required" })
            return;
        }
        const emailExist = await userCollection.findOne({ userEmail: email })
        console.log(emailExist)

        if (emailExist) {
            await res.status(400).json({ message: "Email Already regersetred" })
            return;
        }
        const hashPassword = await bcrypt.hash(pass, 10);
        const record = new userCollection({
            userName: fname,
            userEmail: email,
            userPass: hashPassword
        })
        await record.save();
        res.status(200).json({ message: "Successfully Register" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }

}

const loginDataController = async (req, res) => {
    try {
        console.log(req.body)
        const { loginEmail, loginPass } = req.body;
        const userCheck = await userCollection.findOne({ userEmail: loginEmail });
        if (!userCheck) {
            return res.status(400).json({ message: "User not found..." });

        }
        const matchPass = await bcrypt.compare(loginPass, userCheck.userPass)
        if (!matchPass) {
            return res.status(400).json({ message: "Invalid Credentials..." })
        }
        const token = jwt.sign(
            { id: userCheck._id, },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        )
        res.status(200).json({
            message: "Successfully login...",
            data: userCheck,
            token: token,
        })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error.." });
    }

}

const userAllProducts = async (req, res) => {
    try {
        const category = req.query.category
        let filter = { ProductStatus: "In-Stock" }
        if (category && category.toLowerCase() !== "all") {
            filter.ProductCategory = category.toLowerCase()
        }
        const record = await productCollection.find(filter)
        res.status(200).json({
            data: record,
        })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error.." });
    }
}

const userQueryController = async (req, res) => {
    try {
        const { userName, userEmail, userQuery } = (req.body)
        const record = new queryCollection({
            Name: userName,
            Email: userEmail,
            Query: userQuery,
        })
        await record.save();
        res.status(200).json({
            message: "Successfully submit your query..."
        })

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error.." });
    }
}

const saveCartController = async (req, res) => {
    //console.log(req.body)
    console.log("authentication passed")
    try {
        const { userId, cartItems, totalPrice, totalQuantity } = req.body
        let cart = await cartCollection.findOne({ userId })
        if (cart) {
            cart.cartItems = cartItems;
            cart.totalPrice = totalPrice;
            cart.totalQuantity = totalQuantity;
            await cart.save();
        } else {
            cart = new cartCollection({
                userId,
                cartItems,
                totalPrice,
                totalQuantity,
            })
            await cart.save();
        }

        res.status(200).json({ message: "Cart saved Successfully" })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error.." });
    }
}

const getCartController = async (req, res) => {
    console.log("authentication passed")
    try {
        const userId = req.params.userId
        const cart = await cartCollection.findOne({ userId })
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error.." });
    }
}

const searchController = async (req, res) => {
    try {
        const keyword = req.query.q
        const result = await productCollection.find({
            ProductName: { $regex: keyword, $options: "i" },
            ProductStatus: "In-Stock"
        })
        res.status(200).json({ data: result })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error.." });
    }
}



module.exports = {
    regDataController,
    loginDataController,
    userAllProducts,
    userQueryController,
    saveCartController,
    getCartController,
    searchController,
    OrderController,
    VerifyController,
}
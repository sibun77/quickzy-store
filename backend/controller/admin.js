const { Query } = require("mongoose")
const productCollection = require("../model/Product")
const queryCollection = require("../model/query")
const nodemailer = require("nodemailer")


const addAdminProductController = async (req, res) => {
    try {
        const Pimage=req.file.filename
        const { Pname, Price, Cat } = req.body
        if (!Pname || !Price || !Cat) {
            res.status(400).json({ message: "All fields are required" })
            return;
        }
        const record = new productCollection({
            ProductName: Pname,
            ProductPrice: Price,
            ProductCategory: Cat,
            ProductImage: Pimage,
        })
        await record.save()
        res.status(200).json({ message: "Successfully Insert Product..." })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error.." });
    }

}

const getAllProductsController = async (req, res) => {
    try {
        const record = await productCollection.find();
        res.status(200).json({ data: record })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error.." });
    }
}

const deleteProductController = async (req, res) => {
    try {
        const id = req.params.id
        await productCollection.findByIdAndDelete(id)
        res.status(200).json({ message: "Successfully deleted" })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error.." });
    }

}

const editValueDataController = async (req, res) => {
    try {
        const id = req.params.abc
        const record = await productCollection.findById(id)
        res.status(200).json({ data: record })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error.." });
    }
}

const updateProductController = async (req, res) => {
    try {
        const { Pname, Pprice, Cat, Pstatus } = req.body;
        const id = req.params.abc;
        const record = await productCollection.findByIdAndUpdate(id, {
            ProductName: Pname,
            ProductPrice: Pprice,
            ProductCategory: Cat,
            ProductStatus: Pstatus,
        })
        record.save();
        res.status(200).json({ message: "Successfully update product" })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error.." });
    }
}

const userAllQueryController = async (req, res) => {
    try {
        const record = await queryCollection.find()
        res.status(200).json({ data: record })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error.." });
    }
}

const deleteQueryController = async (req, res) => {
    try {
        const id = req.params.abc
        console.log(id)
        await queryCollection.findByIdAndDelete(id)
        res.status(200).json({ message: "Successfully Delete" })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error.." });
    }
}

const singleQueryController = async (req, res) => {
    try {
        const id = req.params.abc
        const record = await queryCollection.findById(id)
        res.status(200).json({ data: record })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error.." });
    }
}

const MailReplayController = async (req, res) => {
    try {
        const id=req.params.abc
        console.log(id)
        const { to, sub, body } = req.body
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: "sibabratajena5@gmail.com",
                pass: "hbtytrnfzpuasjgu",
            },
        });

        // Wrap in an async IIFE so we can use await.
        (async () => {
            const info = await transporter.sendMail({
                from: '"QuickZy" <sibabratajena5@gmail.com>',
                to: to,
                subject: sub,
                text: body, // plain‑text body
                html: body, // HTML body
            });
            //console.log("Message sent:", info.messageId);
            queryCollection.findByIdAndUpdate(id,{QueryStatus:"Read"})
            res.status(200).json({message:"Successfully Replyed"})
            
        })();
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error.." });
    }
}

module.exports = {
    addAdminProductController,
    getAllProductsController,
    deleteProductController,
    editValueDataController,
    updateProductController,
    userAllQueryController,
    deleteQueryController,
    singleQueryController,
    MailReplayController,
}
import express from "express";
import mongoose from "mongoose";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");

// -------------------- DB CONNECTION --------------------
const dbConnect = async () => {
    await mongoose.connect("mongodb://localhost:27017/merndb");
    console.log("Database Connected");
};

const startServer = async () => {
    await dbConnect();
    app.listen(8080, () => {
        console.log("Server started on port 8080");
    });
};

// -------------------- SCHEMA --------------------
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true }
}, { timestamps: true });

const ProductModel = mongoose.model("Product", productSchema);

// -------------------- ROUTES --------------------

// GET all products
app.get("/", async (req, res) => {
    try {
        const result = await ProductModel.find();
        res.render("index", { products: result });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
app.get("/add", async (req, res) => {
   res.render("add")
});

// CREATE product
app.post("/save", async (req, res) => {
    try {
        const body = req.body;
        await ProductModel.create(body);
        // res.status(201).json({ message: "Product created successfully" });
        res.redirect("/")
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.get("/:id/edit", async (req, res) => {
    const product = await ProductModel.findById(req.params.id);
    res.render("edit", { product });
});
app.post("/:id/save-product",async(req,res)=>{
    const id=req.params.id
    const body=req.body
    await ProductModel.findByIdAndUpdate(id,body)
    res.redirect("/")
})

app.get("/:id/delete", async (req, res) => {
    try {
        const product = await ProductModel.findById(req.params.id);
        res.render("delete", { product });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.post("/:id/delete", async (req, res) => {
    try {
        await ProductModel.findByIdAndDelete(req.params.id);
        res.redirect("/");
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

startServer();
// app.get("/", (req, res) => {
//     res.render("index", { name: "john" });
// });

// const products = [
//     { id: 1, name: "product1", price: 200 },
//     { id: 2, name: "product2", price: 300 },
//     { id: 3, name: "product3", price: 400 },
//     { id: 4, name: "product4", price: 500 },
// ];

// app.get("/products", (req, res) => {
//     res.render("products", { products });
// });

// app.listen(8080, () => {
//     console.log("Server running on port 8080");
// });
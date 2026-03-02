// import express from "express";
// import mongoose from "mongoose";
// import expressLayouts from "express-ejs-layouts";
// import dbconnect from "./config/db.js";
// import dotenv from "dotenv";
// dotenv.config();

// const app = express();
// app.use(expressLayouts)
// app.set("layout","layout")
// app.set("view engine", "ejs");
// app.use(express.static("public"))
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// // const dbConnect = async () => {
// //   await mongoose.connect(process.env.MONGO_URI);
// // };
// const startServer = async () => {
//   await dbconnect();
//   app.listen(8080, () => console.log("Server started"));
// };

// //*******product Schema************* */
// const productSchema = mongoose.Schema({
//   name: { type: String, required: true },
//   description: { type: String, required: true },
//   price: { type: Number, required: true },
//   imageurl: { type: String, required: true },
// });


// //*******userSchema************* */
// const userSchema = mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true ,unique:true },
//   phoneNumber: { type: Number, required: true },
//   password: {type: String ,required: true}
// });


// const productModel = mongoose.model("products", productSchema);


// app.get("/products/add", (req, res) => {
//   res.render("add");
// });

// app.post("/products/save", async (req, res) => {
//   await productModel.create(req.body);
//   res.redirect("/");
// });

// app.get("/products/:id/edit", async (req, res) => {
//   const product = await productModel.findById(req.params.id);
//   res.render("edit", { product });
// });

// app.post("/products/:id/save", async (req, res) => {
//   await productModel.findByIdAndUpdate(req.params.id, req.body);
//   res.redirect("/");
// });

// app.post("/products/:id/delete", async (req, res) => {
//   await productModel.findByIdAndDelete(req.params.id);
//   res.redirect("/");
// });


// //************user routes */
// const userModel = mongoose.model("users", userSchema);
// app.get("/", async (req, res) => {
//   const products = await productModel.find();
//   const users = await userModel.find();
//   res.render("index", { products, users });
// });
// app.get("/users/add", (req, res) => {
//   res.render("adduser");
// });

// app.post("/users/save", async (req, res) => {
//   await userModel.create(req.body);
//   res.redirect("/");
// });

// app.get("/users/:id/edit", async (req, res) => {
//   const user = await userModel.findById(req.params.id);
//   res.render("edituser", { user });
// });

// app.post("/users/:id/save", async (req, res) => {
//   await userModel.findByIdAndUpdate(req.params.id, req.body);
//   res.redirect("/");
// });

// app.post("/users/:id/delete", async (req, res) => {
//   await userModel.findByIdAndDelete(req.params.id);
//   res.redirect("/");
// });
// // Show edit user form
// app.get("/users/:id/edit", async (req, res) => {
//   const user = await userModel.findById(req.params.id);
//   res.render("edituser", { user });
// });

// // Save edited user
// app.post("/users/:id/save", async (req, res) => {
//   await userModel.findByIdAndUpdate(req.params.id, req.body);
//   res.redirect("/");
// });
// app.post("/users/:id/delete", async (req, res) => {
//   await userModel.findByIdAndDelete(req.params.id);
//   res.redirect("/");
// });
// // // Show delete confirmation
// // app.get("/:id/delete", async (req, res) => {
// //   const product = await productModel.findById(req.params.id);
// //   res.render("delete", { product });
// // });

// // // Delete after confirmation
// // app.post("/:id/delete", async (req, res) => {
// //   await productModel.findByIdAndDelete(req.params.id);
// //   res.redirect("/");
// // });

// startServer();



import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import expressLayouts from "express-ejs-layouts";
const app = express();
app.use(expressLayouts);
app.set("layout", "layout");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const dbConnect = async () => {
  await mongoose.connect("mongodb://localhost:27017/ejsnode");
};
const startServer = async () => {
  await dbConnect();
  app.listen(8080, () => console.log("Server started"));
};
const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageurl: { type: String, required: true },
});
const productModel = mongoose.model("products", productSchema);
app.get("/", async (req, res) => {
  const products = await productModel.find();
  // res.json(products);
  res.render("index", { products });
});

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
});

const userModel = mongoose.model("users", userSchema);

app.get("/add", (req, res) => {
  res.render("add");
});
app.post("/save", async (req, res) => {
  const body = req.body;
  const result = await productModel.create(body);
  res.redirect("/");
  // res.json({ message: "Product created" });
});

app.get("/:id/edit", async (req, res) => {
  const id = req.params.id;
  const product = await productModel.findOne({ _id: id });
  res.render("edit", { product });
});

app.post("/:id/save-product", async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  await productModel.findByIdAndUpdate(id, body);
  res.redirect("/");
});

app.get("/:id/delete", async (req, res) => {
  const id = req.params.id;
  await productModel.findByIdAndDelete(id);
  res.redirect("/");
});

app.get("/users/signin", (req, res) => {
  res.render("signin");
});

app.get("/users/signup", (req, res) => {
  res.render("signup");
});

app.post("/users/saveuser", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await userModel.findOne({ email });
    if (existing) {
      return res.send("Email already registered");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    await userModel.create({
      name,
      email,
      password: hashPassword,
    });

    res.redirect("/users/signin");
  } catch (error) {
    res.send("Error creating user");
  }
});
app.post("/users/checkuser", async (req, res) => {
  const { email, password } = req.body;
  const found = await userModel.findOne({ email });
  if (found) {
    const chkPassword = await bcrypt.compare(password, found.password);
    if (chkPassword) {
      res.redirect("/");
    }
  }
});

startServer();
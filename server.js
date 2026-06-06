import express from "express";
import mongoose from "mongoose";
import dns from "node:dns";
import userrouter from "./routers/userrouter.js";
import authenticate from "./middlewares/authenticate.js";
import productRouter from "./routers/productRouter.js";
import dotenv from "dotenv";
import cors from "cors";
import orderRouter from "./routers/orderRouter.js";

dotenv.config();

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const mongoDBURI = process.env.mongoDBURI;
mongoose.connect(mongoDBURI).then(() => {
  console.log("MongoDB connected successfully");
});

const app = express();

app.use(cors());

app.use(express.json());

app.use(authenticate);

app.use("/api/users", userrouter);
app.use("/api/products", productRouter);
app.use("/api/order",orderRouter)

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

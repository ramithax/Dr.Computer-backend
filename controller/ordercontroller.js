import Order from "../models/order.js";
import Product from "../models/product.js";

export default async function createOrder(req, res) {
  try {
    if (req.user == null) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const orderData = {
      orderId: "ORD000001",
      firstName: req.body.firstName || req.user.firstName,
      lastName: req.body.lastName || req.user.lastName,
      email: req.user.email,
      addressLine1: req.body.addressLine1,
      addressLine2: req.body.addressLine2,
      city: req.body.city,
      phone: req.body.phone,
      items: [],
      totalAmount: 0,
    };

    const lastOrder = await Order.findOne().sort({ date: -1 });

    if (lastOrder != null) {
      const lastOrderId = lastOrder.orderId;
      const lastOrderNumberInString = lastOrderId.replace("ORD", "");
      const lastOrderNumber = parseInt(lastOrderNumberInString);

      const newOrderNumber = lastOrderNumber + 1;
      const newOrderNumberInString = newOrderNumber.toString().padStart(6, "0");
      orderData.orderId = "ORD" + newOrderNumberInString;
    }

    for (let i = 0; i < req.body.items.length; i++) {
      const product = await Product.findOne({
        productId: req.body.items[i].productId,
      });

      if (product == null) {
        return res.status(400).json({ message: "Product not found" });
      }

      if (!product.isavailable) {
        return res.status(400).json({ message: "Product not available" });
      }

      if (product.stock < req.body.items[i].quantity) {
        return res.status(400).json({ message: "Not enough stock" });
      }

      orderData.items.push({
        product: {
          productId: product.productId,
          name: product.name,
          image: product.images[0],
          price: product.price,
          labelledPrice: product.labeledprice,
        },
        qty: req.body.items[i].quantity,
      });

      orderData.totalAmount += product.price * req.body.items[i].quantity;
    }

    const newOrder = new Order(orderData);
    await newOrder.save();

    for (let i = 0; i < req.body.items.length; i++) {
      await Product.updateOne(
        { productId: req.body.items[i].productId },
        { $inc: { stock: -req.body.items[i].quantity } },
      );
    }

    res.json({
      message: "Order created successfully",
      orderId: newOrder.orderId,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

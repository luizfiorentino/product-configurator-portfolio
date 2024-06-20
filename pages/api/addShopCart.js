import axios from "axios";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { productId, quantity } = req.body;
    //console.log("BACKEND, id and amount", productId, quantity);

    const authString = Buffer.from(
      `${process.env.NEXT_PUBLIC_REACT_APP_API_KEY}:${process.env.NEXT_PUBLIC_REACT_APP_API_SECRET}`
    ).toString("base64");

    const response = await axios.post(
      `https://stonecenter-shop.nl/wp-json/wc/v3/products/${productId}/cart`,
      {
        product_id: productId,
        quantity: quantity,
      },
      {
        headers: {
          Authorization: `Basic ${authString}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Check for successful response (2xx status code)
    if (response.status >= 200 && response.status < 300) {
      res.json(response.data);
    } else {
      const errorData = await response.json();
      console.error("Error adding item to cart:", errorData);
      res
        .status(response.status)
        .json({ error: errorData.message || "Failed to add item to cart" });
    }
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({ error: "Failed to add item to cart" });
  }
}

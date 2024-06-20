const axios = require("axios");

const TWO_MONTHS_IN_SECONDS = 2 * 30 * 24 * 60 * 60;

async function deleteOnlineOfferteProduct(productId, apiKey, apiSecret) {
  try {
    const response = await axios.delete(
      `https://stonecenter-shop.nl/wp-json/wc/v3/products/${productId}`,
      {
        params: {
          consumer_key: apiKey,
          consumer_secret: apiSecret,
        },
      }
    );
    console.log("Product deleted successfully:", response.data);
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
}

export default async function handler(req, res) {
  const apiKey = req.query.apiKey;
  const apiSecret = req.query.apiSecret;

  if (!apiKey || !apiSecret) {
    res.status(500).json({ error: "API credentials not found." });
    return;
  }

  if (req.method === "POST") {
    const { productId } = req.body;

    try {
      // Schedule deletion of product after 30 minutes
      setTimeout(async () => {
        await deleteOnlineOfferteProduct(productId, apiKey, apiSecret);
      }, TWO_MONTHS_IN_SECONDS * 1000);
      res
        .status(200)
        .json({ message: "Product deletion scheduled successfully." });
    } catch (error) {
      console.error("Error scheduling product deletion:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
}

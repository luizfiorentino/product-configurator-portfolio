//Obs. for one offerte
import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const offerteData = req.body;
  const serializedData = JSON.stringify(offerteData, null, 2);
  const filePath = path.join(process.cwd(), "offerteBackup.json");

  try {
    fs.writeFileSync(filePath, serializedData);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error saving OfferteData:", error);
    res.status(500).json({ error: "Error saving OfferteData" });
  }
}

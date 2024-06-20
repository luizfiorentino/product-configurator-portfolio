import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const offertesData = req.body;
  const serializedData = JSON.stringify(offertesData, null, 2);
  const filePath = path.join(process.cwd(), "offertesBackup.json");

  try {
    fs.writeFileSync(filePath, serializedData);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error saving OffertesData:", error);
    res.status(500).json({ error: "Error saving OffertesData" });
  }
}

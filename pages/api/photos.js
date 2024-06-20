import multer from "multer";
import { cloudinary } from "./utils/cloudinary";
import fs from "fs";

const processMultipartForm = multer({ dest: "/tmp" });

// const processMultipartForm = multer({
//   dest: "/tmp",
//   limits: {
//     fileSize: 8 * 1024 * 1024, // 8 MB limit
//     fieldSize: 8 * 1024 * 1024,
//   },
// });

export const config = {
  api: {
    bodyParser: false,
  },
};

async function uploadSingleImage(path, folder) {
  try {
    const response = await cloudinary.uploader.upload(path, { folder: folder });

    return [null, response];
  } catch (error) {
    return [error, null];
  }
}

export default function handler(req, res) {
  if (req.method === "POST") {
    return new Promise((resolve, reject) => {
      processMultipartForm.array("file", 2)(req, res, async (multerError) => {
        if (multerError) {
          console.error("Error uploading file with multer:", multerError);
          return reject(res.status(500).send("Error uploading file"));
        }
        if (!req.files) {
          return reject(res.status(400).send("No file uploaded"));
        }

        try {
          const fileUploadPromises = req.files.map((file) => {
            const path = file.path;
            const folder = "react_cloudinary"; // Cloudinary folder name

            return uploadSingleImage(path, folder);
          });

          const cloudinaryResponses = await Promise.all(fileUploadPromises);

          const images = cloudinaryResponses.map(([cloudinaryError, image]) => {
            if (cloudinaryError) {
              console.error("Error uploading to cloudinary", cloudinaryError);
            }
            // Return the URL directly

            return image.secure_url;
          });

          // remove symbolic links from the file system
          req.files.forEach((file) => {
            const path = file.path;
            fs.unlinkSync(path);
          });

          // Resolve after all images are processed
          resolve(
            res.status(200).json({ message: "Images posted ok", images })
          );
        } catch (error) {
          console.error("Error in image processing:", error);
          reject(res.status(500).send("Error processing images"));
        }
      });
    });
  }
}

// export default function handler(req, res) {
//   console.log("/api/photos, req.file:", req.files, "req.body:", req.body);
//   if (req.method === "POST") {
//     return new Promise((resolve, reject) => {
//       processMultipartForm.array("file", 2)(req, res, async (multerError) => {
//         if (multerError) {
//           console.error("Error uploading file with multer:", multerError);
//           return reject(res.status(500).send("Error uploading file"));
//         }
//         if (!req.files) {
//           console.log("/api/photos/Promise: no file uploaded");
//           return reject(res.status(400).send("No file uploaded"));
//         }
//         console.log("/api/issues req.files:", req.files);

//         const fileUploadPromises = req.files.map((file) => {
//           const path = file.path;
//           console.log("insidePromise, path:", path);
//           const folder = "react_cloudinary"; // Cloudinary folder name

//           return uploadSingleImage(path, folder);
//         });
//         console.log("fileUploadPromises:", fileUploadPromises);

//         // const fileUploadPromises = Object.keys(req.files).map((key) => {
//         //   const file = req.files[key];
//         //   const path = file.path;
//         //   console.log("insidePromise, path:", path);
//         //   const folder = "react_cloudinary"; // Cloudinary folder name
//         //   return uploadSingleImage(path, folder);
//         // });
//         console.log("Promises/fileUploadPromises:", fileUploadPromises);
//         const cloudinaryResponses = await Promise.all(fileUploadPromises);
//         console.log("cloudinaryResponses:", cloudinaryResponses);
//         const images = cloudinaryResponses.map(([cloudinaryError, image]) => {
//           if (cloudinaryError) {
//             console.error("Error uploading to cloudinary", cloudinaryError);
//           }
//           // const attachments = images.map((image, index) => ({
//           //   filename: `attachment-${index + 1}.jpg`, // choose the name you want
//           //   path: image.url, // use the Cloudinary image URL as the path
//           // }));
//           //return { url: image.secure_url };
//           return resolve(
//             res.status(200).json({ message: "Images posted ok", images })
//           );
//         });
//         //console.log("/api/photos images?", images);

//         //remove symbolic links from file system
//         req.files.forEach((file) => {
//           const path = file.path;
//           fs.unlinkSync(path);
//         });
//         return resolve(res.status(200).json({ message: "Images posted ok" }));
//       });
//     });
//   }
// }

// export default async function handler(req, res) {
//   console.log(
//     "backend first block",
//     "REQ.files?",
//     req.files,
//     "req.body?",
//     req.body
//   );
//   if (req.method === "POST") {
//     return new Promise((resolve, reject) => {
//       console.log("backend firstPromise block");
//       processMultipartForm.array("file", 3)(req, res, async (multerError) => {
//         if (multerError) {
//           console.error("Error uploading file with multer:", multerError);
//           return reject(res.status(500).send("Error uploading file"));
//         }
//         if (!req.files) {
//           return reject(res.status(400).send("No file uploaded"));
//         }
//         const fileUploadPromises = req.files.map((file) => {
//           const path = file.path;
//           const folder = "react_cloudinary"; // Cloudinary folder name
//           console.log("backend fileuploadpromises", fileUploadPromises);
//           return uploadSingleImage(path, folder);
//         });

//         const cloudinaryResponses = await Promise.all(fileUploadPromises);

//         const images = cloudinaryResponses.map(([cloudinaryError, image]) => {
//           if (cloudinaryError) {
//             console.error("Error uploading to cloudinary", cloudinaryError);
//           }

//           return { url: image.secure_url };
//         });
//         console.log("Backend - images:", images);
//         //remove symbolic links from file system
//         req.files.forEach((file) => {
//           const path = file.path;
//           fs.unlinkSync(path);
//         });

//         //This is after multer process

//         return resolve(res.status(200).json({ message: "Images posted" }));
//       });
//     });
//     //return res.status(201).json({ message: `email sent` });
//   } else {
//     return res
//       .status(405)
//       .json({ message: `Method ${req.method} not supported` });
//   }
// }

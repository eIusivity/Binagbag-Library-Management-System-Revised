import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const IMAGE_EXTENSIONS = [".webp", ".png", ".jpg", ".jpeg", ".gif", ".svg"];

export function getImage(req, res) {
  const imageName = path.basename(req.params.imageName || "");

  if (!imageName) {
    return res.status(400).json({
      message: "Image name is required",
    });
  }

  const uploadsDir = path.join(__dirname, "..", "uploads");
  let imagePath = path.join(uploadsDir, imageName);

  if (!fs.existsSync(imagePath)) {
    const extension = path.extname(imageName);
    const baseName = extension
      ? imageName.slice(0, -extension.length)
      : imageName;

    const resolvedExtension = IMAGE_EXTENSIONS.find((ext) =>
      fs.existsSync(path.join(uploadsDir, `${baseName}${ext}`)),
    );

    if (resolvedExtension) {
      imagePath = path.join(uploadsDir, `${baseName}${resolvedExtension}`);
    }
  }

  if (!fs.existsSync(imagePath)) {
    return res.status(404).json({
      message: "Image not found",
    });
  }

  return res.sendFile(imagePath);
}

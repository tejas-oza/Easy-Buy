import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },

  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueFileName = `${uuidv4()}${ext}`;
    cb(null, uniqueFileName);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

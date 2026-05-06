import multer from "multer";

import { MAX_FILE_SIZE_BYTES } from "@/modules/upload/upload.constand";
import { UploadUtils } from "@/modules/upload/upload.utlis";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UploadUtils.ensureUploadDirectory());
  },
  filename: (_req, file, cb) => {
    cb(null, UploadUtils.buildStoredFileName(file.originalname));
  },
});



const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
  },
});


export const MulterConfig = {
  upload,
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
  },
};  




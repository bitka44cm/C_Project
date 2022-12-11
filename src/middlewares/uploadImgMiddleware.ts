import multer, { FileFilterCallback } from 'multer';
import express from 'express';
import { createError } from '../utils/errors';

const storage = multer.memoryStorage();

const fileFilter = (
  req: express.Request,
  file: Express.Multer.File,
  callback: FileFilterCallback,
) => {
  try {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpeg' ||
      file.mimetype == 'image/jpg'
    ) {
      callback(null, true);
    } else {
      callback(null, false);
      throw new createError.UnprocessableEntity({
        data: { msg: 'Only .png, .jpg and .jpeg format allowed!' },
      });
    }
  } catch (e) {
    console.error(e);
    throw e;
  }
};

const limits = {
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  fileSize: 100 * 1024 * 1024,
};

export const uploadImg: multer.Multer = multer({ storage, fileFilter, limits });

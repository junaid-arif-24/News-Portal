import multer, { memoryStorage, StorageEngine } from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary';

interface MulterFile {
  originalname: string;
}

const storage: StorageEngine = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'news_images',
    format: async (): Promise<string> => 'jpeg', // supports promises as well
  } as any,
});

const upload = multer({ storage  });

export default upload;

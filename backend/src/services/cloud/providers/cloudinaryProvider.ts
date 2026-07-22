import { v2 as cloudinary } from 'cloudinary';
import { CloudProvider } from '../provider';
import { AppError } from '../../../shared/errors/AppError';

export class CloudinaryProvider implements CloudProvider {
  private cloudinary: typeof cloudinary;
  providerName = 'cloudinary';

  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    this.cloudinary = cloudinary;
  }

  async upload(file: Express.Multer.File, folder = 'student_documents') {
    const buffer = file.buffer || require('fs').readFileSync(file.path);
    const dataUri = `data:${file.mimetype};base64,${buffer.toString('base64')}`;
    try {
      const result = await this.cloudinary.uploader.upload(dataUri, {
        folder,
        public_id: `${folder}/${Date.now()}_${file.originalname.replace(/\.[^/.]+$/, '')}`,
        resource_type: 'auto',
      });
      return { cloudFileId: result.public_id, fileUrl: result.secure_url, provider: this.providerName };
    } catch (err: any) {
      throw new AppError(`Cloudinary upload failed: ${err.message}`, 500);
    }
  }

  async delete(cloudFileId: string) {
    try {
      await this.cloudinary.uploader.destroy(cloudFileId);
      return true;
    } catch (err: any) {
      throw new AppError(`Cloudinary delete failed: ${err.message}`, 500);
    }
  }

  getUrl(cloudFileId: string) {
    return this.cloudinary.url(cloudFileId);
  }
}

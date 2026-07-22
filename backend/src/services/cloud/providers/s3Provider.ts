import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { CloudProvider } from '../provider';
import { AppError } from '../../../shared/errors/AppError';

export class S3Provider implements CloudProvider {
  private s3: S3Client;
  private bucket: string;
  providerName = 'aws_s3';

  constructor() {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });
    this.bucket = process.env.AWS_S3_BUCKET || 'ciiims-documents';
  }

  async upload(file: Express.Multer.File, folder = 'student-documents') {
    const key = `${folder}/${Date.now()}_${file.originalname}`;
    const body = file.buffer || require('fs').createReadStream(file.path);
    try {
      await this.s3.send(new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: file.mimetype,
      }));
      const region = process.env.AWS_REGION || 'us-east-1';
      return { cloudFileId: key, fileUrl: `https://${this.bucket}.s3.${region}.amazonaws.com/${key}`, provider: this.providerName };
    } catch (err: any) {
      throw new AppError(`S3 upload failed: ${err.message}`, 500);
    }
  }

  async delete(cloudFileId: string) {
    try {
      await this.s3.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: cloudFileId }));
      return true;
    } catch (err: any) {
      throw new AppError(`S3 delete failed: ${err.message}`, 500);
    }
  }

  getUrl(cloudFileId: string) {
    const region = process.env.AWS_REGION || 'us-east-1';
    return `https://${this.bucket}.s3.${region}.amazonaws.com/${cloudFileId}`;
  }
}

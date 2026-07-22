export interface CloudProvider {
  upload(file: Express.Multer.File, folder?: string): Promise<{ cloudFileId: string; fileUrl: string; provider: string }>;
  delete(cloudFileId: string): Promise<boolean>;
  getUrl(cloudFileId: string): string;
}

let providerInstance: CloudProvider | null = null;

export function getProvider(): CloudProvider {
  if (providerInstance) return providerInstance;
  const provider = (process.env.CLOUD_PROVIDER || 'local').toLowerCase();
  switch (provider) {
    case 'cloudinary': {
      const { CloudinaryProvider } = require('./providers/cloudinaryProvider');
      providerInstance = new CloudinaryProvider();
      break;
    }
    case 's3':
    case 'aws_s3': {
      const { S3Provider } = require('./providers/s3Provider');
      providerInstance = new S3Provider();
      break;
    }
    default:
      throw new Error(`Unsupported cloud provider: ${provider}. Set CLOUD_PROVIDER=cloudinary or aws_s3`);
  }
  return providerInstance!;
}

export async function uploadFile(file: Express.Multer.File, folder?: string) {
  return getProvider().upload(file, folder);
}

export async function deleteFile(cloudFileId: string) {
  return getProvider().delete(cloudFileId);
}

export function getFileUrl(cloudFileId: string) {
  return getProvider().getUrl(cloudFileId);
}

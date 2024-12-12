import { S3Client } from '@aws-sdk/client-s3';

export const s3Client = new S3Client({
  region: 'us-west-1',
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY
  }
});

export const BUCKET_NAME = 'smr-blog';
export const BUCKET_REGION = 'us-west-1'; 
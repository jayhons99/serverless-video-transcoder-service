import { handler } from '../lib/common/lambda/generateUploadUrl';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Mock AWS SDK
jest.mock('@aws-sdk/client-s3');
jest.mock('@aws-sdk/s3-request-presigner');

const mockGetSignedUrl = getSignedUrl as jest.MockedFunction<typeof getSignedUrl>;

describe('generateUploadUrl Lambda', () => {
  beforeEach(() => {
    process.env.AWS_REGION = 'us-east-1';
    process.env.UPLOAD_BUCKET_NAME = 'test-bucket';
    mockGetSignedUrl.mockResolvedValue('https://test-signed-url.com');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should generate upload URL successfully', async () => {
    const result = await handler({});
    
    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    expect(body.uploadUrl).toBe('https://test-signed-url.com');
    expect(body.id).toBeDefined();
  });
});
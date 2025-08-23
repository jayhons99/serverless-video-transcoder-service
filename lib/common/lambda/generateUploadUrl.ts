import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({ region: process.env.AWS_REGION });

export const handler = async (_event: any) => {
    const id = Date.now().toString();
    const putObjectCommand = new PutObjectCommand({
        Bucket: process.env.UPLOAD_BUCKET_NAME,
        Key: id + '.mp4',
        ContentType: "video/mp4"
    });

    const uploadUrl = await getSignedUrl(s3, putObjectCommand, { expiresIn: 3600 });

    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Headers" : "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
        body: JSON.stringify({ uploadUrl, id })
    };
};
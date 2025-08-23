import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import path from 'path';

export class ServerlessVideoTranscoderServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // s3
    const uploadBucket = new s3.Bucket(this, "VideoUploads", {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      bucketName: "jhon-serverless-video-transcoder-store-us-east-1",
      autoDeleteObjects: true,
      cors: [
        {
          allowedMethods: [
            s3.HttpMethods.GET,
            s3.HttpMethods.POST,
            s3.HttpMethods.PUT,
          ],
          allowedOrigins: ["*"],
          allowedHeaders: ["*"],
        },
      ],
    });

    // lambda
    const generateUploadUrlFunction = new lambdaNodejs.NodejsFunction(this, "GenerateUploadUrlLambda", {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: path.join(__dirname, 'common', 'lambda', 'generateUploadUrl.ts'),
      handler: 'handler',
      bundling: {
        forceDockerBundling: false
      },
      environment: {
        UPLOAD_BUCKET_NAME: uploadBucket.bucketName
      }
    });

    uploadBucket.grantPut(generateUploadUrlFunction);

    // api gateway
    const api = new apigw.RestApi(this, "UploadPipelineApi", {
      restApiName: "Video Transcoder Service",
      defaultCorsPreflightOptions: {
        allowOrigins: apigw.Cors.ALL_ORIGINS,
        allowMethods: apigw.Cors.ALL_METHODS
      },
    });

    const uploadResource = api.root.addResource("upload");
    uploadResource.addMethod("POST", new apigw.LambdaIntegration(generateUploadUrlFunction));

    new cdk.CfnOutput(this, "VideoUploadApiUrl", { value: api.url });
    new cdk.CfnOutput(this, "UploadBucketName", { value: uploadBucket.bucketName });
  }
}

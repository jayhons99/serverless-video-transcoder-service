import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as ServerlessVideoTranscoderService from '../lib/serverless-video-transcoder-service-stack';

// example test. To run these tests, uncomment this file along with the
// example resource in lib/serverless-video-transcoder-service-stack.ts
test('resources created', () => {
  const app = new cdk.App();
    // WHEN
  const stack = new ServerlessVideoTranscoderService.ServerlessVideoTranscoderServiceStack(app, 'MyTestStack');
    // THEN
  const template = Template.fromStack(stack);

  template.resourceCountIs('AWS::Lambda::Function', 2);

  template.hasResourceProperties('AWS::S3::Bucket', {
    BucketName: 'jhon-serverless-video-transcoder-store-us-east-1'
  });
});

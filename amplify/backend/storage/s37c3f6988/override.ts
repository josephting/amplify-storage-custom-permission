import { AmplifyProjectInfo, AmplifyS3ResourceTemplate } from '@aws-amplify/cli-extensibility-helper';
import { aws_s3 as s3 } from 'aws-cdk-lib'

export function override(resources: AmplifyS3ResourceTemplate, amplifyProjectInfo: AmplifyProjectInfo) {
  const bucket: s3.CfnBucket = resources.s3Bucket
  const notificationConfiguration = bucket.notificationConfiguration
  if ('lambdaConfigurations' in notificationConfiguration) {
    const lambdaConfigurations = notificationConfiguration.lambdaConfigurations
    delete lambdaConfigurations[1]
    lambdaConfigurations[0].event = 's3:ObjectTagging:Put'
  }

  const s3TriggerPolicy: s3.CfnBucketPolicy = (resources as any).s3TriggerPolicy
  if (Array.isArray(s3TriggerPolicy.policyDocument.Statement)) {
    for (const s of s3TriggerPolicy.policyDocument.Statement) {
      const resourceJoin = s.Resource[0]['Fn::Join']
      if (Array.isArray(resourceJoin) && Array.isArray(resourceJoin[1])) {
        if (resourceJoin[1][resourceJoin[1].length - 1] === '/*') {
          s.Action.push('s3:GetObjectTagging')
        }
      }
    }
  }
}

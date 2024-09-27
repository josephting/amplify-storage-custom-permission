import { S3Client, GetObjectTaggingCommand } from '@aws-sdk/client-s3'
import { S3Handler } from 'aws-lambda'

const client = new S3Client()

export const handler: S3Handler = async (event) => {
  console.log('Received S3 event:', JSON.stringify(event, null, 2))
  const bucket = event.Records[0].s3.bucket.name
  const key = event.Records[0].s3.object.key

  const resp = await client.send(new GetObjectTaggingCommand({
    Bucket: bucket,
    Key: key,
  }))
  console.log(resp)
}

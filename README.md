# amplify-storage-custom-permission

In an Amplify application, after adding storage (S3) and S3 event notification that calls a lambda function, the default allowed permissions are:

- s3:ListBucket
- s3:PutObject
- s3:GetObject
- s3:DeleteObject

## Problem

If you need any other permissions, it is not possible to do `amplify function update` and add storage resource access to the S3 trigger lambda function due to cyclic dependency.

As a result, the lambda function will fail due to insufficient permission when calling `GetObjectTaggingCommand` like so.

```
User: arn:aws:sts:::assumed-role/S3Trigger98c865fcLambdaRole98c865fc-dev/S3Trigger98c865fc-dev is not authorized to perform: s3:GetObjectTagging on resource: \"arn:aws:s3:::s3tage05ec7a4c3b84333b9b5f4b00ec50cc9de9d1-dev/data.json\" because no identity-based policy allows the s3:GetObjectTagging action
```

## Solution

To overcome this, it is possible to use `amplify override storage` to generate an override file in storage to modify the cloudformation template used to create S3 resources including IAM policy used by S3 trigger lambda function.

In this example, `s3:GetObjectTagging` has been added and S3 trigger lambda function is only called when `s3:ObjectTagging:Put` event is triggerred.

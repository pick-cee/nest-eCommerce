// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { S3 } from 'aws-sdk'
// import {v4 as uuid} from 'uuid'

// @Injectable()
// export class AwsService {
//   constructor(private configService: ConfigService) {}

  

//   async deletePublicFile(fileKey: string) {
//     try {
//       const deletedFile = await this.s3
//         .deleteObject({
//           Bucket: this.bucketName,
//           Key: fileKey,
//         })
//         .promise();

//       return deletedFile;
//     } catch (error) {
//       console.log(error);
//     }
//   }
// }
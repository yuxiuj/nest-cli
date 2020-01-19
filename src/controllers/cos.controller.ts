import { Controller, Get, Put, HttpException, HttpStatus } from '@nestjs/common';
import { createFile } from '../utils/file.util';
import config from '../config/index.config';
const path = require('path');
const fs = require('fs');
const COS = require('cos-nodejs-sdk-v5');
const { cos: cosConfig } = config;

@Controller('cos')
export class CosController {
  cos: any;
  constructor() {
    this.cos = new COS({
      // 必选参数
      SecretId: cosConfig.SecretId,
      SecretKey: cosConfig.SecretKey,
      // 可选参数
      FileParallelLimit: 3,    // 控制文件上传并发数
      ChunkParallelLimit: 8,   // 控制单个文件下分片上传并发数，在同园区上传可以设置较大的并发数
      ChunkSize: 1024 * 1024 * 8,  // 控制分片大小，单位 B，在同园区上传可以设置较大的分片大小
      Proxy: '',
    });
  }
  @Get('getBucket')
  getBucket() {
    this.cos.getService((err, data) => {
      if (err) {
        throw new HttpException(err.error.Message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
      return data.Buckets;
    });
  }
  @Put('putFile')
  putObject() {
    // 创建测试文件
    const filename = 'test.png';
    const filepath = path.resolve(__dirname, filename);
    createFile(filepath, 1024 * 1024, () => {
      // 调用方法
      this.cos.putObject({
        Bucket: cosConfig.Bucket, /* 必须 */ // Bucket 格式：test-1250000000
        Region: cosConfig.Region,
        Key: filename, /* 必须 */
        onTaskReady: (tid) => {},
        onProgress(progressData) {},
        // 格式1. 传入文件内容
        // Body: fs.readFileSync(filepath),
        // 格式2. 传入文件流，必须需要传文件大小
        Body: fs.createReadStream(filepath),
        ContentLength: fs.statSync(filepath).size,
      }, (err, data) => {
        fs.unlinkSync(filepath);
      });
    });
  }
  @Put('putBucket')
  putBucket() {
    this.cos.putBucket({
      Bucket: 'testnew2-' + cosConfig.Bucket.substr(cosConfig.Bucket.lastIndexOf('-') + 1),
      Region: 'ap-chengdu',
    }, (err, data) => {});
  }
}

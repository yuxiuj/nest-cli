import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as moment from 'moment';
import * as winston from 'winston';

export const options = {
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        nestWinstonModuleUtilities.format.nestLike(),
      ),
    }),
    new winston.transports.File({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.logstash(),
      ),
      dirname: 'logs',
      filename: `nest:${moment().format('MM-DD')}.log`,
      // 文件大小限制 B
      maxsize: 50 * 1024 * 1024,
      // 最多文件保留数目
      maxFiles: 5,
    }),
  ],
};

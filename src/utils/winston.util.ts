import { utilities, WinstonModule } from 'nest-winston';
import * as winstonDaily from 'winston-daily-rotate-file';
import * as winston from 'winston';
import * as path from 'path';

const logDir = path.join(__dirname, '..', '..', 'logs');
const dailyOptions = (level: string) => {
  return {
    level,
    datePattern: 'YYYY-MM-DD',
    dirname: logDir + `/${level}`,
    filename: `%DATE%.${level}.log`,
    maxFiles: 1,
    zippedArchive: true,
  };
};

export const winstonLogger = (isSaveLogFile: boolean) => {
  return isSaveLogFile
    ? WinstonModule.createLogger({
        transports: [
          new winston.transports.Console({
            level: process.env.NODE_ENV === 'production' ? 'http' : 'silly',
            format:
              process.env.NODE_ENV === 'production'
                ? winston.format.simple()
                : winston.format.combine(
                    winston.format.timestamp(),
                    utilities.format.nestLike('naroo-on-backend', {
                      prettyPrint: true,
                    }),
                  ),
          }),
          new winstonDaily(dailyOptions('info')),
          // new winstonDaily(dailyOptions('warn')),
          new winstonDaily(dailyOptions('error')),
        ],
      })
    : undefined;
};

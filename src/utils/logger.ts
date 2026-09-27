import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';

const retentionDays = parseInt(process.env.LOG_RETENTION_DAYS || '10', 10);

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.json()
);

const transport = new DailyRotateFile({
  filename:     path.join(process.cwd(), 'logs', '%DATE%.log'),
  datePattern:  'YYYY-MM-DD',
  maxFiles:     `${retentionDays}d`,
  zippedArchive: false,
  format:       logFormat,
});

const logger = winston.createLogger({
  level: 'info',
  transports: [transport],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }));
}

export default logger;

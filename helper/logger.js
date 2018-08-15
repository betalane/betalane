const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
        winston.format.timestamp(),
        winston.format.printf((info) => {
          let rtn = `${info.timestamp} [${info.level}]: `;
          if (typeof info.message !== 'string') {
            rtn += JSON.stringify(info.message, null, 2);
          } else {
            rtn += info.message;
          }
          return rtn;
        }),
      ),
    }),
  ],
});

module.exports = logger;

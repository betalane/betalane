const winston = require('winston');
const Table = require('cli-table3');
const _ = require('lodash');
require('colors');

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

logger.table = (data, head, title, indexify = true) => {
  // eslint-disable-next-line no-console
  console.log(`\n\n${title}`.underline.green);

  if (indexify) {
    head.unshift('#');
  }

  const table = new Table({
    head: _.map(head, (str) => {
      return str.green;
    }),
  });

  let idx = 1;
  data.forEach((row) => {
    if (indexify) {
      row.unshift(idx);
    }
    table.push(row);
    idx += 1;
  });

  // eslint-disable-next-line no-console
  console.log(table.toString());
};

module.exports = logger;

// import logger from "pino";

// const log = logger({
//   level: process.env.LOG_LEVEL ?? "info",
//   transport: {
//     target: "pino-pretty",
//     options: {
//       colorize: true,
//       ignore: "pid,hostname",
//     },
//   },
// });
// log.info("Logger initialized");

// export default log;

// use winstonjs

import winston, { format } from "winston";

const log = winston.createLogger({
  level: process.env.LOG_LEVEL ?? "info",
  format: winston.format.combine(
    format.colorize(),
    format.errors({ stack: true }),
    format.json(),
    format.prettyPrint(),
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

export default log;

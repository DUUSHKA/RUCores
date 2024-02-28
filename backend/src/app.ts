import cookieParser from "cookie-parser";
import "dotenv/config";
import logger from "morgan";
import path from "path";

import express, { Request, Response } from "express";
import fs from "fs";
import mysql from "mysql2";
import { createExpressServer } from "routing-controllers";
import { BookingController } from "./controllers/BookingController";
import FacilityController from "./controllers/FacilityController";
import { UserController } from "./controllers/UserController";
import AppDataSource from "./database/data-source";
import { prepopulateDB } from "./database/prepopulateDB";
import { fetchUser, verifyUser } from "./middleware/UserAuth";
import log from "./utils/logger";
import swaggerLoader from "./utils/swaggerLoader";

const routingControllersOptions = {
  routePrefix: "/api",
  classTransformer: true,
  authorizationChecker: verifyUser,
  currentUserChecker: fetchUser,
  defaultErrorHandler: false,
  middlewares: [__dirname + "/middleware/*.ts"],
  controllers: [UserController, FacilityController, BookingController],
};

const app: express.Application = createExpressServer(routingControllersOptions);

app.use(logger("dev"));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
swaggerLoader(app, routingControllersOptions);

// // catch 404 and forward to error handler
// app.use(function(req: Request, res: Response, next: NextFunction) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err: any, req: Request, res: Response, next: NextFunction) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status((err.status || 500));
//   //res.render('error');
// });

module.exports = app;

if (process.env.DB_TYPE === "mysql") {
  const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST ?? "localhost",
    port: parseInt(process.env.MYSQL_PORT ?? "3306"),
    user: process.env.MYSQL_USERNAME ?? "root",
    password: process.env.MYSQL_PASSWORD ?? "root",
    database: process.env.MYSQL_DATABASE ?? "rucores",
    multipleStatements: true,
  });

  connection.connect((err) => {
    if (err) throw err;
    console.log("Connected to the database.");

    // Read the SQL script
    let sql = fs.readFileSync("src/database/reset_db.sql", "utf8");
    sql = sql.replace(/\r|\n/g, " ");
    console.log("SQL script: {%s}", sql);

    // Execute the SQL script
    connection.query(sql, (err) => {
      if (err) throw err;
      console.log("SQL script executed successfully.");

      // Close the connection
      connection.end((err) => {
        if (err) throw err;
        console.log("Connection closed.");
      });
    });
  });
}

AppDataSource.initialize()
  .then(async () => {
    log.debug("Data Source initialized");
    await prepopulateDB().catch((err) => console.log(err));
  })
  .catch((err) => {
    console.log("Data Source failed to initialize", err);
  });

app.get("/api", (req: Request, res: Response) => {
  res.json({ message: "Hello, Express TypeScript!" });
});

const port = process.env.APP_PORT ?? 3000;
log.info(`Server starting on port ${port}`);
log.info("Available routes:");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
app._router.stack.forEach((r: any) => {
  if (r.route && r.route.path) {
    log.debug(r.route.path);
  }
});
app.listen(port, () => {
  log.debug(`Server is running on port ${port}`);
});

// Start by running npx ts-node app.ts command and opening your web browser to 'http://localhost:3000/api'.

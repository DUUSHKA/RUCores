import "dotenv/config";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";

import { Request, Response } from "express";
import express from "express";
import AppDataSource from "./database/data-source";
import { prepopulateDB } from "./database/prepopulateDB";
import { createExpressServer } from "routing-controllers";
import log from "./utils/logger";
import { fetchUser, verifyUser } from "./middleware/UserAuth";
import swaggerLoader from "./utils/swaggerLoader";

const routingControllersOptions = {
  routePrefix: "/api",
  classTransformer: true,
  authorizationChecker: verifyUser,
  currentUserChecker: fetchUser,
  defaultErrorHandler: false,
  middlewares: [__dirname + "/middleware/*.ts"],
  controllers: [__dirname + "/controllers/*.ts"],
};

const app = createExpressServer(routingControllersOptions);

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
app.listen(port, () => {
  log.debug(`Server is running on port ${port}`);
});

// Start by running npx ts-node app.ts command and opening your web browser to 'http://localhost:3000/api'.

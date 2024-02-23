// Sourced from: https://github.com/w3tecch/express-typescript-boilerplate/blob/17727010f7f098d8ca8b78da0a5b3c7297659381/src/api/middlewares/ErrorHandlerMiddleware.ts#L14

import express from "express";
import {
  ExpressErrorMiddlewareInterface,
  HttpError,
  Middleware,
} from "routing-controllers";
import log from "../utils/logger";

/*
 * This middleware intercepts errors and logs them to the console.
 * Currently not activated, needs to be registered in app.ts
 */
@Middleware({ type: "after" })
export class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {
  public error(
    error: HttpError,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ): void {
    res.status(error.httpCode || 500);
    res.json({
      name: error.name,
      message: error.message,
    });

    log.error(`[${error.name}] ${error.message}`, error.stack);
    next();
  }
}

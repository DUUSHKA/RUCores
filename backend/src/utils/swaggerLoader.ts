// Reference: https://github.com/w3tecch/express-typescript-boilerplate/blob/develop/src/loaders/swaggerLoader.ts

import { validationMetadatasToSchemas } from "class-validator-jsonschema";
import express from "express";
import { SchemaObject } from "openapi3-ts/dist/model/OpenApi";
import {
  getMetadataArgsStorage,
  RoutingControllersOptions,
} from "routing-controllers";
import { routingControllersToSpec } from "routing-controllers-openapi";
import * as swaggerUi from "swagger-ui-express";
import log from "./logger";

export default (
  expressApp: express.Application,
  routingOptions: RoutingControllersOptions,
) => {
  if (process.env.SWAGGER === "true") {
    log.info("Swagger enabled");

    const schemas = validationMetadatasToSchemas({
      refPointerPrefix: "#/components/schemas/",
    });

    const swaggerFile = routingControllersToSpec(
      getMetadataArgsStorage(),
      routingOptions,
      {
        components: {
          schemas: schemas as unknown as Record<string, SchemaObject>,
        },
      },
    );

    swaggerFile.info = {
      title: "RUCores Backend",
      version: "1.0.0",
    };

    swaggerFile.servers = [
      {
        url: `http://localhost:${process.env.APP_PORT}/api`,
      },
    ];

    expressApp.use(
      "/swagger",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (_req: any, _res: any, next: () => any) => next(),
      swaggerUi.serve,
      swaggerUi.setup(swaggerFile),
    );
  }
};

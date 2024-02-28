import { OpenAPIParam } from "routing-controllers-openapi";

const auth_errors: OpenAPIParam = {
  responses: {
    "400": {
      description: "Bad Request. Invalid request body",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              name: {
                type: "string",
                example: "BadRequest",
              },
              message: {
                type: "string",
                example: "Invalid request body",
              },
              errors: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    property: {
                      type: "string",
                      example: "email",
                    },
                    constraints: {
                      type: "object",
                      properties: {
                        isEmail: {
                          type: "string",
                          example: "email must be an email",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "401": {
      description: "Unauthorized. Missing or invalid token",
    },
    "403": {
      description:
        "Forbidden. Token provided but user does not have the required roles/permissions",
    },
  },
};

export { auth_errors };

# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=21.6.2

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine as base

# Set working directory for all build stages.
WORKDIR /usr/src/app

################################################################################
# Create a stage for installing production dependecies.
FROM base as deps

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage bind mounts to package.json and package-lock.json to avoid having to copy them
# into this layer.
#Path is relative to the path defined by the docker compose file 

 RUN --mount=type=bind,source=package.json,target=package.json \
     --mount=type=bind,source=package-lock.json,target=package-lock.json \
     --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

################################################################################
# Create a stage for building the application.
FROM deps as build

# Download additional development dependencies before building, as some projects require
# "devDependencies" to be installed to build. If you don't need this, remove this step.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

# Copy the rest of the source files into the image.
COPY . .

# Change the owner and permissions of the directory
#RUN chown node /usr/src/app && chmod 755 /usr/src/app

# Change the owner and permissions of the SQLite database file
#RUN chown node /usr/src/app/database.sqlite3 && chmod 644 /usr/src/app/database.sqlite3

#RUN useradd -m node && chown node /usr/src/app && chmod 755 /usr/src/app
#RUN chown node /usr/src/app/database.sqlite3 && chmod 644 /usr/src/app/database.sqlite3

# Run the build script.
RUN npm run build

################################################################################
# Create a new stage to run the application with minimal runtime dependencies
# where the necessary files are copied from the build stage.
FROM base as final

# Use production node environment by default.
ENV NODE_ENV production

# Copy package.json so that package manager commands can be used.
COPY package.json .

# Copy the production dependencies from the deps stage and also
# the built application from the build stage into the image.
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app .
# COPY --from=build /usr/src/app/bin ./bin

# Change access to DB file, then Run the application as a non-root user.
#RUN chmod 777 /usr/src/app && chmod 777 /usr/src/app/database.sqlite3
RUN touch /usr/src/app/database.sqlite3 && chmod 777 /usr/src/app && \
chmod 777 /usr/src/app/database.sqlite3
USER node

# USER root 
# RUN echo -e "PREPOPULATE_DB=false\n\
# SQLITE_DB_PATH=../RUCores_DB.sqlite3\n\
# DB_LOGGING=false\nDB_SYNCHRONIZE=true\n\
# DB_TYPE=sqlite\nAPP_PORT=3001\nLOG_LEVEL=debug\n\
# SWAGGER=true\nRESPONSE_STACKTRACE=true" > .env

# Expose the port that the application listens on.
EXPOSE 3000
EXPOSE 3001

# Run the application.
CMD npm start

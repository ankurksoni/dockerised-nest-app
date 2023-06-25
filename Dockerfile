# The first thing we need to do is define from what image we want to build from. 
# Here we will use the latest LTS (long term support) version 18 of node available from the Docker Hub
FROM node:18-alpine AS PROD_BUILD_INTERMEDIATE

RUN npm i -g @nestjs/cli

# Next we create a directory to hold the application code inside the image,
# this will be the working directory for your application:
WORKDIR /usr/src/app

# To bundle your app's source code inside the Docker image,
COPY src ./src/
COPY nest-cli.json .
COPY yarn.lock .
COPY package.json .
COPY tsconfig.json .
COPY tsconfig.build.json .

# This command will not install upgraded pkgs. for more visit link
# https://stackoverflow.com/a/76219090/3296607
RUN yarn install --ignore-scripts --frozen-lockfile --production

# Creates a "dist" folder with the production build
RUN yarn run build

# Use the nonroot user from the image (instead of the root user)
RUN addgroup -S nonroot \
    && adduser -S nonroot -G nonroot

# Use the nonroot user from the image (instead of the root user)
USER nonroot

FROM node:18-alpine AS PROD

# Copy the bundled code from the PROD_BUILD_INTERMEDIATE stage to the PROD image
COPY --from=PROD_BUILD_INTERMEDIATE /usr/src/app/node_modules /opt/nest-app/node_modules
COPY --from=PROD_BUILD_INTERMEDIATE /usr/src/app/dist /opt/nest-app

RUN apk add --no-cache curl
RUN npm install pm2 -g

EXPOSE 3000
ENV NODE_ENV=production
ENV AWS_NODEJS_CONNECTION_REUSE_ENABLED=1

# Use the nonroot user from the image (instead of the root user)
RUN addgroup -S nonroot \
    && adduser -S nonroot -G nonroot

# Use the nonroot user from the image (instead of the root user)
USER nonroot

# CMD ["node", "/opt/nest-app/main.js"]
CMD ["pm2-runtime", "/opt/nest-app/main.js"]
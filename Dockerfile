# The first thing we need to do is define from what image we want to build from. 
# Here we will use the latest LTS (long term support) version 18 of node available from the Docker Hub
FROM node:18-alpine AS PROD_BUILD_INTERMEDIATE

RUN addgroup -S nonroot \
    && adduser -S nonroot -G nonroot
# Next we create a directory to hold the application code inside the image,
# this will be the working directory for your application:
WORKDIR /usr/src/app

# This image comes with Node.js and NPM already installed so the next thing we need to do is to install 
# your app dependencies using the npm binary. Please note that if you are using npm version 4 or
# a package-lock.json file will not be generated.
ADD package.json ./
ADD yarn.lock ./
ADD tsconfig.json ./
ADD tsconfig.build.json ./
# COPY --chown=node:node src ./

RUN npm i -g @nestjs/cli

# This command will not install upgraded pkgs. for more visit link
# https://stackoverflow.com/a/76219090/3296607
RUN yarn install --ignore-scripts --frozen-lockfile --production

RUN echo "-----------PROJECT STRUCTURE-----------"; ls -ltr /usr/src/app/; echo "---------------------------------------"
# To bundle your app's source code inside the Docker image,
COPY package.json /usr/src/app
COPY yarn.lock /usr/src/app
COPY tsconfig.json /usr/src/app
COPY tsconfig.build.json /usr/src/app
COPY node_modules/* /usr/src/app/node_modules/

# Creates a "dist" folder with the production build
RUN yarn run build

USER nonroot

FROM node:18-alpine AS PROD

WORKDIR /usr/src/app

# Copy the bundled code from the PROD_BUILD_INTERMEDIATE stage to the PROD image
COPY --from=PROD_BUILD_INTERMEDIATE /usr/src/app/node_modules /opt/nest-app/node_modules
COPY --from=PROD_BUILD_INTERMEDIATE /usr/src/app/dist /opt/nest-app

RUN apk add --no-cache curl
RUN npm install pm2 -g

EXPOSE 3000
ENV NODE_ENV=production
ENV AWS_NODEJS_CONNECTION_REUSE_ENABLED=1

# CMD ["node", "/opt/nest-app/main.js"]
CMD ["pm2-runtime", "/opt/nest-app/main.js"]
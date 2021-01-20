FROM node:13
WORKDIR /usr/src/app
COPY dist/ .
RUN npm install --production
EXPOSE 3000
CMD [ "npm", "run", "start" ]
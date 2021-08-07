FROM node:16.2.0-alpine
COPY zthun-roadblock.api*.tgz /usr/src/packages/zthun-roadblock.api.tgz
RUN npm install -g /usr/src/packages/zthun-roadblock.api.tgz
EXPOSE 3000
CMD ["zthun-roadblock"]

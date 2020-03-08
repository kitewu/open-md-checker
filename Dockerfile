FROM node:10

RUN npm i -g open-md-checker && npm i -g tslib

WORKDIR /github/workspace

CMD ["open-md-checker"]

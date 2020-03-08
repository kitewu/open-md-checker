FROM node:10

RUN npm i -g open-md-checker && npm i -g tslib
RUN mkdir /workspace

WORKDIR /workspace

CMD ["open-md-checker"]

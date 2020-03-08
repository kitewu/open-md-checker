FROM node:10

RUN npm i -g open-md-checker && npm i -g tslib

RUN mkdir /workspace
WORKDIR /workspace

ADD entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

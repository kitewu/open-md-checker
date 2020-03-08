FROM node:10-jessie

RUN npm install -g open-md-checker
RUN mkdir /workspace

WORKDIR /workspace

CMD ["open-md-checker"]

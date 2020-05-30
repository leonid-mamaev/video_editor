FROM node:14

WORKDIR /usr/src/app

COPY ./package.json ./
RUN npm install

ARG REACT_APP_SERVER_URL
ENV REACT_APP_SERVER_URL $REACT_APP_SERVER_URL

COPY . .

RUN npm run-script build
RUN npm install serve --global

EXPOSE 3000

CMD serve -s build -l 3000

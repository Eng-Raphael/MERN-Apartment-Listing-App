#FROM node:18
#
#WORKDIR /src
#
#COPY package*.json ./
#RUN npm install
#
#COPY . .
#
#ENV PORT=5001
#EXPOSE 5001
#
#CMD ["npm", "run", "dev"]

FROM node:18

WORKDIR /src

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build
EXPOSE 5001

CMD ["npm", "start"]

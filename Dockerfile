FROM node:20-alpine

WORKDIR /app

COPY package.json ./
COPY server.js ./
COPY pragathi-wellness-centre.html ./
COPY data ./data
COPY assets ./assets

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["npm", "start"]

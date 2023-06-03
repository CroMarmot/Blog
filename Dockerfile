# Build image
# docker build -f Dockerfile -t cmmblog --network="host" --build-arg http_proxy="http://localhost:12346" --build-arg https_proxy="http://localhost:12346" .
# check the ip of host instead of 127.0.0.1
# and check firewall
#   ifconfig | grep docker -A1
# Dev:
#   docker run --name blog --rm -d -v $(pwd)/source/_posts:/app/source/_posts -v $(pwd)/source/_drafts:/app/source/_drafts -p 4000:4000 cmmblog
#
# Build:
#   rm -rf public && mkdir public
#   docker run --name blog --rm -u $(id -u):$(id -g) -v $(pwd)/source/_posts:/app/source/_posts -v $(pwd)/source/_drafts:/app/source/_drafts -v $(pwd)/public:/app/public -v $(pwd)/db.json:/app/db.json cmmblog build

# FROM python:3
FROM node:18
WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN --mount=type=cache,target=/root/.cache/pip \
  yarn

COPY . .
EXPOSE 4000
ENTRYPOINT ["yarn"]
CMD ["server"]

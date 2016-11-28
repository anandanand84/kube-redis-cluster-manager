FROM node:latest
MAINTAINER anand.anand84@gmail.com
RUN apt-get update
RUN apt-get -y install ruby vim wget redis-tools redis-server
RUN gem install redis
COPY ./package.json src/
RUN cd src && npm install
COPY . src/
RUN wget http://download.redis.io/redis-stable/src/redis-trib.rb
RUN chmod +x redis-trib.rb
WORKDIR src/
CMD ["node","index.js"]
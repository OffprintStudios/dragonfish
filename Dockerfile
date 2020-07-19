FROM ubuntu:focal

RUN apt-get update && apt-get install -y curl wget gnupg

RUN curl -sL https://deb.nodesource.com/setup_lts.x | bash -
RUN curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

RUN apt-get update && apt-get install -y \
    nodejs=12.18.2-deb-1nodesource1 \
    yarn=1.22.1-1

RUN npm install -g typescript@3.8.3 \
    @angular/cli@9.1.5 \
    @nestjs/cli@7.1.5

WORKDIR /opt/pulpd

EXPOSE 3000

CMD ["nest", "start"]

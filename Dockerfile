FROM ubuntu:focal

RUN apt-get update && apt-get install -y curl wget gnupg

RUN curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

# This is the only way to pin to Node 12.17.0, the nodesource repository removes
# old point versions whenever they do a minor update (which breaks our attempt to 
# pin to a specific version with apt-get)
RUN wget --quiet --output-document=node-lts.deb 'https://deb.nodesource.com/node_12.x/pool/main/n/nodejs/nodejs_12.17.0-deb-1nodesource1_amd64.deb' \
    && apt install -y ./node-lts.deb \
    && rm node-lts.deb
    
RUN apt-get update && apt-get install -y \
    yarn=1.22.1-1 \
    build-essential \
    llvm-dev \
    libclang-dev \
    clang

RUN npm install -g typescript@3.8.3 \
    @angular/cli@9.1.5 \
    @nestjs/cli@7.1.5

# Download rust and add it to the PATH
RUN curl https://sh.rustup.rs -sSf |  bash -s -- -y
RUN echo 'source $HOME/.cargo/env' >> $HOME/.bashrc

WORKDIR /opt/pulpd

EXPOSE 3000

CMD ["nest", "start"]

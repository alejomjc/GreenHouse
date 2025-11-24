FROM node:18-bullseye

WORKDIR /usr/src/app

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    build-essential python3 git curl ca-certificates g++ make chromium \
  && rm -rf /var/lib/apt/lists/*

ENV NPM_CONFIG_UNSAFE_PERM=true
ENV NODE_OPTIONS=--max_old_space_size=4096
ENV CHROME_BIN=/usr/bin/chromium

COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then \
      npm ci --silent --no-audit --progress=false --legacy-peer-deps; \
    else \
      npm install --silent --no-audit --progress=false --legacy-peer-deps; \
    fi

RUN npm install -g @angular/cli@15 --silent || true

COPY . .

COPY wait-for-web.sh /usr/src/app/wait-for-web.sh
RUN chmod +x /usr/src/app/wait-for-web.sh

EXPOSE 4200

ENTRYPOINT ["/usr/src/app/wait-for-web.sh"]
CMD ["npm", "start"]

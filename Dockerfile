FROM node:alpine AS runner

WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001


COPY next.config.js ./
COPY next-i18next.config.js ./
COPY public ./public
COPY --chown=nextjs:nodejs .next ./.next
COPY node_modules ./node_modules
COPY package.json ./package.json

USER nextjs

EXPOSE 8080

ENV NEXT_TELEMETRY_DISABLED 1

CMD ["npm", "run", "startProd"]
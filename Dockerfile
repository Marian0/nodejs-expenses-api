FROM node:14

# Create work directory
WORKDIR /src

# Install runtime dependencies
RUN npm install typescript -g

# Copy app source to work directory
COPY . /src

# Install app dependencies
RUN yarn install

# Build
RUN yarn build

EXPOSE 3000
CMD ["node", "dist/main.js"]

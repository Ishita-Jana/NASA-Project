# This Dockerfile is created to write instructions for the container.
FROM node:lts-alpine 

# Create app directory
WORKDIR /app

#copying nasa folder to /app folder denoting by first dot and second dot 
# COPY . .

#copying only dependencies to app
COPY package*.json ./



# Install app dependencies only needed for production i.e excluding devDependencies
# Taking care of the dependencies which does and doesnot work on some of the base or host machines
# RUN npm install --only=production

#breaking down the above command into two commands

COPY client/package*.json client/
RUN npm run install-client --only=production

# Install app dependencies for server
COPY server/package*.json server/
RUN npm run install-server --only=production


# Copy the entire client folder and build
COPY client/ client/
RUN npm run build --prefix client

# Copy the server code
COPY server/ server/





#user has been created to run the container as non-root user
USER node

#docker container starts from here
CMD ["npm", "start", "--prefix", "server"]

EXPOSE 8000



#docker build . -t ishitajana/nasa-project

#running a container using the image created
#docker run -p 8000:8000 ishitajana/nasa-project
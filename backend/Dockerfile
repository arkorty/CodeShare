# Dockerfile for the backend service

# Use an official Golang runtime as a parent image
FROM golang:latest

# Set the working directory in the container
WORKDIR /app

# Copy the local package files to the container's workspace
COPY . .

# Build the Go app
RUN go build -o server .

# Expose port 8080 to the outside world
EXPOSE 8080

# Command to run the executable
CMD sleep 5s && ./server

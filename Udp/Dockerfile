# Use the official Python image from Docker Hub
FROM python:3.12-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the Python script to the working directory
COPY udpSocket.py /app/udpSocket.py

RUN mkdir -p /var/log/udpServer && \
    chown -R nobody:nogroup /var/log/udpServer
USER nobody
# Run the UDP server script
CMD ["python", "udpSocket.py"]
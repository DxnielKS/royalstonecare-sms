#!/bin/bash

if [ "$1" == "restart" ]; then
  echo "🔍 Finding the container ID..."
  container_id=$(docker ps -q --filter ancestor=rsc-sms)

  if [ -n "$container_id" ]; then
    echo "🛑 Stopping the container..."
    docker stop $container_id

    echo "🗑️ Removing the container..."
    docker rm $container_id
  else
    echo "🤷 No running container found."
  fi

  echo "🏗️ Building the Docker image..."
  docker build -t rsc-sms .

  echo "🚀 Running the new container..."
  docker run -d \
    --restart unless-stopped \
    -p 3000:80 \
    -t rsc-sms

  echo "✅ Webapp restarted successfully!"
else
  echo "❓ Unknown command. Usage: ./rsc restart"
fi 
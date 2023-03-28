#!/bin/bash
chmod +x build.sh
docker build -t $DOCKER_CONTAINER_NAME .
docker tag $DOCKER_CONTAINER_NAME:latest $ECR/$DOCKER_CONTAINER_NAME:latest
docker push $ECR/$DOCKER_CONTAINER_NAME:latest
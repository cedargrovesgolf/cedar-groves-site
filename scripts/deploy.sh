#!/bin/bash
ssh-keyscan $EC2_INSTANCE_IP_ADDRESS >> ~/.ssh/known_hosts
ssh $EC2_INSTANCE_USERNAME@$EC2_INSTANCE_IP_ADDRESS "\
  aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR && \
  docker pull $ECR/$DOCKER_CONTAINER_NAME:latest && \
  if docker ps -a | grep $DOCKER_CONTAINER_NAME; then \
    docker stop $DOCKER_CONTAINER_NAME && \
    docker rm $DOCKER_CONTAINER_NAME; \
  fi && \
  docker run -d -p $PORT:$PORT --name $DOCKER_CONTAINER_NAME $ECR/$DOCKER_CONTAINER_NAME:latest"

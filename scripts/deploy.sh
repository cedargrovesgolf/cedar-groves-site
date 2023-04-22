#!/bin/bash
#deploy.sh
ssh-keyscan $EC2_INSTANCE_IP_ADDRESS >> ~/.ssh/known_hosts
ssh $EC2_INSTANCE_USERNAME@$EC2_INSTANCE_IP_ADDRESS "\
  aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR; \
  docker system prune -af; \
  docker container prune -f; \
  docker image prune -af; \
  docker network prune -f; \
  docker volume prune -f; \
  docker pull $ECR/$CIRCLE_PROJECT_REPONAME:latest; \
  if docker ps -a | grep $CIRCLE_PROJECT_REPONAME; then \
    docker stop $CIRCLE_PROJECT_REPONAME; \
    docker rm $CIRCLE_PROJECT_REPONAME; \
  fi; \
  docker run -d -p $PORT:$PORT --env-file /opt/cedargroves/.env --name $CIRCLE_PROJECT_REPONAME $ECR/$CIRCLE_PROJECT_REPONAME:latest"
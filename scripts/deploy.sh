#!/bin/bash
#deploy.sh
set -eo pipefail
ssh-keyscan $EC2_INSTANCE_IP_ADDRESS >> ~/.ssh/known_hosts
aws ecr get-login-password --region $AWS_REGION | ssh $EC2_INSTANCE_USERNAME@$EC2_INSTANCE_IP_ADDRESS "docker login --username AWS --password-stdin $ECR"
ssh $EC2_INSTANCE_USERNAME@$EC2_INSTANCE_IP_ADDRESS "\
  set -e; \
  docker pull $ECR/$CIRCLE_PROJECT_REPONAME:latest; \
  if docker ps -a | grep $CIRCLE_PROJECT_REPONAME; then \
    docker stop $CIRCLE_PROJECT_REPONAME; \
    docker rm $CIRCLE_PROJECT_REPONAME; \
  fi; \
  docker run -d --restart unless-stopped -v ~/.aws:/home/node/.aws -p $PORT:$PORT --env-file /opt/cedargroves/.env --name $CIRCLE_PROJECT_REPONAME $ECR/$CIRCLE_PROJECT_REPONAME:latest; \
  docker system prune -af; \
  docker volume prune -f"

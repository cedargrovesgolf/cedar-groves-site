#!/bin/bash
#build.sh
docker build -t $ECR/$CIRCLE_PROJECT_REPONAME:$VERSION -t $ECR/$CIRCLE_PROJECT_REPONAME:latest .
docker push $ECR/$CIRCLE_PROJECT_REPONAME:$VERSION
docker push $ECR/$CIRCLE_PROJECT_REPONAME:latest
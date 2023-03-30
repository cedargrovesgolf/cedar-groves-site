#!/bin/bash
#build.sh
docker build -t $CIRCLE_PROJECT_REPONAME .
docker tag $CIRCLE_PROJECT_REPONAME:latest $ECR/$CIRCLE_PROJECT_REPONAME:latest
docker push $ECR/$CIRCLE_PROJECT_REPONAME:latest
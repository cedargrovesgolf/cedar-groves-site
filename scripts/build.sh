#!/bin/bash
#build.sh
set -eo pipefail
IMAGE=$ECR/$CIRCLE_PROJECT_REPONAME
docker build -t $IMAGE:$CIRCLE_SHA1 -t $IMAGE:latest .
docker push $IMAGE:$CIRCLE_SHA1
docker push $IMAGE:latest

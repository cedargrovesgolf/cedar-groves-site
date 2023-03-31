#!/bin/bash
#release.sh
github-release release \
    --user $CIRCLE_USERNAME \
    --repo $CIRCLE_PROJECT_REPONAME \
    --tag $VERSION \
    --name $CIRCLE_PROJECT_REPONAME"."$VERSION"-build-"$VERSION".zip" \
    --description "test"
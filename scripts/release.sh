#!/bin/bash
#release.sh
github-release release \
    --user $CIRCLE_USERNAME \
    --repo $CIRCLE_PROJECT_REPONAME \
    --tag $VERSION \
    --name "Test" \
    --description "test"
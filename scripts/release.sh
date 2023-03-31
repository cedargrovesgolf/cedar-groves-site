#!/bin/bash
#release.sh
github-release -v release \
    --user $CIRCLE_USERNAME \
    --repo $CIRCLE_PROJECT_USERNAME/$CIRCLE_PROJECT_REPONAME \
    --tag "v1.0.0" \
    --security-token $GITHUB_TOKEN

#!/bin/bash
#release.sh
zip -r $CIRCLE_ARTIFACTS/$CIRCLE_PROJECT_REPONAME-$VERSION.zip dist/*
github-release upload \
    --user $CIRCLE_USERNAME \
    --repo $CIRCLE_PROJECT_REPONAME \
    --tag $VERSION \
    --name $CIRCLE_PROJECT_REPONAME"."$VERSION"-build-"$VERSION".zip" \
    --file $CIRCLE_ARTIFACTS/$CIRCLE_PROJECT_REPONAME-$VERSION.zip \
#!/bin/bash
#release.sh
RELEASE_NOTES="$(gren release --tags=$VERSION --data-source=commits)"
zip -r $CIRCLE_ARTIFACTS/$CIRCLE_PROJECT_REPONAME-$VERSION.zip dist/*
git config user.name $CIRCLE_USERNAME
gren --override --data-source=commits
github-release upload \
    --user $CIRCLE_USERNAME \
    --repo $CIRCLE_PROJECT_REPONAME \
    --tag $VERSION \
    --name $CIRCLE_PROJECT_REPONAME"."$VERSION"-build-"$VERSION".zip" \
    --file $CIRCLE_ARTIFACTS/$CIRCLE_PROJECT_REPONAME-$VERSION.zip \
    --description "$RELEASE_NOTES"
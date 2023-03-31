#!/bin/bash
#release.sh
export RELEASE_NOTES="$(gren release --tags=$VERSION --data-source=commits)"
github-release release \
    --user "$CIRCLE_USERNAME" \
    --repo "$CIRCLE_PROJECT_REPONAME" \
    --tag "$VERSION" \
    --name "$CIRCLE_PROJECT_REPONAME $VERSION" \
    --description "$RELEASE_NOTES"

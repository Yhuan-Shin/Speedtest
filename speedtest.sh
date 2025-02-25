#!/bin/bash

curl -sL https://firebase.tools | bash
FIREBASE_TOKEN="1//0eeQfSXesVYrpCgYIARAAGA4SNwF-L9IrIBwCtqW0jIMCBgI7GDlPmF2kwjRBUmGwcpLYoIX_7pnXebz4tpNUKUpU2xtaING0-qo"
PROJECT_ID="yhuanapp"
COLLECTION_NAME="default"


speedtest-cli --json > file.json
curl -X POST -H "Authorization: Bearer $FIREBASE_TOKEN" -H "Content-Type: application/json" -d file.json "https://firestore.googleapis.com/v1/projects/$PROJECT_ID/databases/(default)/documents/$COLLECTION_NAME"
echo "Speed test done!"


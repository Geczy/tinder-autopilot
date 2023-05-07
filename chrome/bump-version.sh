#!/bin/bash

# This script updates the "version" field in the "chrome/manifest.json" file.

# Define the file path for the manifest.
manifestPath="chrome/manifest.json"

# Define the function to update the version field in the manifest.
updateVersion() {
  # Use jq to update the version field with the specified version number.
  jq ".version = \"$1\"" $manifestPath >tmp_manifest.json
  mv tmp_manifest.json $manifestPath
}

# Check if the version argument was provided.
if [[ -z $1 ]]; then
  echo "Error: Version number argument is required."
  exit 1
fi

# Update the version field in the manifest.
updateVersion "$1"

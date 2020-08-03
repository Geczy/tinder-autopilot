#!/bin/bash

echo "$( jq ".version = \"${1}\"" chrome/manifest.json )" > chrome/manifest.json

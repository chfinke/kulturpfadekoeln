#!/bin/bash

# @TODO add documentation

FILES="../gpx/*"
for f in $FILES
do
  trackMinus=${f:24:3}
  track=$(echo "$trackMinus" | sed "s/-/./")
  ./generate-gpx-with-waypoints.sh $track
done
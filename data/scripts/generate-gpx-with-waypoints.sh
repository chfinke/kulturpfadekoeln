#!/bin/bash

# @TODO add documentation

# @TODO improve this
track=$1
trackMinus=$(echo "$track" | sed "s/\./-/")

fileWithoutWaypoints="../gpx/kulturpfadekoeln_$trackMinus.gpx"
fileWithWaypoints="../generated/gpx-with-waypoints/kulturpfadekoeln_$trackMinus.gpx"

head -n -1 $fileWithoutWaypoints > $fileWithWaypoints
./create-waypoints.py $track | sed 's/^/  /' >> $fileWithWaypoints
echo "</gpx>" >> $fileWithWaypoints

#!/usr/bin/env python3
# # -*- coding: utf-8 -*-

# @TODO add documentation

import sys
import json

# @TODO check for input params
trackId = sys.argv[1]

with open('../data.json',) as f:
  data = json.load(f) 

points = data['tracks'][trackId]['points']
for pointId in points:
  point = points[pointId]
  if 'inactive' in point.keys() and point['inactive']:
    continue

  if len(point['mapPosition']['value']) == 2:
    print('<wpt lat="{lat}" lon="{lon}">'.format(
      lat=point['mapPosition']['value'][1], 
      lon=point['mapPosition']['value'][0] 
    ))
  print('  <name>{title}</name>'.format(
    title=point['title'].replace('|', '')
  ))
  description = ''
  if point['description']['state'] == '#ok' or point['description']['state'] == '#check':
    description += point['description']['value']
  if point['notes']:
    if description:
      description += '<br/>'
    description += '<i>' + point['notes'] + '</i>'
  print('  <cmt>{description}</cmt>'.format(
    description=description.strip()
  ))
  print('</wpt>')

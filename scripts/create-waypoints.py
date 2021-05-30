# -*- coding: utf-8 -*-

import sys
import json
reload(sys)
sys.setdefaultencoding('utf-8')

trackId = sys.argv[1]

with open('src/assets/data/data.json',) as f:
  data = json.load(f) 

points = data['tracks'][trackId]['points']
for pointId in points:
  point = points[pointId]
  print('\
<wpt lat="{lat}" lon="{lon}">\n\
  <name>{title}</name>\n\
  <cmt>{description}</cmt>\n\
</wpt>').format(lat=point['mapPosition'][1], lon=point['mapPosition'][0], **point)

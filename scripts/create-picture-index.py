# -*- coding: utf-8 -*-

from os import listdir
from os.path import isdir, isfile, join
import json

def get_folders(path):
  return  [f for f in listdir(path) if isdir(join(path, f))]

def get_files(path):
  if not isdir(path):
    return []
  return  [join(path, f).replace('../pictures/', '') for f in listdir(path) if isfile(join(path, f))] # @TODO very bad pattern

data = {}

for boroughString in get_folders('../pictures'):
  if boroughString[0] == 'z':
    continue
  path = '../pictures/{}'.format(boroughString)
  boroughNo = boroughString.split(' ')[0].lstrip('0')
  for trackString in get_folders(path):
    trackId = '{}.{}'.format(boroughNo, trackString.lstrip('0'))
    data[trackId] = {"points": {}}
    path2 = '{}/{}'.format(path, trackString)
    for pointString in get_folders(path2):
      if not pointString.isnumeric():
        continue
      trackPoint = pointString.lstrip('0')

      data[trackId]['points']['{}.{}'.format(trackId, trackPoint)] = {
        "pictures": {
          "internet": get_files(join(path2, pointString, 'internet')),
          "own": get_files(join(path2, pointString, 'eigene'))
        }
      }

print(json.dumps({"tracks": data}))

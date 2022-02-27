# -*- coding: utf-8 -*-

from os import listdir
from os.path import isdir, isfile, join
import json
from PIL import Image
from PIL.ExifTags import TAGS
from PIL.ExifTags import GPSTAGS

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
        "pictures": {}
      }
      authors = get_folders(join(path2, pointString))
      for author in authors:
        data[trackId]['points']['{}.{}'.format(trackId, trackPoint)]['pictures'][author] = get_files(join(path2, pointString, author)),

print(json.dumps({"tracks": data}))

# @TODO extract position

# def get_exif(filename):
#   image = Image.open(filename)
#   image.verify()
#   return image._getexif()

# def get_labeled_exif(exif):
#   labeled = {}
#   for (key, val) in exif.items():
#     labeled[TAGS.get(key)] = val
#   return labeled

# def get_geotagging(exif):
#   if not exif:
#     raise ValueError("No EXIF metadata found")
#   geotagging = {}
#   for (idx, tag) in TAGS.items():
#     if tag == 'GPSInfo':
#       if idx not in exif:
#         raise ValueError("No EXIF geotagging found")
#       for (key, val) in GPSTAGS.items():
#         if key in exif[idx]:
#           geotagging[val] = exif[idx][key]
#   return geotagging

# def get_decimal_from_dms(dms, ref):
#   degrees = dms[0][0] / dms[0][1]
#   minutes = dms[1][0] / dms[1][1] / 60.0
#   seconds = dms[2][0] / dms[2][1] / 3600.0
#   if ref in ['S', 'W']:
#     degrees = -degrees
#     minutes = -minutes
#     seconds = -seconds
#   return round(degrees + minutes + seconds, 5)

# def get_coordinates(geotags):
#   lat = get_decimal_from_dms(geotags['GPSLatitude'], geotags['GPSLatitudeRef'])
#   lon = get_decimal_from_dms(geotags['GPSLongitude'], geotags['GPSLongitudeRef'])
#   return (lat,lon)

# path3 = "../pictures/09 Mülheim/02/17/eigene"
# for picture in get_files(path3):
#   exif = get_exif(join("../pictures/", picture))
#   geotags = get_geotagging(exif)
#   print(get_coordinates(geotags))

# -*- coding: utf-8 -*-

import sys
import json

def main(argv):
  [track, start, end] = argv
  track = argv[0]
  start = int(argv[1])
  end = int(argv[2])

  data = {}
  
  for i in range(start, end+1):
    if i == start:
      predecessor = ""
    else:
      predecessor = '{}.{}'.format(track, i-1)
    if i == end:
      successor = ""
    else:
      successor = '{}.{}'.format(track, i+1)

    data["{}.{}".format(track, i)] = {
      "trackPoint": i,
      "trackSubpt": "", 
      "quarter": "",
      "predecessor": predecessor,
      "successor": successor,
      "inactive": True,
      "title": "",
      "description": {
        "state": "#unknown",
        "value": ""
      },
      "mapPosition": {
        "state": "#unknown",
        "value": [ ]
      },
      "buildings": {
        "state": "#unknown"
      },
      "info": {
        "state": "#unknown"
      },
      "notes": "",
      "wiki": {
        "state": "#unknown"
      },
      "monumentNo": {
        "state": "#unknown"
      }
    }
  print(json.dumps(data))

if __name__ == "__main__":
   main(sys.argv[1:])
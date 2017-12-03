
var map, featureList, boroughSearch = [], infoSearch = [], startSearch = [], markerSearch = [];

function fitBounds() {
/* Fit map to boroughs bounds */
  bounds = infos.getBounds();
  bounds2 = starts.getBounds();
  if (bounds2._northEast.lat > bounds._northEast.lat)
    bounds._northEast.lat = bounds2._northEast.lat;
  if (bounds2._northEast.lon > bounds._northEast.lon)
    bounds._northEast.lon = bounds2._northEast.lon;
  if (bounds2._southWest.lat < bounds._southWest.lat)
    bounds._southWest.lat = bounds2._southWest.lat;
  if (bounds2._southWest.lon < bounds._southWest.lon)
    bounds._southWest.lon = bounds2._southWest.lon;
  map.fitBounds(bounds);
}

function showAttribution(){
  document.getElementById("attribution-nav").click();  
}

function showInfoList(){
  $("#sidebar").show();
}

$('.modal-toggle').click(function (e) {
    var tab = e.target.hash; 
    $('li > a[href="' + tab + '"]').tab("show");
});

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
     var pair = vars[i].split("=");
     if(pair[0] == variable){return pair[1];}
   }
   return(false);
}

function search(id, array){
  for (var i=0; i < array.length; i++) {
    if (array[i].id === id) {
      return array[i];
    }
  }
  return false;
}

function jumpToInfo(id){
  var marker = search(id, markerSearch);
  var layer = infos.getLayer(marker.layer);
  map.setView([layer.getLatLng().lat, layer.getLatLng().lng]);
  layer.fire("click");
}


function getInfoTextContent(feature){
  var content = "";
  if (typeof feature == 'undefined' || !feature.properties) {
    content += "\
<b>Herzlich Wilkommen!</b><br/>\
<p>Die Kulturpfade Köln sind eine Reihe von Rad- bzw. Wanderwegen im Kölner Stadtgebiet. Die Pfade sind mit Informationstafeln aufbereitet und führen an sehenswürdigen Plätzen und Gebäuden entlang.</p>\
<p>Allerdings ist der Weg nicht ausgeschildert und einige Informationstafeln existieren nicht mehr. Daher soll diese Seite die Informationen vervollständigen und in einer nutzbaren Form darstellen.</p>";
    content += news;
    content += "\
<br/><small><a onclick=\"showAttribution();\" href=\"#\">Quellen/Beitragende<a></small>";
  } else {
    if (feature.properties.track_point == "0"){
      content += "<b>" + feature.properties.borough + " " + feature.properties.title + "</b><br/>";
    } else {
      content += "<b>" + feature.properties.title + "</b> - " + feature.properties.borough + " " + feature.properties.track_no + "." + feature.properties.track_point + " (" + feature.properties.quarter + ")" + "<br/>";
    }
     
    content += feature.properties.description;
    
    if (feature.properties.notes) {
      if (content.length > 0)
        content += "<br/><br/>";
      content += "<i>Hinweise der Redaktion</i>:<br/>";
      content += feature.properties.notes;
    }
    if (feature.properties.internal_notes) {
      if (content.length > 0)
        content += "<br/><br/>";
      content += "<i>Interne Hinweise</i>:<br/>";
      content += feature.properties.internal_notes;
    }
    if (feature.properties.additional_info) {
      if (content.length > 0)
        content += "<br/><br/>";
      content += "<i>Weitere Informationen</i>:<br/><ul>";
    }
    if (feature.properties.additional_info) {
      content += feature.properties.additional_info;
    }
      
    if (feature.properties.additional_info) {
      content += "</ul>";
    } else if (feature.properties.successor) {
      content += "<br/><br/>";
    }
    if (feature.properties.successor) {
      content += "Zur <a href=\"#\" accesskey=\"n\" onclick=\"jumpToInfo('" + feature.properties.successor + "')\">nächsten</a> Infotafel.";
    }
    content += "<br/><br/><small>\
    <a href=\"#\" rel=\"nofollow\" onclick=\"this.href='mailto:' + 'ch_finke' + '@' + 'web.de' + '?subject=Kulturpfade Köln (" + 
    feature.properties.borough_no + "." + feature.properties.track_no + "." + feature.properties.track_point + feature.properties.track_subpt
    + ")'\">\
    Feedback</a></small>";
  }
  return content;
}

$(window).resize(function() {
  sizeLayerControl();
}); //# missing in old

$(document).on("click", ".feature-row", function(e) {
  $(document).off("mouseout", ".feature-row", clearHighlight);
  sidebarClick(parseInt($(this).attr("id"), 10));
});

if ( !("ontouchstart" in window) ) {
  $(document).on("mouseover", ".feature-row", function(e) {
    highlight.clearLayers().addLayer(L.circleMarker([$(this).attr("lat"), $(this).attr("lng")], highlightStyle));
    var layer = infos.getLayer($(this).attr("id")); //# +
    layer.bringToFront(); //# +
  });
}

$(document).on("mouseout", ".feature-row", clearHighlight);

$("#about-btn").click(function() {
  $("#aboutModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#full-extent-btn").click(function() {
  fitBounds();
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#list-btn").click(function() {
  //animateSidebar(); //# -
  showInfoList(); //# +
  return false;
});

$("#nav-btn").click(function() {
  $(".navbar-collapse").collapse("toggle");
  return false;
});

$("#sidebar-toggle-btn").click(function() {
  //animateSidebar(); //# -
  showInfoList(); //# +
  return false;
});

function sizeLayerControl() {
  $(".leaflet-control-layers").css("max-height", $("#map").height() - 50);
}  //# missing in old

function clearHighlight() {
  highlight.clearLayers();
}

function sidebarClick(id) {
  var layer = markerClusters.getLayer(id);
  map.setView([layer.getLatLng().lat, layer.getLatLng().lng], 17);
  layer.fire("click");
  /* Hide sidebar and go to the map on small screens */
  if (document.body.clientWidth <= 767) {
    $("#sidebar").hide();
    map.invalidateSize();
  }
} //# missing in old

function syncSidebar() {
  /* Empty sidebar features */
  $("#feature-list tbody").empty();
  /* Loop through infos layer and add only features which are in the map bounds */
  infos.eachLayer(function (layer) {
    if (map.hasLayer(infoLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="background-color:' + layer.feature.properties.color + ';"></td><td class="feature-name">' + layer.feature.properties.borough + ' ' + layer.feature.properties.track_no + '.' + layer.feature.properties.track_point + ' ' + layer.feature.properties.title + ' (' + layer.feature.properties.quarter + ')' + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });
  /* Loop through starts layer and add only features which are in the map bounds */
  starts.eachLayer(function (layer) {
    if (map.hasLayer(startLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td></td><td class="feature-name">' + layer.feature.properties.borough + ' ' + layer.feature.properties.title + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });
  /* Update list.js featureList */
  featureList = new List("features", {
    valueNames: ["feature-name"]
  });
  featureList.sort("feature-name", {
    order: "asc"
  });
} //# missing in old

/* Basemap Layers */
var mapnik = L.tileLayer('https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {});

/* Overlay Layers */
var highlight = L.geoJson(null);
var highlightStyle = {
  radius: 8,
  color: "#000000",
  fill: false,
  weight: 3,
  opacity: 1,
};

var boroughs = L.geoJson(null, {
  style: function (feature) {
    return {
      color: "#000000",
      fill: false,
      weight: 2,
      opacity: 0.7,
      clickable: false
    };
  },
  onEachFeature: function (feature, layer) {
    boroughSearch.push({
      name: layer.feature.properties.BoroName,
      source: "Boroughs",
      id: L.stamp(layer),
      bounds: layer.getBounds()
    });
  }
});
$.getJSON("./data/geojson/boroughs.geojson", function (data) {
  boroughs.addData(data);
});


var tracks = L.geoJson(null, {
  style: function (feature) {
      return {
        color: feature.properties.color,
        weight: 3,
        opacity: 1,
        clickable: false
      };
  },
  onEachFeature: function (feature, layer) {
  }
});
$.getJSON("./data/geojson/tracks.geojson", function (data) {
  tracks.addData(data);
});

var buildings = L.geoJson(null, {
  style: function (feature) {
      return {
        color: feature.properties.color,
        weight: 3,
        opacity: 1,
        fill: true,
        fillColor: feature.properties.color,
        clickable: false
      };
  },
  onEachFeature: function (feature, layer) {
  }
});
$.getJSON("./data/geojson/buildings.geojson", function (data) {
  buildings.addData(data);
});

/* Single marker cluster layer to hold all clusters */
var markerClusters = new L.MarkerClusterGroup({
  spiderfyOnMaxZoom: true,
  showCoverageOnHover: false,
  zoomToBoundsOnClick: true,
  disableClusteringAtZoom: 1
});

/* Empty layer placeholder to add to layer control for listening when to add/remove infos to markerClusters layer */
//# check this
var infoLayer = L.geoJson(null);
var infos = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng, {
        radius: 8,
        fillColor: feature.properties.color,
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = getInfoTextContent(feature) ;
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.borough + " " + feature.properties.track_no + "." + feature.properties.track_point + " " + feature.properties.title + " (" + feature.properties.quarter + ")");
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        },
        mouseover: function (e) {
          var title = feature.properties.borough + " " + feature.properties.track_no + "." + feature.properties.track_point + " " + feature.properties.title + " (" + feature.properties.quarter + ")";
          Tip(title);
        },
        mouseout: function (e) {
          UnTip();
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/theater.png"></td><td class="feature-name">' + layer.feature.properties.borough + ' ' + layer.feature.properties.track_no + '.' + layer.feature.properties.track_point + ' ' + layer.feature.properties.title + ' (' + layer.feature.properties.quarter + ')' + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      infoSearch.push({
        name: layer.feature.properties.borough + " " + layer.feature.properties.track_no + "." + layer.feature.properties.track_point + " " + layer.feature.properties.title + " (" + layer.feature.properties.quarter + ")",
        source: "Infos",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
      markerSearch.push({
        id: layer.feature.properties.id,
        layer: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });

    }
  }
});
$.getJSON("./data/geojson/infos.geojson", function (data) {
  infos.addData(data);
  map.addLayer(infoLayer);
});

if (getQueryVariable('test') != false) {
  $.getJSON("./data/geojson/test.geojson", function (data) {
    infos.addData(data);
  });
}

/* Empty layer placeholder to add to layer control for listening when to add/remove starts to markerClusters layer */
//# check this
var startLayer = L.geoJson(null);
var starts = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng, {
        radius: 8,
        fillColor: feature.properties.color,
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = getInfoTextContent(feature);
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.borough + " " + feature.properties.title);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        },
        mouseover: function (e) {
          var title = feature.properties.borough + " " + feature.properties.title
          Tip(title);
        },
        mouseout: function (e) {
          UnTip();
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/museum.png"></td><td class="feature-name">' + layer.feature.properties.borough + ' ' + layer.feature.properties.title + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');     
      startSearch.push({
        name: layer.feature.properties.borough + " " + layer.feature.properties.title,
        source: "starts",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("./data/geojson/starts.geojson", function (data) {
  starts.addData(data);
});

map = L.map("map", {
  layers: [mapnik, tracks, buildings, markerClusters, startLayer, highlight],
  zoomControl: false,
  attributionControl: false
});

// START HERE

/* Layer control listeners that allow for a single markerClusters layer */
map.on("overlayadd", function(e) {
  if (e.layer === infoLayer) {
    markerClusters.addLayer(infos);
    syncSidebar();
  }
  if (e.layer === startLayer) {
    markerClusters.addLayer(starts);
    syncSidebar();
  }
});

map.on("overlayremove", function(e) {
  if (e.layer === infoLayer) {
    markerClusters.removeLayer(infos);
    syncSidebar();
  }
  if (e.layer === startLayer) {
    markerClusters.removeLayer(starts);
    syncSidebar();
  }
});

/* Filter sidebar feature list to only show features in current map bounds */
map.on("moveend", function (e) {
  syncSidebar();
});

/* Clear feature highlight when map is clicked */
map.on("click", function(e) {
  highlight.clearLayers();
});

/* Attribution control */
function updateAttribution(e) {
  $.each(map._layers, function(index, layer) {
    if (layer.getAttribution) {
      $("#attribution").html((layer.getAttribution()));
    }
  });
}
map.on("layeradd", updateAttribution);
map.on("layerremove", updateAttribution);

var attributionControl = L.control({
  position: "bottomright"
});
attributionControl.onAdd = function (map) {
  var div = L.DomUtil.create("div", "leaflet-control-attribution");
  div.innerHTML = "<span class='hidden-xs'>Entwickelt im <a target=\"_blank\" href='http://codefor.de/koeln/'>OK Lab Köln</a> | </span><a onclick=\"showAttribution();\" href=\"#\">Beitragende</a>";
  return div;
};
map.addControl(attributionControl);

var zoomControl = L.control.zoom({
  position: "bottomright"
}).addTo(map);

/* GPS enabled geolocation control set to follow the user's location */
var locateControl = L.control.locate({
  position: "bottomright",
  drawCircle: true,
  follow: true,
  setView: true,
  keepCurrentZoomLevel: true,
  markerStyle: {
    weight: 1,
    opacity: 0.8,
    fillOpacity: 0.8
  },
  circleStyle: {
    weight: 1,
    clickable: false
  },
  icon: "fa fa-location-arrow",
  metric: false,
  strings: {
    title: "My location",
    popup: "You are within {distance} {unit} from this point",
    outsideMapBoundsMsg: "You seem located outside the boundaries of the map"
  },
  locateOptions: {
    maxZoom: 18,
    watch: true,
    enableHighAccuracy: true,
    maximumAge: 10000,
    timeout: 10000
  }
}).addTo(map);

var groupedOverlays = {
  "Kulturpfade": {
    "Infotafeln": infoLayer,
    "Startpunkte": startLayer,
    "Pfade": tracks,
    "Gebäude": buildings
  },
  "Stadtgebiet": {
    "Stadtbezirke": boroughs
  }
};

var layerControl = L.control.groupedLayers({}, groupedOverlays, {
  collapsed: true
}).addTo(map);

/* Highlight search box text on click */
$("#searchbox").click(function () {
  $(this).select();
});

/* Prevent hitting enter from refreshing the page */
$("#searchbox").keypress(function (e) {
  if (e.which == 13) {
    e.preventDefault();
  }
});

$("#featureModal").on("hidden.bs.modal", function (e) {
  $(document).on("mouseout", ".feature-row", clearHighlight);
});

/* Typeahead search functionality */
$(document).one("ajaxStop", function () {
  $("#loading").hide();
  sizeLayerControl();
  fitBounds();
  featureList = new List("features", {valueNames: ["feature-name"]});
  featureList.sort("feature-name", {order:"asc"});
  
  // Fix 
  markerClusters.removeLayer(starts);
  markerClusters.addLayer(starts);
  syncSidebar();
  
  if (getQueryVariable('test') == false) {
    $("#welcomeModal").modal("show");
  } 
  $(".navbar-collapse.in").collapse("hide");

  var boroughsBH = new Bloodhound({
    name: "Boroughs",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: boroughSearch,
    limit: 10
  });

  var infosBH = new Bloodhound({
    name: "Infos",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: infoSearch,
    limit: 10
  });

  var startsBH = new Bloodhound({
    name: "Starts",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: startSearch,
    limit: 10
  });

  boroughsBH.initialize();
  infosBH.initialize();
  startsBH.initialize();

  /* instantiate the typeahead UI */
  $("#searchbox").typeahead({
    minLength: 3,
    highlight: true,
    hint: false
  }, {
    name: "Boroughs",
    displayKey: "name",
    source: boroughsBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'>Stadtbezirke</h4>"
    }
  }, {
    name: "Infos",
    displayKey: "name",
    source: infosBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'>Infotafeln</h4>"
      //,
      //suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
  }, {
    name: "Starts",
    displayKey: "name",
    source: startsBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'>Startpunkte</h4>"
      //,
      //suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
  }).on("typeahead:selected", function (obj, datum) {
    if (datum.source === "Boroughs") {
      map.fitBounds(datum.bounds);
    }
    if (datum.source === "Infos") {
      if (!map.hasLayer(infoLayer)) {
        map.addLayer(infoLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if (datum.source === "Starts") {
      if (!map.hasLayer(startLayer)) {
        map.addLayer(startLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if ($(".navbar-collapse").height() > 50) {
      $(".navbar-collapse").collapse("hide");
    }
  }).on("typeahead:opened", function () {
    $(".navbar-collapse.in").css("max-height", $(document).height() - $(".navbar-header").height());
    $(".navbar-collapse.in").css("height", $(document).height() - $(".navbar-header").height());
  }).on("typeahead:closed", function () {
    $(".navbar-collapse.in").css("max-height", "");
    $(".navbar-collapse.in").css("height", "");
  });
  $(".twitter-typeahead").css("position", "static");
  $(".twitter-typeahead").css("display", "block");
});

// Leaflet patch to make layer control scrollable on touch browsers
var container = $(".leaflet-control-layers")[0];
if (!L.Browser.touch) {
  L.DomEvent
  .disableClickPropagation(container)
  .disableScrollPropagation(container);
} else {
  L.DomEvent.disableClickPropagation(container);
}

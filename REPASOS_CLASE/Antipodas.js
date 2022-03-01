var map;

require(["esri/map", 
  "esri/Color",
  "esri/graphic",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/geometry/Extent",
  "esri/geometry/webMercatorUtils",
  "esri/geometry/Point",
  "dojo/on",
  "dojo/domReady!"], 

function(Map, Color, Graphic, SimpleMarkerSymbol, Extent, webMercatorUtils, Point, on) {
  map = new Map("map", {
    basemap: "gray-vector",
    center: [-3.74922, 40.463667],
    zoom: 1
  });
  antipodeMap = new Map("antipodeMap", {
    basemap: "dark-gray-vector",
    center: [-3.74922, 40.463667],
    zoom: 1
  });

  map.on('click', function(evt) {
    console.log('evt', evt);
    map.graphics.clear();
    antipodeMap.graphics.clear();

    const current = evt.mapPoint;

    var pointSymbol = new SimpleMarkerSymbol();
    pointSymbol.setSize(12);
    pointSymbol.setColor(new Color([103, 23, 211, 1]));

    var graphic = new Graphic(current, pointSymbol);
    map.graphics.add(graphic);
   

    // Antípoda
    var centerLatLong = webMercatorUtils.xyToLngLat(current.x, current.y);

    var latitud = -centerLatLong[1];
    var longitud;
    if (centerLatLong[0] < 0){
      longitud = centerLatLong[0] + 180;
    }
    else{
      longitud = centerLatLong[0] - 180;
    }
   
    // Opt1 - Transformándolo de nuevo a WebMercator
    // var center2WebMercator = webMercatorUtils.lngLatToXY(longitud, latitud);
    // var center2 = new Point(center2WebMercator[0], center2WebMercator[1], map.spatialReference);	

    // Opt2 - Utilizando longitud y latitud
    var center2 = new Point(longitud, latitud)

    // Simbología Antípodas
    var antipodeSymbol = new SimpleMarkerSymbol();
    antipodeSymbol.setSize(12);
    antipodeSymbol.setColor(new Color([237, 33, 216, 1]));

    var graphicAntipode = new Graphic(center2, antipodeSymbol);

    antipodeMap.centerAndZoom(center2);
    antipodeMap.graphics.add(graphicAntipode);

  });
});
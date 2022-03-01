var mapMain;

// @formatter:off
require([
  "esri/map",
  "esri/tasks/Geoprocessor",


  "esri/toolbars/draw",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleFillSymbol",
  "esri/Color",
  "esri/graphic",

  "esri/tasks/FeatureSet",
  "esri/tasks/LinearUnit",

  "esri/tasks/locationproviders/CoordinatesLocationProvider",
  "esri/geometry/Point",
  "esri/geometry/webMercatorUtils",
  "esri/SpatialReference",



  "dojo/ready",
  "dojo/parser",
  "dojo/on",
  "dojo/_base/array"],
  function (
    Map, Geoprocessor, Draw, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, Color, Graphic, FeatureSet, LinearUnit,

    CoordinatesLocationProvider, Point, webMercatorUtils, SpatialReference,

    ready, parser, on, array) {

    ready(function () {


      parser.parse();

      // Create the maps

      mapMain = new Map("MapaIzquierda", {
        basemap: "topo",
        center: [-4.692268, 40.658077],
        zoom: 3
      });

      secondMap = new Map("MapaDerecha", {
        basemap: "dark-gray",
        center: [-4.692268, 40.658077],
        zoom: 3
      });



      // Collect the input observation point
      var tbDraw = new Draw(mapMain);

      tbDraw.activate(Draw.POINT)

      tbDraw.on("draw-complete", PuntoInicio);



      function PuntoInicio(evt) {

        mapMain.graphics.clear();

        // marker symbol for drawing viewpoint

        var Viewpoint = new SimpleMarkerSymbol();
        Viewpoint.setSize(12);
        Viewpoint.setOutline(new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 255, 255]), 1));
        Viewpoint.setColor(new Color([255, 0, 0]));


        var geometryInput = evt.geometry;

        var graphicViewpoint = new Graphic(geometryInput, Viewpoint);

        mapMain.graphics.add(graphicViewpoint);


        locatePoint(geometryInput);



        ////PARA EL MAPA 2 IGUAL 

        secondMap.graphics.clear();


        // var Viewpoint2 = new SimpleMarkerSymbol();
        // Viewpoint2.setSize(12);
        // Viewpoint2.setOutline(new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 255, 255]), 1));
        // Viewpoint2.setColor(new Color([0, 0, 255]));


        // var geometryInput2 = evt.geometry;

        // var graphicViewpoint2 = new Graphic(geometryInput2, Viewpoint2);

        // secondMap.graphics.add(graphicViewpoint2);


        // locatePoint(geometryInput2);


      };

      function locatePoint(geometryInput, geometryInput2) {

        var locationProvider = new CoordinatesLocationProvider({
          xField: geometryInput.x,
          yField: geometryInput.y,
        });



        var LatLong = webMercatorUtils.xyToLngLat(geometryInput.x, geometryInput.y);

        console.log("Localización del punto", LatLong);



        var latAntipoda = -LatLong[1];
        var longAntipoda;

        if (LatLong[0] < 0) {
          longAntipoda = LatLong[0] + 180;
        }
        else {
          longAntipoda = LatLong[0] - 180;
        }



        var PuntoAntipoda = [longAntipoda, latAntipoda];

        console.log("Localización del punto nuevo, debería ser la antípoda", PuntoAntipoda);



        var pointpode = new Point([longAntipoda,latAntipoda]);



        var Viewpoint2 = new SimpleMarkerSymbol();
        Viewpoint2.setSize(12);
        Viewpoint2.setOutline(new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 255, 255]), 1));
        Viewpoint2.setColor(new Color([0, 0, 255]));
        
        var antipodas = secondMap.graphics.add(pointpode, Viewpoint2);

        secondMap.centerAndZoom(antipodas, 3)

      };

    });
  });

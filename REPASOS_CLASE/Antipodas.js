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

  "dojo/ready",
  "dojo/parser",
  "dojo/on",
  "dojo/_base/array"],
  function (
    Map, Geoprocessor, Draw, SimpleMarkerSymbol,SimpleLineSymbol, SimpleFillSymbol, Color, Graphic,FeatureSet,LinearUnit,
    ready, parser, on, array) {
   
    ready(function () {

      
      parser.parse();

      // Create the maps

      mapMain = new Map("MapaIzquierda", {
        basemap: "topo",
        center: [-122.45, 37.75],
        zoom: 12
    });

    secondMap = new Map("MapaDerecha", {
      basemap: "dark-gray",
      center: [-122.45, 37.75],
      zoom: 12
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
        console.log("Eres un crack")
      };

      

    });
  });

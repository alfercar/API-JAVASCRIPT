//Vamos a crear un mapa, darle un analisis de viewshed a partir de un punto y a continuación procederemos a crear ediciones. ES posible que haya que dejar como comentario lo de viewshed

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


  "esri/layers/FeatureLayer",

  "esri/dijit/editing/TemplatePicker",
  "esri/dijit/editing/Editor",
  "esri/tasks/GeometryService",

  "dojo/ready",
  "dojo/parser",
  "dojo/on",
  "dojo/_base/array"],
  function (
    Map, Geoprocessor, Draw, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, Color, Graphic, FeatureSet, LinearUnit,

    FeatureLayer,

    TemplatePicker, Editor, GeometryService,

    ready, parser, on, array) {

    ready(function () {

      parser.parse();

      mapMain = new Map("divMap", {
        basemap: "topo",
        center: [-122.45, 37.75],
        zoom: 12
      });




      //AHORA LO DE EDICIÓN, LO DEL VIEWSHED ESTÁ COMO COMENTARIO DEBAJO DE TODO


      // var gp = new Geoprocessor("http://sampleserver6.arcgisonline.com/arcgis/rest/services/Elevation/ESRI_Elevation_World/GPServer/Viewshed");


      // mapMain.on("load", function () {

      //   gp.setOutSpatialReference({ wkid: 102100 });


      // });

      // var tbDraw = new Draw(mapMain);

      // tbDraw.activate(Draw.POINT)

      // tbDraw.on("draw-complete", calculateViewshed);


      // function calculateViewshed(evt) {

      //   mapMain.graphics.clear();

      //   var smsViewpoint = new SimpleMarkerSymbol();
      //   smsViewpoint.setSize(12);
      //   smsViewpoint.setOutline(new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 255, 255]), 1));
      //   smsViewpoint.setColor(new Color([255, 0, 0]));

      //   var geometryInput = evt.geometry;

      //   var graphicViewpoint = new Graphic(geometryInput, smsViewpoint);

      //   mapMain.graphics.add(graphicViewpoint);
      //   console.log("Eres un crack")

      //   var inputPoint = new FeatureSet();
      //   console.log(inputPoint);

      //   inputPoint.features.push(graphicViewpoint);

      //   var DistanceVS = new LinearUnit();
      //   DistanceVS.distance = 5;
      //   DistanceVS.units = "esriMiles";


      //   var params = {
      //     "Input_Observation_Point": inputPoint,
      //     "Viewshed_Distance": DistanceVS
      //   };

      //   console.log(params)

      //   gp.execute(params);

      //   gp.on("execute-complete", displayViewshed);


      // }

      // function displayViewshed(results, messages) {

      //   var sfsResultPolygon = new SimpleFillSymbol();
      //   sfsResultPolygon.setOutline(new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 255, 0, 0.5]), 1));
      //   sfsResultPolygon.setColor(new Color([255, 127, 0, 0.5]));

      //   var arrayFeatures = results.results[0].value.features;

      //   array.forEach(arrayFeatures, function (feature) {

      //     console.log("feature", feature);
      //     var viewShedPolygon = new Graphic(feature.geometry, sfsResultPolygon);

      //     mapMain.graphics.add(viewShedPolygon)

      //   });


      //   var extentViewshed = graphicsUtils.graphicsExtent(mapMain.graphics.graphics);
      //   mapMain.setExtent(extentViewshed, true);

      // }




    });
  });

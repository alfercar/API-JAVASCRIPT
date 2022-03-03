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
  "esri/graphicsUtils",

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
    Map, Geoprocessor, Draw, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, Color, Graphic,graphicsUtils, FeatureSet, LinearUnit,

    FeatureLayer,

    TemplatePicker, Editor, GeometryService,

    ready, parser, on, array) {

    ready(function () {

      parser.parse();

      mapMain = new Map("divMap", {
        basemap: "topo",
        center: [-116.64, 34.37],
        zoom: 10
      });




      //AHORA LO viewshed

      var gp = new Geoprocessor("http://sampleserver6.arcgisonline.com/arcgis/rest/services/Elevation/ESRI_Elevation_World/GPServer/Viewshed");


      mapMain.on("load", function () {

        gp.setOutSpatialReference({ wkid: 102100 });

      });

      on(dojo.byId("boton"), "click", pulsador);

      function pulsador() {

        var tbDraw = new Draw(mapMain);

        tbDraw.activate(Draw.POINT)

        tbDraw.on("draw-complete", calculateViewshed);
      }


      function calculateViewshed(evt) {

        mapMain.graphics.clear();

        var smsViewpoint = new SimpleMarkerSymbol();
        smsViewpoint.setSize(12);
        smsViewpoint.setOutline(new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 255, 255]), 1));
        smsViewpoint.setColor(new Color([255, 0, 0]));

        var geometryInput = evt.geometry;

        var graphicViewpoint = new Graphic(geometryInput, smsViewpoint);

        mapMain.graphics.add(graphicViewpoint);
        console.log("Eres un crack")

        var inputPoint = new FeatureSet();
        console.log(inputPoint);

        inputPoint.features.push(graphicViewpoint);

        var DistanceVS = new LinearUnit();
        DistanceVS.distance = 5;
        DistanceVS.units = "esriMiles";


        var params = {
          "Input_Observation_Point": inputPoint,
          "Viewshed_Distance": DistanceVS
        };

        console.log(params)

        gp.execute(params);

        gp.on("execute-complete", displayViewshed);


      }

      function displayViewshed(results, messages) {

        var sfsResultPolygon = new SimpleFillSymbol();
        sfsResultPolygon.setOutline(new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 255, 0, 0.5]), 1));
        sfsResultPolygon.setColor(new Color([255, 127, 0, 0.5]));

        var arrayFeatures = results.results[0].value.features;

        array.forEach(arrayFeatures, function (feature) {

          console.log("feature", feature);
          var viewShedPolygon = new Graphic(feature.geometry, sfsResultPolygon);

          mapMain.graphics.add(viewShedPolygon)

        });


        var extentViewshed = graphicsUtils.graphicsExtent(mapMain.graphics.graphics);
        mapMain.setExtent(extentViewshed, true);

      }



      ////////////////////////////////////////////////
      //EDICIÓN
      ///////////////////////////

      var flFirePoints, flFireLines, flFirePolygons;
      /*
       * Step: Construct the editable layers
       */



      flFirePoints = new FeatureLayer("http://sampleserver6.arcgisonline.com/arcgis/rest/services/Wildfire/FeatureServer/0", {
        outFields: ["*"] //les decimos ue devuelvan todos los campos
      });

      flFireLines = new FeatureLayer("http://sampleserver6.arcgisonline.com/arcgis/rest/services/Wildfire/FeatureServer/1", {
        outFields: ["*"]
      });

      flFirePolygons = new FeatureLayer("http://sampleserver6.arcgisonline.com/arcgis/rest/services/Wildfire/FeatureServer/2", {
        outFields: ["*"]
      });

      // add the editable layers to the map
      mapMain.addLayers([flFirePolygons, flFireLines, flFirePoints]);


      // Listen for the editable layers to finish loading
      mapMain.on("layers-add-result", initEditor);



      function initEditor(results) {

        // Map the event results into an array of layerInfo objects

        //Hay que hacer 2 arrays para el editor y para el template picker

        //Hace un array de los elementos


        var layerInfosWildfire = array.map(results.layers, function (result) {
          return {
            featureLayer: result.layer //Aqui le devolvemos que es un objeto
          };

        });
        console.log("layerInfosWildfire", layerInfosWildfire)

        /*
         * Step: Map the event results into an array of Layer objects
         */



        var layerWildfire = array.map(results.layers, function (result) {
          return result.layer
            ;

        });
        console.log("layerWildfire", layerWildfire)


        //La diferencia entre ambos radica en lo que te pide el editor y el template picker. Una te da la info de las layers y otra las layers per se

        /*
         * Step: Add a custom TemplatePicker widget
         */

        var TemplatePickerWidget = new TemplatePicker({
          featureLayers: layerWildfire, //No vale el la de info, en la de info hay un objeto de feature layer y eso no lo pide, pide directamente las features layers
          columns: 2
        }, "divLeft");
        TemplatePickerWidget.startup();





        /*
         * Step: Prepare the Editor widget settings
         */

        var editorsettings = {

          map: mapMain,

          geometryService: new GeometryService(
            "http://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/Geometry/GeometryServer"),// geometry service permite dibujar geometrias en el servidor

          layerInfos: layerInfosWildfire, //array de la informacion de los objetos, viene en la api

          createOptions: {
            polygonDrawTools: [Editor.CREATE_TOOL_FREEHAND_POLYGON, Editor.CREATE_TOOL_RECTANGLE, Editor.CREATE_TOOL_TRIANGLE, Editor.CREATE_TOOL_CIRCLE, Editor.CREATE_TOOL_ELLIPSE,]
          }, //Las constantes vienen en la api como constants

          toolbarVisible: true,

          templatePicker: TemplatePickerWidget,

          toolbarOptions: {
            reshapeVisible: true
          },

          enableUndoRedo: true,

          maxUndoRedoOperations: 20,

        };






        //Step: Build the Editor constructor's parameter

        var params = { settings: editorsettings }

        //Step: Construct the Editor widget


        var EditorWidget = new Editor(params, "divTop");
        EditorWidget.startup();




      };




    });
  });

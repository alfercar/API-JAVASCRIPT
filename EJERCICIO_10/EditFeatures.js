var mapMain;
var widgetEditor;

// @formatter:off
require([
  "esri/map",
  "esri/layers/FeatureLayer",

  "esri/dijit/editing/TemplatePicker",
  "esri/dijit/editing/Editor",
  "esri/tasks/GeometryService",

  "dojo/ready",
  "dojo/parser",
  "dojo/on",
  "dojo/_base/array",

  "dijit/layout/BorderContainer",
  "dijit/layout/ContentPane"],
  function (Map, FeatureLayer,

    TemplatePicker, Editor, GeometryService,

    ready, parser, on, array,
    BorderContainer, ContentPane) {
    // @formatter:on

    // Wait until DOM is ready *and* all outstanding require() calls have been resolved
    ready(function () {

      // Parse DOM nodes decorated with the data-dojo-type attribute
      parser.parse();

      /*
       * Step: Specify the proxy Url
       */


      // Create the map
      mapMain = new Map("cpCenter", {
        basemap: "topo",
        center: [-116.64, 34.37],
        zoom: 10
      });

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

            createOptions : {
              polygonDrawTools : [Editor.CREATE_TOOL_FREEHAND_POLYGON, Editor.CREATE_TOOL_RECTANGLE, Editor.CREATE_TOOL_TRIANGLE, Editor.CREATE_TOOL_CIRCLE, Editor.CREATE_TOOL_ELLIPSE,]
            }, //Las constantes vienen en la api como constants

            toolbarVisible: true,

            templatePicker: TemplatePickerWidget,

            toolbarOptions : {
              reshapeVisible : true
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
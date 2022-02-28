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

    TemplatePicker,Editor,GeometryService,

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

        //Hace un array de los elementos


        var layerInfosWildfire = array.map(results.layers, function (result) {
          return {
            featureLayer: result.layer
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
          featureLayers: layerWildfire,
          grouping: true,
          rows: "auto",
          columns: "auto"
        }, "divLeft");
        TemplatePickerWidget.startup();


        
  

        /*
         * Step: Prepare the Editor widget settings
         */

        var Editorsettings = {
          settings: {
          map: mapMain,
          templatePicker: TemplatePickerWidget,
          layerInfos: layerInfosWildfire,
          toolbarVisible: true,
          geometryService: new GeometryService (
          "http://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/Geometry/GeometryServer"),
          }
    };

    var params = {settings: Editorsettings}


  
        /*
         * Step: Build the Editor constructor's parameterd and Construct the Editor widget
         */

        var EditorWidget = new Editor(params, "divTop");
        EditorWidget.startup();


        

      };

    });
  });
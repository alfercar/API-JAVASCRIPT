require([
  "esri/map",
  "esri/geometry/Extent",

  "esri/layers/FeatureLayer",
  "esri/layers/ArcGISDynamicMapServiceLayer",

  "esri/toolbars/draw",
  "esri/graphic",

  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleMarkerSymbol",

  "esri/tasks/query",

  "esri/renderers/SimpleRenderer",
  "esri/renderers/Renderer",
  "esri/renderers/ClassBreaksRenderer",
  "esri/layers/LayerDrawingOptions",

  "esri/dijit/PopupTemplate",

  "dojo/ready",
  "dojo/parser",
  "dojo/on",
  "dojo/dom",

  "dojo/store/Memory",
  "dojo/date/locale",

  "dojo/_base/Color",
  "dojo/_base/declare",
  "dojo/_base/array",

  "dgrid/OnDemandGrid",
  "dgrid/Selection",

  "dijit/layout/BorderContainer",
  "dijit/layout/ContentPane",
  "dijit/form/Button"],

  function (
    Map, Extent,

    FeatureLayer,
    ArcGISDynamicMapServiceLayer,

    Draw, Graphic,

    SimpleFillSymbol,
    SimpleLineSymbol, SimpleMarkerSymbol,

    Query,

    SimpleRenderer, Renderer, ClassBreaksRenderer, LayerDrawingOptions,

    PopupTemplate,

    ready, parser, on, dom,
    Memory, locale,
    Color, declare, array,
    Grid, Selection,
    BorderContainer, ContentPane, Button) {
    // @formatter:on

    // Wait until DOM is ready *and* all outstanding require() calls have been resolved
    ready(function () {

      // Parse DOM nodes decorated with the data-dojo-type attribute
      parser.parse();


      // URL variables

      var condados = new ArcGISDynamicMapServiceLayer("http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer", {
        opacity: 0.5
      });


      var fill = new SimpleFillSymbol("solid", null, new Color("#A4CE67"));

      // Create the map center [-119.65, 36.87]

      mapMain = new Map("divMap", {
        basemap: "dark-gray",
        center: [-119.65, 36.87],
        zoom: 7
      });

      



      // Construct the USA layer

      condados.setVisibleLayers([0, 1, 3]);

      /*
       * Step: Complete  the  popup template
       */


      // Ejemplo que venia...
      //
      //var ptQuakes = new PopupTemplate({
      //   title: "Quake magnitude:  {MAGNITUDE}",
      //   fieldInfos: [{
      //     fieldName: "PLACE",
      //     format: {
      //       places: 2,
      //       digitSeparator: true
      //     }
      //   }],
      //   "description": "Current location: {PLACE}"
      // });


      var content = new PopupTemplate({
        title:"Magnitud terremoto {MAGNITUDE}",
        description: "En: {PLACE}"
      });



      // Specify the output fields
      var outFieldsQuakes = ["EQID", "UTC_DATETIME", "MAGNITUDE", "PLACE"];


      // Construct the Quakes layer

      var temblores = new FeatureLayer("http://services.arcgis.com/ue9rwulIoeLEI9bj/arcgis/rest/services/Earthquakes/FeatureServer/0", {
        outFields: outFieldsQuakes,
      //Step: Assign  the  popup template
        infoTemplate: content,
         


      });

      temblores.setDefinitionExpression("magnitude >= 2.0");
      mapMain.addLayers([condados, temblores]);



      on(dom.byId("progButtonNode"), "click", changeQuakesRenderer);

      function changeQuakesRenderer() {

        // construct a symbol for earthquake features
        var quakeSymbol = new SimpleMarkerSymbol();
        quakeSymbol.setColor(new Color([0, 0, 255, 0.75]));
        quakeSymbol.setOutline(null);

        var simpleRender = new SimpleRenderer(quakeSymbol);
        simpleRender.setVisualVariables([{
          //Los dos primeros se ven en la info de la capa del servicio web
          type: "sizeInfo",
          field: "MAGNITUDE",
          minSize: 1,
          maxSize: 50,
          minDataValue: 0,
          maxDataValue: 10,
        }]);

        temblores.setRenderer(simpleRender);
      };


      on(dom.byId("progButtonNode"), "click", changeCountiesRenderer);

      function changeCountiesRenderer() {

        var symDefault = new SimpleFillSymbol().setColor(new Color([255, 255, 0]));

        /*
         * Step: Construct a class breaks renderer field: pop00_sqmi
         */
        var cbrCountyPopDensity = new ClassBreaksRenderer(symDefault, "pop00_sqmi");

        /*
         * Step: Define the class breaks:
            0-10, 10-100,100-1000, 1000-10000,
         */


        /*
         * Step: Apply the renderer to the Counties layer
         */
        var arrayLayerDrawingOptionsUSA = [];
        var layerDrawingOptionsCounties = new LayerDrawingOptions();
        layerDrawingOptionsCounties.renderer = cbrCountyPopDensity;
        arrayLayerDrawingOptionsUSA[3] = layerDrawingOptionsCounties;
        condados.setLayerDrawingOptions(arrayLayerDrawingOptionsUSA);

      }
    });
  });
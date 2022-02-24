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
    // @formatter:on

    // Wait until DOM is ready *and* all outstanding require() calls have been resolved
    ready(function () {

      // Parse DOM nodes decorated with the data-dojo-type attribute
      parser.parse();

      // Create the map

      mapMain = new Map("divMap", {
        basemap: "topo",
        center: [-122.45, 37.75],
        zoom: 12
    });


      /*
       * Step: Construct the Geoprocessor
       */
      var gp = new Geoprocessor("http://sampleserver6.arcgisonline.com/arcgis/rest/services/Elevation/ESRI_Elevation_World/GPServer/Viewshed");


      mapMain.on("load", function () {
        /*
         * Step: Set the spatial reference for output geometries
         */
        gp.setOutSpatialReference({wkid:102100});


      });

      // Collect the input observation point
      var tbDraw = new Draw(mapMain);

      tbDraw.activate(Draw.POINT)

      tbDraw.on("draw-complete", calculateViewshed);

      

      function calculateViewshed(evt) {

        // clear the graphics layer
        mapMain.graphics.clear();

        // marker symbol for drawing viewpoint

        

        var smsViewpoint = new SimpleMarkerSymbol();
        smsViewpoint.setSize(12);
        smsViewpoint.setOutline(new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 255, 255]), 1));
        smsViewpoint.setColor(new Color([255, 0, 0]));

        // add viewpoint to the map, añadimos lo de event.geometry para crear el punto y añadir la grafica

        var geometryInput = evt.geometry;

        var graphicViewpoint = new Graphic(geometryInput, smsViewpoint);

        mapMain.graphics.add(graphicViewpoint);
        console.log("Eres un crack")


        //Los siguientes parametros se pueden ver en el enlace del geoproecesador

        /*
         * Step: Prepare the first input parameter
         */ //Input observation point que es un feature set (un objeto con un array)

        var inputPoint = new FeatureSet();
        console.log(inputPoint);
   
        inputPoint.features.push(graphicViewpoint);

        

        /*
         * Step: Prepare the second input parameter
         *///es el viewshed distance
         //es un objeto que recibe distancia y unidades en la que está
        var DistanceVS = new LinearUnit();
            DistanceVS.distance = 5;
            DistanceVS.units = "esriMiles";
        
        /*
         * Step: Build the input parameters into a JSON-formatted object
         */
        
        var params = {
          "Input_Observation_Point": inputPoint,
          "Viewshed_Distance": DistanceVS
        };
        


        /*
         * Step: Wire and execute the Geoprocessor
         */

        
        gp.on("execute-complete", displayViewshed);
        gp.execute(params);


        // Se podria hacer así tambien
        // gp.execute(params, displayViewshed);


      }

      function displayViewshed(results, messages) {

        // polygon symbol for drawing results
        var sfsResultPolygon = new SimpleFillSymbol();
        sfsResultPolygon.setOutline(new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 255, 0, 0.5]), 1));
        sfsResultPolygon.setColor(new Color([255, 127, 0, 0.5]));

        /*
         * Step: Extract the array of features from the results
         */

        var features = results[0].value.features;


        for (var f = 0, fl = features.length; f < fl; f++) {
          var feature = features[f];
          feature.setSymbol(polySymbol);
          map.graphics.add(feature);



        }
        map.setExtent(graphicsUtils.graphicsExtent(map.graphics.graphics), true);


        // loop through results
        array.forEach(arrayFeatures, function (feature) {
          /*
           * Step: Symbolize and add each graphic to the map's graphics layer
           */


        });

        // update the map extent
        var extentViewshed = graphicsUtils.graphicsExtent(mapMain.graphics.graphics);

      }

    });
  });

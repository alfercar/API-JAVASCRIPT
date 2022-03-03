


require([

  "esri/map",
  "esri/geometry/Extent",

  "esri/layers/FeatureLayer",
  "esri/layers/ArcGISDynamicMapServiceLayer",

  "esri/graphic",
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleMarkerSymbol",
  "dojo/_base/Color",
  "dojo/_base/declare",
  "dojo/_base/array",


  "esri/tasks/ServiceAreaTask",
  "esri/tasks/ServiceAreaParameters",
  "esri/tasks/FeatureSet",


  "dojo/domReady!"],

  function (
    Map,
    Extent,

    FeatureLayer,
    ArcGISDynamicMapServiceLayer,

    Graphic,
    SimpleFillSymbol,
    SimpleLineSymbol,
    SimpleMarkerSymbol,
    Color,
    declare,
    array,

    ServiceAreaTask,
    ServiceAreaParameters,
    FeatureSet,



  ) {

    mapMain = new Map("divMap", {
      basemap: "topo",
      extent: new Extent({

        xmin: -442308.8141277513,
        ymin: 4912719.695443804,
        xmax: -383605.17640481505,
        ymax: 4940313.462654716,
        spatialReference: {
          wkid: 102100
        }
      }),

    });

    var CentrosSalud = new FeatureLayer("https://services5.arcgis.com/zZdalPw2d0tQx8G1/ArcGIS/rest/services/CENTROS_SALUD_AFC/FeatureServer/0");

    mapMain.addLayers([CentrosSalud]);

    var serviceAreaTask = new ServiceAreaTask("https://formacion.esri.es/server/rest/services/RedMadrid/NAServer/Service%20Area")
    console.log(serviceAreaTask)


    mapMain.on("layers-add-result", TareaServicios);

    function TareaServicios() {
      console.log("buenos dias");

      var params = new ServiceAreaParameters();

      params.defaultBreaks = [1, 2, 3, 4];

      params.outSpatialReference = mapMain.spatialReference;

      params.returnFacilities = false;

      //params.impedanceAttribute = TiempoPie;



      var facilities = new FeatureSet();

      facilities.features = CentrosSalud;

      paramsfacilities = facilities;



      console.log("params", params);
      console.log("facilities", facilities);
      console.log("paramsfacilities", paramsfacilities);

      serviceAreaTask.solve(params, function (solveResult) {

        var polygonSymbol = new SimpleFillSymbol(
          "solid",
          new SimpleLineSymbol("solid", new Color([232, 104, 80]), 2),
          new Color([232, 104, 80, 0.25])
        );

        arrayUtils.forEach(solveResult.serviceAreaPolygons, function (serviceArea) {
          serviceArea.setSymbol(polygonSymbol);
          mapMain.graphics.add(serviceArea);
        });


      }, function (err) {
        console.log(err.message);
      });




    }


  })




require([

  "esri/map",
  "esri/geometry/Extent",

  "esri/layers/FeatureLayer",
  "esri/layers/ArcGISDynamicMapServiceLayer",

  "esri/dijit/BasemapToggle",
  "esri/dijit/OverviewMap",

  "esri/graphic",
  "esri/geometry/Multipoint",
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleMarkerSymbol",
  "dojo/_base/Color",
  // "dojo/_base/declare",
  "dojo/_base/array",


  "esri/tasks/ServiceAreaTask",
  "esri/tasks/ServiceAreaParameters",
  "esri/tasks/FeatureSet",

  "esri/tasks/query",


  "esri/tasks/ServiceAreaSolveResult",


  "dojo/domReady!"],

  function (
    Map,
    Extent,

    FeatureLayer,
    ArcGISDynamicMapServiceLayer,

    BasemapToggle,
    OverviewMap,

    Graphic,
    Multipoint,
    SimpleFillSymbol,
    SimpleLineSymbol,
    SimpleMarkerSymbol,
    Color,
    // declare,
    array,

    ServiceAreaTask,
    ServiceAreaParameters,
    FeatureSet,

    Query,

    ServiceAreaSolveResult,



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

    var CentrosSalud = new FeatureLayer("https://services5.arcgis.com/zZdalPw2d0tQx8G1/ArcGIS/rest/services/CENTROS_SALUD_AFC/FeatureServer/0", {
      outFields: ["*"],
    });



    mapMain.addLayers([CentrosSalud]);

    var basemapToggle = new BasemapToggle({
      map: mapMain,
      visible: true,
      basemap: "dark-gray"
    }, "widget");
    basemapToggle.startup();

    var overviewMap = new OverviewMap({
      map: mapMain,
      attachTo: "bottom-left",
      color: [" #D84E13"],
      visible: true,
      opacity: .40
    }); overviewMap.startup();


    var serviceAreaTask = new ServiceAreaTask("https://formacion.esri.es/server/rest/services/RedMadrid/NAServer/Service%20Area")
    console.log(serviceAreaTask);


    console.log("centros", CentrosSalud)

    mapMain.on("layers-add-result", TareaServicios);


    function TareaServicios() {
      console.log("buenos dias");


      var seleccion = new Query();

      seleccion.where = "1 = 1";
      seleccion.outfields = "*"

      CentrosSalud.selectFeatures(seleccion);

      CentrosSalud.on("selection-complete", ServiceAreaPolygons);
      console.log(seleccion)



      var graphic = new Graphic(CentrosSalud)
      var featureSET= [];

      featureSET.push(graphic);

      var centrosMadrid = new FeatureSet();

      centrosMadrid.features = featureSET;

      centrosMadrid.facilities = centrosMadrid;

      var puntos = centrosMadrid.features[0].geometry.graphics  
      console.log("puntos",puntos)


      
      function ServiceAreaPolygons(){


      var params = new ServiceAreaParameters();

      params.defaultBreaks = [3];

      params.outSpatialReference = mapMain.spatialReference;

      params.returnFacilities = true;

      params.impedanceAttribute = "TiempoPie"


      console.log("params", params);}



      serviceAreaTask.solve(params, function (Resultsolve) {

        // featureSET.forEach(serviceAreaSolveResult.serviceAreaPolygons, function (graphic) {
        //   mapMain.graphics.add(graphic);
        // });

      }, function (error) {
        console.log("Ha ocurrido un error");
      })

    }


  })

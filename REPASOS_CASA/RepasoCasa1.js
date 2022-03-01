//Vamos a crear un mapa, añadirle unas capas, meterle un par de toolbars y una leyenda
require([
  "esri/map",
  "esri/geometry/Extent",

  "esri/layers/FeatureLayer",
  "esri/layers/ArcGISDynamicMapServiceLayer",

  "esri/dijit/BasemapToggle",
  "esri/dijit/OverviewMap",
  "esri/dijit/Legend",

  
  "dojo/ready",
  "dojo/parser",
  "dojo/on",
  "dojo/domReady!",],

  function (
    Map,
    Extent,

    FeatureLayer,
    ArcGISDynamicMapServiceLayer,


    BasemapToggle,
    OverviewMap,
    Legend,


    ready,
    parser,
    on,


  ) {

    ready(function () {

      parser.parse();

      //Creamos el mapa

      var mapMain = new Map("divMap", {
        extent: new Extent({
          xmin: -14984446.002985604,
          ymin: 3583338.3730520504,
          xmax: -11227413.188713621,
          ymax: 5349339.474552293,
          spatialReference: {
            wkid: 102100
          }
        }),
        basemap: "topo",
      });



      //Vamos a meter capas: un FL y un ARCGIS Dynamic Service Layer

      var terremotosFL = new FeatureLayer("http://services.arcgis.com/ue9rwulIoeLEI9bj/arcgis/rest/services/Earthquakes/FeatureServer/0", {
        outFields: ["*"]
      });

      var USADynamic = new ArcGISDynamicMapServiceLayer("http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer", {
        "opacity": 0.75,
        "visible": true,
      });

      //Vamos a definir unos metodos para ambas capas

      USADynamic.setVisibleLayers([2, 3]);

      terremotosFL.setDefinitionExpression("MAGNITUDE > 1.5");

      mapMain.addLayers([terremotosFL, USADynamic]);

      //A continuación vamos a establecer un toogle para cambiar el mapa, establecer una leyenda y un overview

      var basemapToggle = new BasemapToggle({
        map: mapMain,
        visible: true,
        basemap: "dark-gray"
      }, "widget");
      basemapToggle.startup();

      var overviewMap = new OverviewMap({
        map: mapMain,
        attachTo: "bottom-right",
        color: " #D84E13",
        visible: true,
        opacity: .40
      }); overviewMap.startup();

      mapMain.on("layers-add-result", function () {

        var legend = new Legend({
          map: mapMain,
          arrangement: Legend.ALIGN_RIGHT,
          layerInfos: [{
            layer: terremotosFL,
            title: 'Terremotos'
          }, {
            layer: USADynamic,
            title: 'EEUU'
          }]
        }, "divLegend");
        legend.startup();


      });

    });

  })

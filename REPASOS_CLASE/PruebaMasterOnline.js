

var mapMain;

var tb;


require([
  "esri/map",
  "esri/geometry/Extent",
  "esri/layers/ArcGISDynamicMapServiceLayer",

  "esri/dijit/Legend",
  "esri/dijit/Search",
  "esri/dijit/BasemapGallery",
  "esri/dijit/OverviewMap",
  "esri/dijit/Scalebar",

  "esri/InfoTemplate",
  "esri/layers/FeatureLayer",


  "dojo/dom",
  "dojo/on",

  "dijit/TitlePane",
  "dijit/layout/TabContainer",
  "dijit/layout/ContentPane",
  "dijit/layout/BorderContainer",
  "dojo/domReady!"],

  function (
    Map,
    Extent,
    ArcGISDynamicMapServiceLayer,

    Legend,
    Search,
    BasemapGallery,
    OverviewMap,
    Scalebar,

    InfoTemplate,
    FeatureLayer,

    dom,
    on

  ) {




    on(dojo.byId("pintaYQuery"), "click", fPintaYQuery);
    on(dojo.byId("progButtonNode"), "click", fQueryEstados);

    function fPintaYQuery() {
      alert("Evento del botón Seleccionar ciudades");
    }

    function fQueryEstados() {
      alert("Evento del botón Ir a estado");
    }

    //Mapa y layers

    mapMain = new Map("map", {
      basemap: "topo",
      extent: new Extent({
        xmin: -14874440.37429713,
        ymin: 2883942.6450752337,
        xmax: -7360374.745753162,
        ymax: 6415944.84807572,
        spatialReference: {
          wkid: 102100
        }
      }),
      center: [-97.092027, 40.451156], // long, lat
      zoom: 4,
      sliderStyle: "small"
    });

    mapMain.on("load", function (evt) {
      mapMain.resize();
      mapMain.reposition();
    });

    //PopUps



    var popupUSA = new InfoTemplate(
      "Estado: ${state_name}", "Población: ${pop2000}<br>Population por milla cuadrada: ${pop00_sqmi}<br>Área: ${st_area(shape)}");

    var outfieldsUSAlayer = ["*"];


    //Capas

    var Estados = new FeatureLayer("http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/2", {
      "outFields": outfieldsUSAlayer,
      "infoTemplate": popupUSA,
    });

    var USAlayer = new ArcGISDynamicMapServiceLayer("http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer", {
      "opacity": 0.5,
    });



    //Añadir capa al mapa

    mapMain.addLayers([USAlayer, Estados]);

    //Leyenda

    mapMain.on("layers-add-result", function () {

      var leyenda = new Legend({
        map: mapMain,
        arrangement: Legend.ALIGN_LEFT,
        layerInfos: [{
          layer: USAlayer,
          title: 'American Things'
        }]
      }, "legendDiv");
      leyenda.startup();
    });

    //Widget busqueda

    var widgetBuscar = new Search({
      map: mapMain,
      autocomplete: true,
    }, "search");
    widgetBuscar.startup();

    //Basemap Gallery

    var basemapGallery = new BasemapGallery({
      showArcGISBasemaps: true,
      map: mapMain,
      attachTo: "top-right",
    }, "basemapGallery");
    basemapGallery.startup();

    //Overview Map

    var OverviewMap = new OverviewMap({
      map: mapMain,
      attachTo: "bottom-left",
      height: 150,
      width: 150,
      visible: true
    });
    OverviewMap.startup();

    //Barra de escalas

    var scalebar = new Scalebar({
      map: mapMain,
      attachTo: "bottom-center",
      scalebarUnit: "metric"
    });







  });
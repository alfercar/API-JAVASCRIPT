
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


  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/Font",
  "esri/symbols/TextSymbol",
  "esri/graphic",
  "dojo/_base/Color",

  "esri/toolbars/draw",
  "esri/tasks/query",

  "esri/graphicsUtils",


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

    SimpleFillSymbol,
    SimpleLineSymbol,
    SimpleMarkerSymbol,
    Font,
    TextSymbol,
    Graphic,
    Color,

    draw,
    Query,

    graphicsUtils,

    dom,
    on

  ) {






    //Mapa y layers

    mapMain = new Map("map", {
      basemap: "topo",
      extent: new Extent({
        xmin: -26680721.03095156,
        ymin: 1397764.0679305727,
        xmax: 3375541.4832243174,
        ymax: 15525772.879932515,
        spatialReference: {
          wkid: 102100
        }
      }),
      center: [-104.817618, 59.997364], // long, lat
      zoom: 3,
      sliderStyle: "small"
    });

    mapMain.on("load", function (evt) {
      mapMain.resize();
      mapMain.reposition();
    });

    //PopUps

    var popupUSA = new InfoTemplate(
      "${state_name}", "Población: ${pop2000}<br>Población por milla cuadrada: ${pop00_sqmi}<br>Área: ${st_area(shape)}");

    var outfieldsUSAlayer = ["*"];


    // var popupStates = new PopupTemplate({
    //   title: "Estado de {state_name}, {state_abbr}",
    //   fieldInfos: [{
    //     fieldName: "pop2000",
    //     label: "Población:",
    //     visible: true
    //   }, {
    //     fieldName: "pop00_sqmi",
    //     label: "Población por sqmi:",
    //     visible: true
    //   }, {
    //     fieldName: "ss6.gdb.States.area",
    //     label: "Area en sqmi:",
    //     visible: true,
    //     format: {places: 0}
    //   }]
    // });


    //Capas

    var Estados = new FeatureLayer("http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/2", {
      "outFields": outfieldsUSAlayer,
      "infoTemplate": popupUSA,
    });

    var Ciudades = new FeatureLayer("http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/0");

    var USAlayer = new ArcGISDynamicMapServiceLayer("http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer", {
      "opacity": 0.5,
    });

    USAlayer.setVisibleLayers([1, 3]);



    //Añadir capa al mapa

    mapMain.addLayers([Ciudades, Estados, USAlayer]);

    //Leyenda

    mapMain.on("layers-add-result", function () {

      var leyenda = new Legend({
        map: mapMain,
        arrangement: Legend.ALIGN_LEFT,
        layerInfos: [{
          layer: Ciudades,
          title: 'Ciudades'
        }, {
          layer: Estados,
          title: 'Estados'
        }, {
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




    //Herramienta de dibujo

    on(dojo.byId("pintaYQuery"), "click", fPintaYQuery);

    function fPintaYQuery() {
      console.log("Evento del botón Seleccionar ciudades");

      var dibujo = new draw(mapMain, {
        tolerance: 10,
        tooltipOffset: 20,
        drawTime: 10
      });

      dibujo.activate(draw.POLYGON);

      dibujo.on("draw-complete", QueryPoligono);

    }

    function QueryPoligono(evt) {

      mapMain.graphics.clear();

      var geometryInput = evt.geometry;

      var line = new SimpleLineSymbol();
      line.setColor(new Color([0, 0, 0, 1]));
      var fill = new SimpleFillSymbol();
      fill.setOutline(line);
      fill.setColor(new Color([0, 230, 169, 0.38]));

      var simbologiaPoligono = fill, line

      var poligono = new Graphic(geometryInput, simbologiaPoligono);

      mapMain.graphics.add(poligono);

      CiudadesSeleccion(geometryInput);

      function CiudadesSeleccion(geometryInput) {

        var simbologia2 = new SimpleMarkerSymbol({
          "type": "esriSMS",
          "style": "esriSMSCircle",
          "color": [0, 0, 255, 128],
          "size": 7,
          "outline": {
            "color": [255, 255, 255, 214],
            "width": 1
          }
        });

        var seleccion = new Query();
        seleccion.geometry = geometryInput;
        seleccion.outfields = ["*"];

        Ciudades.selectFeatures(seleccion);
        Ciudades.setSelectionSymbol(simbologia2)
      }





    }


    ////Boton ir al estado
    on(dojo.byId("progButtonNode"), "click", fQueryEstados);


    function fQueryEstados() {
      // Guardamos el valor del input
      var inputState = dojo.byId("dtb").value;

      // Definimos una simbología para los estados seleccionados
      var sbState = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
        new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT,
          new Color([255, 0, 0]), 2), new Color([255, 255, 0, 0.5])
      );

      // Aplicamos la simbología a los estados seleccionados
      Estados.setSelectionSymbol(sbState);

      // Definimos la consulta
      var queryState = new Query();
      queryState.where = `state_name = '${inputState}'`;
      Estados.selectFeatures(
        queryState, // Aplicamos la clausula Where de la consulta
        FeatureLayer.SELECTION_NEW, // Marcamos como nueva selección
        function (selection) { // Función para hacer zoom al estado
          var centerSt = graphicsUtils.graphicsExtent(selection).getCenter();
          var extentSt = esri.graphicsExtent(selection);

          mapMain.setExtent(extentSt.getExtent().expand(2));
          mapMain.centerAt(centerSt);
        });
    };


  });
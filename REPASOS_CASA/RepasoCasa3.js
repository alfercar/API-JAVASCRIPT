//VIENE DEL REPASO 1
//Continuando con lo visto en el repaso 1 vamos a crear mas cosas: un locator task, un widget de busqueda, locator task, crearemos un select features para un query data y renderizaremos


require([
  "esri/map",
  "esri/geometry/Extent",

  "esri/layers/FeatureLayer",
  "esri/layers/ArcGISDynamicMapServiceLayer",

  "esri/dijit/BasemapToggle",
  "esri/dijit/OverviewMap",
  "esri/dijit/Legend",


  "esri/dijit/Search",


  "esri/tasks/locator",
  "esri/tasks/AddressCandidate",
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/Font",
  "esri/symbols/TextSymbol",
  "esri/graphic",
  "dojo/_base/Color",
  "dojo/_base/array",


  "esri/toolbars/draw",
  "esri/tasks/query",


  "esri/renderers/SimpleRenderer",
  "esri/renderers/ClassBreaksRenderer",
  "esri/layers/LayerDrawingOptions",



  "dojo/ready",
  "dojo/dom",
  "dojo/parser",
  "dojo/on",
  "dgrid/OnDemandGrid",
  "dgrid/Selection",
  "dojo/store/Memory",
  "dojo/date/locale",
  "dojo/_base/declare",
  "dojo/domReady!",],

  function (
    Map,
    Extent,

    FeatureLayer,
    ArcGISDynamicMapServiceLayer,


    BasemapToggle,
    OverviewMap,
    Legend,

    Search,

    Locator,
    AddressCandidate,
    SimpleFillSymbol,
    SimpleLineSymbol,
    SimpleMarkerSymbol,
    Font,
    TextSymbol,
    Graphic,
    Color,
    array,

    draw,
    Query,


    SimpleRenderer,
    ClassBreaksRenderer,
    LayerDrawingOptions,



    ready,
    dom,
    parser,
    on,
    Grid,
    Selection,
    Memory,
    locale,
    declare,


  ) {

    ready(function () {

      parser.parse();

      /////Creamos el mapa

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



      /////Vamos a meter capas: un FL y un ARCGIS Dynamic Service Layer

      var terremotosFL = new FeatureLayer("http://services.arcgis.com/ue9rwulIoeLEI9bj/arcgis/rest/services/Earthquakes/FeatureServer/0", {
        outFields: ["*"]
      });

      var USADynamic = new ArcGISDynamicMapServiceLayer("http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer", {
        "opacity": 0.75,
        "visible": true,
      });

      ////Vamos a definir unos metodos para ambas capas

      USADynamic.setVisibleLayers([2, 3]);

      terremotosFL.setDefinitionExpression("MAGNITUDE > 1.5");

      mapMain.addLayers([terremotosFL, USADynamic]);

      /////A continuación vamos a establecer un toogle para cambiar el mapa, establecer una leyenda y un overview

      var basemapToggle = new BasemapToggle({
        map: mapMain,
        visible: true,
        basemap: "dark-gray"
      }, "widget");
      basemapToggle.startup();

      //Overview del mapa

      var overviewMap = new OverviewMap({
        map: mapMain,
        attachTo: "bottom-right",
        color: " #D84E13",
        visible: true,
        opacity: .40
      }); overviewMap.startup();

      //Leyenda

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

      //Añadimos el widget de busqueda

      var buscar = new Search({
        map: mapMain,
        autocomplete: true,
      }, "divSearch");
      buscar.startup();

      //Añadimos el locator task con las variables nuestras

      on(dom.byId("btnLocate"), "click", locatorTask)

      var locator = new Locator("http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer");

      function locatorTask() {


        mapMain.graphics.clear();

        var direction = dom.byId("taAddress").value;

        var objAddress = {
          "SingleLine": direction
        };

        var paramsLocator = { address: objAddress };

        locator.addressToLocations(paramsLocator);

        locator.on("address-to-locations-complete", showResults);

        function showResults(candidates) {

          var symbolMarker = new SimpleMarkerSymbol();
          symbolMarker.setStyle(SimpleMarkerSymbol.STYLE_CIRCLE);
          symbolMarker.setColor(new Color([255, 0, 0, 0.75]));
          var font = new Font("14pt", Font.STYLE_NORMAL, Font.VARIANT_NORMAL, "Helvetica");

          var pointLocator;


          array.every(candidates.addresses, function (candidate) {

            if (candidate.score > 80) {
              var attributesCandidate = {
                address: candidate.address,
                score: candidate.score,
                locatorName: candidate.attributes.Loc_name
              };
              console.log("attributesCandidate", candidate);

              pointLocator = candidate.location

              var circulo = new Graphic(pointLocator, symbolMarker)

              mapMain.graphics.add(circulo);

              var sAddress = candidate.address;
              var textSymbol = new TextSymbol(sAddress, font, new Color("#FF0000"));
              textSymbol.setOffset(0, -22);
              mapMain.graphics.add(new Graphic(pointLocator, textSymbol));

              //Para salir del bucle cuando haya encontrado un resultado
              return false;


            }

          });

          if (pointLocator !== undefined) {
            mapMain.centerAndZoom(pointLocator, 12)
          };
        }

      };


      ////Crearemos un query data con una selección de entidades a partir de un dibujo del usuario en el mapa

      var gridQuakes = new (declare([Grid, Selection]))({
        bufferRows: Infinity,
        columns: {
          EQID: "ID",
          UTC_DATETIME: {
            "label": "Date/Time",
            "formatter": function (dtQuake) {
              return locale.format(new Date(dtQuake));
            }
          },
          MAGNITUDE: "Mag",
          PLACE: "Place"
        }
      }, "divGrid");

      mapMain.on("load", dibujo);

      function dibujo(evt) {

        var dibujito = new draw(mapMain, {
          tooltipOffset: 20,
          drawTime: 10
        });

        dibujito.activate(draw.POLYGON);

        dibujito.on("draw-complete", displayPolygon);
      }

      function displayPolygon(evt) {

        var geometryInput = evt.geometry;

        var line = new SimpleLineSymbol();
        line.setColor(new Color([0, 0, 0, 1]));
        var fill = new SimpleFillSymbol();
        fill.setOutline(line);
        fill.setColor(new Color([0, 230, 169, 0.38]));

        var tbDrawSymbol = fill, line

        mapMain.graphics.clear();

        var poligono = new Graphic(geometryInput, tbDrawSymbol);

        mapMain.graphics.add(poligono);

        //Ahora procedemos a realizar la selección, hasta ahora solo hemos dibujado el poligono

        queryselection(geometryInput);

        function queryselection(geometryInput) {

          var simbologia = new SimpleMarkerSymbol({
            "type": "esriSMS",
            "style": "esriSMSCircle",
            "color": [0, 255, 0, 128],
            "size": 6,
            "outline": {
              "color": [0, 255, 0, 214],
              "width": 1
            }
          });

          var query = new Query();
          query.geometry = geometryInput;
          query.outfields = ["*"];

          terremotosFL.selectFeatures(query);
          terremotosFL.setSelectionSymbol(simbologia);

          terremotosFL.on("selection-complete", populateGrid);

          function populateGrid(results) {
            seleccionTerremotos = array.map(results.features, function (feature) {
              return {

                EQID: feature.attributes.EQID,
                PLACE: feature.attributes.PLACE,
                MAGNITUDE: feature.attributes.MAGNITUDE,
                UTC_DATETIME: feature.attributes.UTC_DATETIME,
              };



            })

            var memoria = new Memory({
              data: seleccionTerremotos
            });

            gridQuakes.set("store", memoria);
          }


        }


      }


      ///////A continuación se procederá a la creación de un renderizado tanto de los puntos como de los condados


      on(dom.byId("progButtonNode"), "click", renderTerremotos);

      function renderTerremotos() {

        var quakeSymbol = new SimpleMarkerSymbol();
        quakeSymbol.setColor(new Color([0, 0, 255, 0.75]));
        quakeSymbol.setOutline(null);

        var simpleRender = new SimpleRenderer(quakeSymbol);

        simpleRender.setVisualVariables([{
          type: "sizeInfo",
          field: "MAGNITUDE",
          minSize: 1,
          maxSize: 50,
          minDataValue: 0,
          maxDataValue: 10,
        }]);

        terremotosFL.setRenderer(simpleRender);

      }

      on(dom.byId("progButtonNode"), "click", renderCondados);

      function renderCondados() {

        var symDefault = new SimpleFillSymbol().setColor(new Color([255, 255, 255]));


        var symDefault1 = new SimpleFillSymbol().setColor(new Color([83, 255, 190, 1]));
        var symDefault2 = new SimpleFillSymbol().setColor(new Color([88, 214, 141, 1]));
        var symDefault3 = new SimpleFillSymbol().setColor(new Color([241, 196, 15, 1]));
        var symDefault4 = new SimpleFillSymbol().setColor(new Color([186, 74, 0, 1]));
        var symDefault5 = new SimpleFillSymbol().setColor(new Color([100, 30, 22, 1]));


        var renderizador = new ClassBreaksRenderer(symDefault, "pop00_sqmi");

        renderizador.addBreak({

          minValue: 0,

          maxValue: 10,

          symbol: symDefault1,

          label: "Low Density"

        });

        renderizador.addBreak({

          minValue: 10,

          maxValue: 100,

          symbol: symDefault2,

          label: "Low-Mid Density"

        });

        renderizador.addBreak({

          minValue: 100,

          maxValue: 1000,

          symbol: symDefault3,

          label: "Mid Density"

        });

        renderizador.addBreak({

          minValue: 1000,

          maxValue: 10000,

          symbol: symDefault4,

          label: "High-Mid Density"

        });

        renderizador.addBreak({

          minValue: 10000,

          maxValue: 100000,

          symbol: symDefault5,

          label: "High Density"

        });


        var OpcionesRenderizado = [];
       

        var OpcionRenderizado = new LayerDrawingOptions

        OpcionRenderizado.renderer = renderizador;
     

        OpcionesRenderizado[3] = OpcionRenderizado;
        console.log("Render", OpcionRenderizado)

        USADynamic.setLayerDrawingOptions(OpcionesRenderizado);

      }


    });

  })

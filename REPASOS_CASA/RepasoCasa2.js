//Vamos a crear un web map, añadirle una leyenda y cosas mediante lo de utils

var mapMain;
var legendLayers;
var webmapId = "7d987ba67f4640f0869acb82ba064228";

require([
  "dojo/dom",
  "esri/arcgis/utils",
  "esri/dijit/Legend",
  "esri/dijit/Scalebar",
  "esri/dijit/BasemapGallery",
  "dojo/ready",
  "dojo/parser"],
  function (
    dom,
    arcgisUtils,
    Legend,
    Scalebar,
    BasemapGallery,
    ready,
    parser) {

    ready(function () {
      parser.parse();

      arcgisUtils.createMap(webmapId, "divMap").then(function (response) {

        console.log(response);

        //Añadimos la leyenda, primero sacamos las capas y segundo se las metemos a la leyenda

        var legendLayers = arcgisUtils.getLegendLayers(response);
        console.log('capasLeyenda', legendLayers);

        mapMain = response.map

        var leyenda = new Legend({
          map: mapMain,
          layerInfos: legendLayers
        }, "divLegend");
        leyenda.startup();

        //Ahora le metemos titulo y barra de escala

        var titulo = response.itemInfo.item.title;
        dom.byId("title").innerHTML = titulo;


        var escala = new Scalebar({
          map: response.map,
          attachTo: "top-left",
          scalebarUnit: "metric"
        });


        //Por último vamos a introducir la galería de mapas base de ESRI

        var galeriaMapasBase = new BasemapGallery({
          showArcGISBasemaps: true,
          map: mapMain,
          attachTo: "top-right",
        }, "basemapGallery");
        galeriaMapasBase.startup();

      }

      )





    });

  });
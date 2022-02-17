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
    function (dom,arcgisUtils, Legend, Scalebar,BasemapGallery, ready, parser) {

        ready(function () {
            parser.parse();

            arcgisUtils.createMap(webmapId, "cpCenter").then(function (response) {
                //eL .then concatena metodo, hasta que no se ejecuta el primero no lo hace el segundo
                console.log(response)
                //Ver que hace response
                let capasLeyenda = arcgisUtils.getLegendLayers(response);

                console.log('capasLeyenda', capasLeyenda);
                

                var leyendaWidget = new Legend({
                    map: response.map,
                    layerInfos: capasLeyenda //Se puede hacer así ya que capas leyenda es un array (en el ejercicio anterior es lo mismo)

                }, "divLegend");

                leyendaWidget.startup();

                let titleMap = response.itemInfo.item.title;
                dom.byId('title').innerHTML = titleMap;

                var scalebar = new Scalebar({
                    map: response.map,
                    attachTo: "top-left",
                    scalebarUnit: "metric" });

                //lo del mapa también funciona si creas una variable con el respons
                var mapita = response.map

                var basemapGallery = new BasemapGallery({
                    showArcGISBasemaps: true,
                    map: mapita,
                    attachTo: "top-right",
                }, "basemapGallery");
                //Si vas a usar algo de html hay que poner el startup
                basemapGallery.startup();

            });
        })
    });
var mapMain;

// @formatter:off
require([
        "esri/map",
        "esri/geometry/Extent",
        "esri/dijit/Search",
   

        "dojo/_base/Color",
        "dojo/_base/array",

        "dojo/dom",
        "dojo/on",
        "dojo/parser",
        "dojo/ready",

        "dijit/layout/BorderContainer",
        "dijit/layout/ContentPane"],
    function (Map, Extent, Search,
              Color, array,
              dom, on, parser, ready,
              BorderContainer, ContentPane) {
// @formatter:on

        // Wait until DOM is ready *and* all outstanding require() calls have been resolved
        ready(function () {

            // Parse DOM nodes decorated with the data-dojo-type attribute
            parser.parse();

            //creamos el mapa
            var myMap = new Map('cpCenter',{
                basemap: 'dark-gray',
                extent: new Extent ({
                    xmin: -14984446.002985604,
                    ymin: 3583338.3730520504,
                    xmax: -11227413.188713621,
                    ymax: 5349339.474552293,
                    spatialReference: {
                       wkid: 102100
                    }
                })
            
            });

            //Le damos para buscar a la herramienta search de la API

            var buscar = new Search({
                map: myMap,
                autocomplete: true,
              },"divSearch");
              buscar.startup();

            });
    });
//https://developers.arcgis.com/javascript/3/samples/playground/index.html

// @formatter:off
require([
    "esri/map",
    "esri/geometry/Extent",
    "esri/layers/FeatureLayer",
    "esri/layers/ArcGISDynamicMapServiceLayer",
    "esri/toolbars/draw",
    "esri/graphic",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleMarkerSymbol",

    "dojo/ready",
    "dojo/parser",
    "dojo/on",
    "dojo/dom",

    "dojo/store/Memory",
    "dojo/date/locale",

    "dojo/_base/Color",
    "dojo/_base/declare",
    "dojo/_base/array",

    "dgrid/OnDemandGrid",
    "dgrid/Selection",

    "dijit/layout/BorderContainer",
    "dijit/layout/ContentPane",
    "dijit/form/Button"],
    function (Map, Extent, FeatureLayer,
        ArcGISDynamicMapServiceLayer,
        Draw, Graphic, SimpleFillSymbol,
        SimpleLineSymbol, SimpleMarkerSymbol,

        ready, parser, on, dom,
        Memory, locale,
        Color, declare, array,
        Grid, Selection,
        BorderContainer, ContentPane, Button) {
        // @formatter:on

        // Wait until DOM is ready *and* all outstanding require() calls have been resolved
        ready(function () {

            // Parse DOM nodes decorated with the data-dojo-type attribute
            parser.parse();

            // Initialize the dgrid
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

            // URL variables

            var condados = new ArcGISDynamicMapServiceLayer("http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer", {
                opacity: 0.4
            });


            var temblores = new FeatureLayer("http://services.arcgis.com/ue9rwulIoeLEI9bj/arcgis/rest/services/Earthquakes/FeatureServer/0");


            // Create the map

            var myMap = new Map('divMap', {
                basemap: 'dark-gray',
                extent: new Extent({
                    xmin: -14984446.002985604,
                    ymin: 3583338.3730520504,
                    xmax: -11227413.188713621,
                    ymax: 5349339.474552293,
                    spatialReference: {
                        wkid: 102100
                    }
                })

            });

        // Construct the USA layer
        /*
         * Step: Specify the output fields
        //Para poner las capas que queremos
         */condados.setVisibleLayers([0, 2, 3]);

            // Construct the Quakes layer

            temblores.setDefinitionExpression("MAGNITUDE >= 2");

            // var lyrQuakes = new FeatureLayer(sUrlQuakesLayer, {
            //     /*
            //      * Step: Set the quakes layer output fields
            //      */


            // });

            myMap.addLayers([condados, temblores]);

            /*
             * Step: Wire the draw tool initialization function
             */

            myMap.on("load", initDrawTool);

            function initDrawTool() {
                /*
                 * Step: Implement the Draw toolbar
                 */
                var dibujo = new Draw(myMap, {
                    tooltipOffset: 20,
                    drawTime: 10
                });

                dibujo.activate(Draw.POLYGON)

                dibujo.on("draw-complete", displayPolygon);

            }

            // on(dom.byId("divRenderer"), "click", initDrawTool)

            function displayPolygon(evt) {

                //El evt viene del draw clomplete, cuando completamos un evento hacemos una funcion. Aqui se trabaja con lo obtenido después


                // Get the geometry from the event object
                var geometryInput = evt.geometry;

                var line = new SimpleLineSymbol();
                line.setColor(new Color([0, 0, 0, 1]));
                var fill = new SimpleFillSymbol();
                fill.setOutline(line);
                fill.setColor(new Color([0, 230, 169, 0.38]));

                // var tbDrawSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 255, 0]), 2), new Color([255, 255, 0, 0.2]));

                //https://developers.arcgis.com/javascript/3/samples/playground/index.html

                // Define symbol for finished polygon
                var tbDrawSymbol = fill, line

                // Clear the map's graphics layer
                myMap.graphics.clear();

                /*
                 * Step: Construct and add the polygon graphic
                 */
                // var geometryInput = evt.geometry;

                var graphic = new Graphic(geometryInput, tbDrawSymbol);

                myMap.graphics.add(graphic);

                // Call the next function
                selectQuakes(geometryInput);
            }

            function selectQuakes(geometryInput) {

                // Define symbol for selected features
                var symbolSelected = new SimpleMarkerSymbol({
                    "type": "esriSMS",
                    "style": "esriSMSCircle",
                    "color": [255, 115, 0, 128],
                    "size": 6,
                    "outline": {
                        "color": [255, 0, 0, 214],
                        "width": 1
                    }
                });

                /*
                 * Step: Set the selection symbol
                 */


                /*
                 * Step: Initialize the query
                 */


                /*
                 * Step: Wire the layer's selection complete event
                 */


                /*
                 * Step: Perform the selection
                 */


            }

            function populateGrid(results) {

                var gridData;

                dataQuakes = array.map(results.features, function (feature) {
                    return {
                        /*
                         * Step: Reference the attribute field values
                         */


                    }
                });

                // Pass the data to the grid
                var memStore = new Memory({
                    data: dataQuakes
                });
                gridQuakes.set("store", memStore);
            }

        });
    });

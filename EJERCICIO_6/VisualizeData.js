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
    "esri/tasks/query",
    "esri/renderers/SimpleRenderer",
    "esri/renderers/Renderer",
    "esri/renderers/ClassBreaksRenderer",
    "esri/layers/LayerDrawingOptions",

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
        SimpleLineSymbol, SimpleMarkerSymbol, Query, SimpleRenderer,Renderer, ClassBreaksRenderer, LayerDrawingOptions,

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

            // URL variables

            var condados = new ArcGISDynamicMapServiceLayer("http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer", {
                opacity: 0.4
            });

            

            var temblores = new FeatureLayer("http://services.arcgis.com/ue9rwulIoeLEI9bj/arcgis/rest/services/Earthquakes/FeatureServer/0", {                
            });


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

            condados.setVisibleLayers([0, 2, 3]);
            // Construct the Quakes layer
            temblores.setDefinitionExpression("MAGNITUDE >= 2");


            myMap.addLayers([condados, temblores]);

            // Construct and wire a button to apply the renderer

            on(dom.byId("progButtonNode"), "click", changeQuakesRenderer);

           


            function changeQuakesRenderer() {

                // construct a symbol for earthquake features
                var quakeSymbol = new SimpleMarkerSymbol();
                quakeSymbol.setColor(new Color([0, 0, 255, 0.75]));
                quakeSymbol.setOutline(null);


                /*
                 * Step: Construct and apply a simple renderer for earthquake features
                 */
                var simpleRender = new SimpleRenderer(quakeSymbol);
               

                /*
                 * Step: Construct symbol size info parameters for the quake renderer
                 */

                simpleRender.setVisualVariables([{
                    //Los dos primeros se ven en la info de la capa del servicio web
                    type: "sizeInfo",
                    field: "MAGNITUDE",
                    minSize: 1,
                    maxSize: 50,
                    minDataValue: 0,
                    maxDataValue: 10,
                  }]);

                
                /*
                 * Step: Apply symbol size info to the quake renderer
                 */

                temblores.setRenderer(simpleRender);


            };

            on(dom.byId("progButtonNode"), "click", changeCountiesRenderer);

            function changeCountiesRenderer() {
                //A diferencia del anterior este es un dynamic service, e diferente

                var symDefault = new SimpleFillSymbol().setColor(new Color([255, 255, 255]));
                

                var symDefault1 = new SimpleFillSymbol().setColor(new Color([83, 255, 190, 1]));
                var symDefault2 = new SimpleFillSymbol().setColor(new Color([88, 214, 141, 1]));
                var symDefault3 = new SimpleFillSymbol().setColor(new Color([241, 196, 15, 1]));
                var symDefault4 = new SimpleFillSymbol().setColor(new Color([186, 74, 0 , 1]));
                var symDefault5 = new SimpleFillSymbol().setColor(new Color([100, 30, 22 , 1]));

               

                /*
                 * Step: Construct a class breaks renderer
                 */

                var rendererizador = new ClassBreaksRenderer(symDefault, "pop00_sqmi");
                
                

                /*
                 * Step: Define the class breaks
                 */

                  rendererizador.addBreak({

                    minValue: 0,
                  
                    maxValue: 10,
                  
                    symbol: symDefault1,
                  
                    label: "Low Density"
                  
                  });

                  rendererizador.addBreak({

                    minValue: 10,
                  
                    maxValue: 100,
                  
                    symbol: symDefault2,
                  
                    label: "Low-Mid Density"
                  
                  });

                  rendererizador.addBreak({

                    minValue: 100,
                  
                    maxValue: 1000,
                  
                    symbol: symDefault3,
                  
                    label: "Mid Density"
                  
                  });

                  rendererizador.addBreak({

                    minValue: 1000,
                  
                    maxValue: 10000,
                  
                    symbol: symDefault4,
                  
                    label: "High-Mid Density"
                  
                  });

                  rendererizador.addBreak({

                    minValue: 10000,
                  
                    maxValue: 100000,
                  
                    symbol: symDefault5,
                  
                    label: "High Density"
                  
                  });


                /*
                 * Step: Apply the renderer to the Counties layer
                 */

                var layerDrawingOptions = [];
                var layerDrawingOption = new LayerDrawingOptions();
                
                layerDrawingOption.renderer = rendererizador;
                
                layerDrawingOptions[3] = layerDrawingOption;

                condados.setLayerDrawingOptions(layerDrawingOptions);


            console.log("Renderizado completado")
        }


        });
    });


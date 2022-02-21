
//Ahora vamos a hacer lo mismo que antes (search widget) pero con una tarea (task)



var mapMain;

// @formatter:off
require([

    "esri/map",
    "esri/geometry/Extent",
    "esri/tasks/locator",

    "dojo/_base/Color",
    "dojo/_base/array",

    "dojo/dom",
    "dojo/on",
    "dojo/parser",
    "dojo/ready",

    "dijit/layout/BorderContainer",
    "dijit/layout/ContentPane"],
    function (Map, Extent, Locator,
        Color, array,
        dom, on, parser, ready,
        BorderContainer, ContentPane) {
        // @formatter:on

        // Wait until DOM is ready *and* all outstanding require() calls have been resolved
        ready(function () {

            var taskLocator;



            // Parse DOM nodes decorated with the data-dojo-type attribute
            parser.parse();

            // Create the map

            var mapMain = new Map('cpCenter', {
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


            /*
             * Step: Construct and bind the Locator task
             */
            var locator = new Locator("http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer");


            /*
             * Step: Wire the button's onclick event handler
             */

           
            on(dom.byId("btnLocate"), "click", doAddressToLocations)

            

            /*
             * Step: Wire the task's completion event handler
             */
            
            locator.on("location-to-address-complete", showResults);
           

            function doAddressToLocations() {
                alert("Has hecho click en el localizador, espere mientras se realiza la búsqueda");
                mapMain.graphics.clear();

                /*
                 * Step: Complete the Locator input parameters
                 */
                var objAddress = {
                    "field_name": dom.byId("taAddress").value
                }
                var params = {address:objAddress}


                /*
                 * Step: Execute the task
                 */

                locator.outSpatialReference = mapMain.spatialReference;

                locator.addressToLocations(params);


            }

            function showResults(candidates) {
                // Define the symbology used to display the results
                var symbolMarker = new SimpleMarkerSymbol();
                symbolMarker.setStyle(SimpleMarkerSymbol.STYLE_CIRCLE);
                symbolMarker.setColor(new Color([255, 0, 0, 0.75]));
                var font = new Font("14pt", Font.STYLE_NORMAL, Font.VARIANT_NORMAL, "Helvetica");

                // loop through the array of AddressCandidate objects
                var geometryLocation;
                array.every(candidates.addresses, function (candidate) {

                    // if the candidate was a good match
                    if (candidate.score > 80) {

                        // retrieve attribute info from the candidate
                        var attributesCandidate = {
                            address: candidate.address,
                            score: candidate.score,
                            locatorName: candidate.attributes.Loc_name
                        };

                        /*
                         * Step: Retrieve the result's geometry
                         */


                        /*
                         * Step: Display the geocoded location on the map
                         */


                        // display the candidate's address as text
                        var sAddress = candidate.address;
                        var textSymbol = new TextSymbol(sAddress, font, new Color("#FF0000"));
                        textSymbol.setOffset(0, -22);
                        mapMain.graphics.add(new Graphic(geometryLocation, textSymbol));

                        // exit the loop after displaying the first good match
                        return false;
                    }
                });

                // Center and zoom the map on the result
                if (geometryLocation !== undefined) {
                }
            }

        });

    });
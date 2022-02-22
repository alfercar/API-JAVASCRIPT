var mapMain;

// @formatter:off
require(["esri/map",
"esri/tasks/locator",
"esri/tasks/AddressCandidate",
"esri/symbols/SimpleMarkerSymbol",
"esri/symbols/Font",
"esri/symbols/TextSymbol",
"esri/graphic",

        

        "dojo/_base/Color",
        "dojo/_base/array",

        "dojo/dom",
        "dojo/on",
        "dojo/parser",
        "dojo/ready",

        "dijit/layout/BorderContainer",
        "dijit/layout/ContentPane"],
    function (Map,Locator,AddressCandidate, SimpleMarkerSymbol,Font,TextSymbol, Graphic,
              Color, array,
              dom, on, parser, ready,
              BorderContainer, ContentPane) {
// @formatter:on

        // Wait until DOM is ready *and* all outstanding require() calls have been resolved
        ready(function () {

            var taskLocator;

            // Parse DOM nodes decorated with the data-dojo-type attribute
            parser.parse();

            mapMain = new Map("cpCenter",
            {
                basemap: "topo-vector",
                zoom: 14,
                center : [-3.545067,40.376479 ],
            });

            
            

            
            // Create the map
           

            /*
             * Step: Construct and bind the Locator task
             */
            
            var localizador = new Locator("https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer");

            /*
             * Step: Wire the button's onclick event handler
             */

            //var clickar = document.getElementById("btnLocate");
            // clickar.addEventListener("click", doAddressToLocations);
            on(dom.byId("btnLocate"), "click", doAddressToLocations)            


            /*
             * Step: Wire the task's completion event handler
             */
            


            function doAddressToLocations() {
                mapMain.graphics.clear();
                alert("has clickado el boton");

                /*
                 * Step: Complete the Locator input parameters
                 */
                var direcciones = dom.byId("taAddress").value
                var objAddress = {
                    "SingleLine" : direcciones,
                };
                var params = {
                    address : objAddress,
                };

                
           

                localizador.addressToLocations(params);
                console.log("calles",objAddress);



                /*
                 * Step: Execute the task
                 */


            };
        

//             localizador.on("address-to-locations-complete", resultad)
//             function resultad(evnt) {
// console.log(evnt)
//                 var callejuelas = evnt.addresses;
//                 console.log(callejuelas)
//             };

    //     })
    // })



            localizador.on("address-to-locations-complete", showResults);

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
                        console.log("attributesCandidate", candidate)

                        /*
                         * Step: Retrieve the result's geometry
                         */
                        geometryLocation = candidate.location;

                        /*
                         * Step: Display the geocoded location on the map
                         */
                        let circulo = new Graphic(geometryLocation,symbolMarker);
                        mapMain.graphics.add(circulo);

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
                    mapMain.centerAndZoom(geometryLocation, 12)
                }
            }

        });

    });

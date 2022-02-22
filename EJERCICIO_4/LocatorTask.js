
//Ahora vamos a hacer lo mismo que antes (search widget) pero con una tarea (task)



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

            // Create the map

            mapMain = new Map("cpCenter", {
                basemap: "topo",
                center: [-117.19, 34.05],
                zoom: 13
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

           


            function doAddressToLocations() {
                // alert("Has hecho click en el localizador, espere mientras se realiza la búsqueda");
                mapMain.graphics.clear(); //limpia la capa grafica (temporal)

                /*
                 * Step: Complete the Locator input parameters
                 */

                var direction = dom.byId("taAddress").value;
                console.log("Dirección: ", direction);

                var objAddress = {
                    //Lo de single line está en la api, buscando en lo de address
                    "SingleLine": direction
                };

                // var objAddress = {
                //     "SingleLine": dom.byId("taAddress").value
                // };
                var params = { address: objAddress };
                console.log(params);


                /*
                 * Step: Execute the task
                 */


                locator.addressToLocations(params);


            }

            locator.on("address-to-locations-complete", showResults); //cuando acabado la busqueda se ejecuta la siguiente funcion, showresults

            function showResults(candidates) {
                // Define the symbology used to display the results
                console.log("candidates: ", candidates);

                var symbolMarker = new SimpleMarkerSymbol();
                symbolMarker.setStyle(SimpleMarkerSymbol.STYLE_CIRCLE);
                symbolMarker.setColor(new Color([255, 0, 0, 0.75]));
                var font = new Font("14pt", Font.STYLE_NORMAL, Font.VARIANT_NORMAL, "Helvetica");

                // loop through the array of AddressCandidate objects
                var geometryLocation; //Esto se hace fuera del if, porque si se hace dentro (lo de var) no se queda para cuando lo de undefined de mas abajo, y por lo tanto no te redirige al sitio nuevo
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
                         * Step: Display the geocoded location on the map. aqui se pone el circulo rojo
                         */
                        var circulo = new Graphic(geometryLocation,symbolMarker); 
                        
                        //siempre decirle donde y como se pinta

                        mapMain.graphics.add(circulo)



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


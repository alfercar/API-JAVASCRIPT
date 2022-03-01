require([
  "esri/map",
  "esri/tasks/locator",
  "esri/tasks/AddressCandidate",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/Font",
  "esri/symbols/TextSymbol",
  "esri/graphic",

  "esri/tasks/BufferParameters",
  "esri/tasks/GeometryService",


  "esri/geometry/normalizeUtils",
  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleFillSymbol",



  "dojo/_base/Color",
  "dojo/_base/array",

  "dojo/dom",
  "dojo/on",
  "dojo/parser",
  "dojo/ready",

  "dijit/layout/BorderContainer",
  "dijit/layout/ContentPane"],
  function (Map, Locator, AddressCandidate, SimpleMarkerSymbol, Font, TextSymbol, Graphic, BufferParameters, GeometryService, normalizeUtils, SimpleLineSymbol, SimpleFillSymbol,
    Color, array,
    dom, on, parser, ready,
    BorderContainer, ContentPane) {

    ready(function () {
      parser.parse();

      var mapMain = new Map("divMap", {
        basemap: "satellite",
        center: [-3, 40],
        zoom: 6
      });


      var locator = new Locator("http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer")


      on(dom.byId("buscar"), "click", doAddressToLocations);



      function doAddressToLocations() {
        mapMain.graphics.clear();

        var objAddress = {
          "SingleLine": dom.byId("inputAdress").value
        }
        var params = {
          address: objAddress,
          outFields: ["Loc_name"]
        }
        locator.addressToLocations(params);
      };


      locator.on("address-to-locations-complete", showResults);

      function showResults(candidates) {

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

            geometryLocation = candidate.location;


            /*
             * Step: Display the geocoded location on the map
            Círculo rojo */

            let circulo = new Graphic(geometryLocation, symbolMarker)
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
      };

      

      on(dom.byId("buscar"), "click", buffer);

      function buffer (evt){

      var params = new BufferParameters();
      params.unit = GeometryService.UNIT_KILOMETER;
      params.geometries  = [ evt.mapPoint ];
      params.distances = [ 50 ];
    
    }

    });
  });






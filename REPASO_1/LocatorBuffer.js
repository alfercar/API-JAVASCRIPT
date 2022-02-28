
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
  function (Map, Locator, AddressCandidate, SimpleMarkerSymbol, Font, TextSymbol, Graphic,
    Color, array,
    dom, on, parser, ready,
    BorderContainer, ContentPane) {

    ready(function () {

      parser.parse();

      var mapMain = new Map("cpCenter", {
        basemap: "topo",
        center: [-117.19, 34.05],
        zoom: 13
      });

      var locator = new Locator("http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer");

      on(dom.byId("btnLocate"), "click", doAddressToLocations)

      function doAddressToLocations() {
        mapMain.graphics.clear();

        var direction = dom.byId("taAddress").value;
        console.log("Dirección: ", direction);

        var objAddress = {
          "SingleLine": direction
        };

        var params = { address: objAddress };
        console.log(params);

        locator.addressToLocations(params);


      }

      locator.on("address-to-locations-complete", showResults);

      function showResults(candidates) {

        console.log("candidates: ", candidates);

        var symbolMarker = new SimpleMarkerSymbol();
        symbolMarker.setStyle(SimpleMarkerSymbol.STYLE_CIRCLE);
        symbolMarker.setColor(new Color([255, 0, 0, 0.75]));
        var font = new Font("14pt", Font.STYLE_NORMAL, Font.VARIANT_NORMAL, "Helvetica");


        var geometryLocation;
        array.every(candidates.addresses, function (candidate) {


          if (candidate.score > 80) {

            var attributesCandidate = {
              address: candidate.address,
              score: candidate.score,
              locatorName: candidate.attributes.Loc_name
            };
            console.log("attributesCandidate", candidate)

            geometryLocation = candidate.location;

            var circulo = new Graphic(geometryLocation, symbolMarker);

            mapMain.graphics.add(circulo)

            var sAddress = candidate.address;
            var textSymbol = new TextSymbol(sAddress, font, new Color("#FF0000"));
            textSymbol.setOffset(0, -22);
            mapMain.graphics.add(new Graphic(geometryLocation, textSymbol));

            return false;
          }
        });

        if (geometryLocation !== undefined) {
          mapMain.centerAndZoom(geometryLocation, 12)
        }
      }

    });

  });


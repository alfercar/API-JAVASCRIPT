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
  "esri/geometry/Circle",



  "dojo/_base/Color",
  "dojo/_base/array",

  "dojo/dom",
  "dojo/on",
  "dojo/parser",
  "dojo/ready",

  "dijit/layout/BorderContainer",
  "dijit/layout/ContentPane"],
  function (Map, Locator, AddressCandidate, SimpleMarkerSymbol, Font, TextSymbol, Graphic, BufferParameters, GeometryService, normalizeUtils, SimpleLineSymbol, SimpleFillSymbol, Circle,
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

            geometryLocation = candidate.location;

            let circulo = new Graphic(geometryLocation, symbolMarker)
            mapMain.graphics.add(circulo);

            mapMain.graphics.add(new Graphic(geometryLocation, symbolMarker));

            createBuffer(geometryLocation); //Para instanciar la funcion fuera y que se guarde el paraemtro

            // exit the loop after displaying the first good match
            return false;
          }
        });

        // Center and zoom the map on the result
        if (geometryLocation !== undefined) {
          mapMain.centerAndZoom(geometryLocation, 12)
        }
      };


      function createBuffer(geometryLocation) {
        var linecircle = new SimpleLineSymbol();
        linecircle.setWidth(1.25);
        linecircle.setColor(new Color([0, 0, 0, 1]));

        var circleSymbol = new SimpleFillSymbol();
        circleSymbol.setColor(new Color([0, 168, 132, 0.38]));
        circleSymbol.setOutline(linecircle);

        const distance = dom.byId('inputBuffer').value;
        circlebuffer = new Circle({
          center: {
            x: geometryLocation.x,
            y: geometryLocation.y,
            spatialReference: geometryLocation.spatialReference
          },
          geodesic: true,
          radius: distance,
          radiusUnit: "esriMeters"
        });

        var graphicBuffer = new Graphic(circlebuffer, circleSymbol);

        mapMain.graphics.add(graphicBuffer);

      };

    });
  });






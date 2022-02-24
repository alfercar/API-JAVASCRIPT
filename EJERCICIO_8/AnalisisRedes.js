//La mayoria de cosas del require no sirven para este, se han ido sumando)

require([
  "esri/map",
  "esri/dijit/Directions",

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

  function (
    Map,

    Directions,

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

      // Create the map

      mapMain = new Map("cpCenter", {
          basemap: "topo",
          center: [-117.19, 34.05],
          zoom: 12
      });

      /*
       * Step: Add the Directions widget
       */

      var directions = new Directions({
          map : mapMain,
          routeTaskUrl : "http://utility.arcgis.com/usrsvcs/appservices/OM1GNiiACNJceMRn/rest/services/World/Route/NAServer/Route_World"
          }, "divDirections");

          directions.startup();

      /*
       * Step: Add the Print widget
       */


  });

});

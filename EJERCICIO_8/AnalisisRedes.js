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

      /*
             * Step: create an array of JSON objects that will be used to create print templates
             */

      /*     var myLayouts = [{
       "name" : "Letter ANSI A Landscape",
       "label" : "Landscape (PDF)",
       "format" : "pdf",
       "options" : {
       "legendLayers" : [], // empty array means no legend
       "scalebarUnit" : "Miles",
       "titleText" : "Landscape PDF"
       }
       }, {
       "name" : "Letter ANSI A Portrait",
       "label" : "Portrait (JPG)",
       "format" : "jpg",
       "options" : {
       "legendLayers" : [],
       "scaleBarUnit" : "Miles",
       "titleText" : "Portrait JPG"
       }
       }];

       */
      /*
       * Step: create the print templates
       */

      /*    var myTemplates = [];
       dojo.forEach(myLayouts, function(lo) {
       var t = new PrintTemplate();
       t.layout = lo.name;
       t.label = lo.label;
       t.format = lo.format;
       t.layoutOptions = lo.options
       myTemplates.push(t);
       });
       */

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
        map: mapMain,
        routeTaskUrl: "http://utility.arcgis.com/usrsvcs/appservices/OM1GNiiACNJceMRn/rest/services/World/Route/NAServer/Route_World"
      }, "divDirections");

      directions.startup();

      /*
       * Step: Add the Print widget
       */


    });

  });

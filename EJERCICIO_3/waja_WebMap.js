var mapMain;
var legendLayers;

/*
 * Step: Update the Web map Id
 */



// @formatter:off
require([
        "esri/map",
        "esri/arcgis/utils",

        "dijit/layout/BorderContainer",
        "dijit/layout/ContentPane"],
    function (Map, arcgisUtils,
              BorderContainer, ContentPane) {

// @formatter:on


        var webmapId = "7d987ba67f4640f0869acb82ba064228";
            
        arcgisUtils.createMap(webmapId,"cpCenter"); 
        // // Wait until DOM is ready *and* all outstanding require() calls have been resolved
        // ready(function () {

        //     // Parse DOM nodes decorated with the data-dojo-type attribute
        //     parser.parse();

            







        //     // Specify the initial extent
           


        //     /*
        //      * Step: Create a map using a web map ID
        //     */



           

		// 		/*
		// 		 * Step: Get the map from the response
		// 		*/
				
				
		// 		/*
        //          * Step: update the Legend
		// 		*/


        //     // });   


        //     //create a map
            

        //     // Add the USA map service to the map
            


        //     // Add the earthquakes layer to the map
            


        //     // Add the legend to the map
         


        // });

    });
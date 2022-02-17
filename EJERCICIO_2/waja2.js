JS:
require(["esri/map", "esri/geometry/Extent", "esri/layers/FeatureLayer","esri/layers/ArcGISDynamicMapServiceLayer", "esri/dijit/BasemapToggle", "esri/dijit/OverviewMap", "esri/dijit/Legend","dojo/domReady!"], function (Map, Extent, FeatureLayer, ArcGISDynamicMapServiceLayer, BasemapToggle, OverviewMap, Legend) {
    var sanfrancisco =  new Extent(
        {
            xmin: -13681103.419777958,
            ymin: 4515371.798668986,
            xmax: -13563696.144332087,
            ymax: 4570559.333090808,
            spatialReference: { 
                wkid: 102100 
            }
        })
    var myMap = new Map('divMap', {
        basemap: 'gray',  
        extent: sanfrancisco
       
    });
    var ciudades  = new ArcGISDynamicMapServiceLayer("http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer",
    {
        "opacity": 0.5
    });
    // Que capas se muestran ( sin añadir un filtro al servicio )
    ciudades.setVisibleLayers([0, 2, 3]);
    var terremotos  = new FeatureLayer("http://services.arcgis.com/ue9rwulIoeLEI9bj/arcgis/rest/services/Earthquakes/FeatureServer/0");
    terremotos.setDefinitionExpression("MAGNITUDE > 2")
    myMap.addLayers([ciudades, terremotos]);
    var basemapToggle = new BasemapToggle({
        map: myMap,
        visible: true,
        basemap: "hybrid"
      }, "togepi");
      basemapToggle.startup();

      var overviewMap = new OverviewMap({
          map: myMap,
      }, "muestra");
      overviewMap.startup();

      var legend = new Legend({
        map: myMap
      }, "legendDiv");
      legend.startup();
      legend.ALIGN_LEFT

});
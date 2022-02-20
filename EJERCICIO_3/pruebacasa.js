
require(["esri/map","esri/geometry/Extent","esri/layers/FeatureLayer","esri/dijit/BasemapToggle","esri/dijit/OverviewMap","dojo/domReady!"],function(Map, Extent,FeatureLayer, BasemapToggle,overviewMap){ //El DOM READY DEBE IR EL ULTIMO!!!!!! 
    
    
    var myMap = new Map('divMap',{
        basemap: 'dark-gray',
        //https://github.com/esri-es/arcgis-devlabs/tree/master/APIJavaScript/coordenadas
        extent: new Extent ({
            xmin: -419049.02677052986,
            ymin: 4924548.326445723,
            xmax: -404373.11733979575,
            ymax: 4931446.76824845,
            spatialReference: {
               wkid: 102100
            }
         
        })
    
    });


    


    var metro = new FeatureLayer("https://services1.arcgis.com/nCKYwcSONQTkPA4K/arcgis/rest/services/metroMadrid/FeatureServer/0");



    myMap.addLayers([metro]);

    var basemapToggle = new BasemapToggle({
        map: myMap,
        visible: true,
        basemap: "topo"
      }, "widget");
      basemapToggle.startup();

      var OverviewMapa = new overviewMap({
        map: myMap,
        attachTo: "bottom-left",
      },"vistagrande");
      OverviewMapa.startup();
},) 
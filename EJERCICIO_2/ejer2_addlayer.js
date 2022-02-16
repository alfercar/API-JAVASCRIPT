
require(["esri/map","esri/geometry/Extent","esri/layers/FeatureLayer","esri/layers/ArcGISDynamicMapServiceLayer","esri/dijit/BasemapToggle","dojo/domReady!"],function(Map, Extent,FeatureLayer, ArcGISDynamicMapServiceLayer, BasemapToggle,){ //El DOM READY DEBE IR EL ULTIMO!!!!!! 
    var myMap = new Map('divMap',{
        basemap: 'gray',
        extent: new Extent ({
            xmin: -14984446.002985604,
            ymin: 3583338.3730520504,
            xmax: -11227413.188713621,
            ymax: 5349339.474552293,
            spatialReference: {
               wkid: 102100
            }
        })
    
    });


    



    var ciudades = new ArcGISDynamicMapServiceLayer("http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer", {"opacity": 0.4});

    //Para poner las capas que queremos
    ciudades.setVisibleLayers([0,2,3]);


    var temblores = new FeatureLayer("http://services.arcgis.com/ue9rwulIoeLEI9bj/arcgis/rest/services/Earthquakes/FeatureServer/0");


    temblores.setDefinitionExpression("MAGNITUDE >= 2");

    myMap.addLayers([ciudades, temblores]);

    var basemapToggle = new BasemapToggle({
        map: myMap,
        visible: true,
        basemap: "topo"
      }, "widget");
      basemapToggle.startup();
},) 
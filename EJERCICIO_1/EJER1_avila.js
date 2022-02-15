//Map se `puede llamar como queramos pero lo suyo es igual y en mayusculas
// dojo ready ya esta por dfecto en api, si no habria que cargarlo como en los apuntes


require(["esri/map","esri/geometry/Extent","dojo/domReady!"],function(Map, Extent){ //El DOM READY DEBE IR EL ULTIMO!!!!!! 
    var myMap = new Map('divMap',{ //Creamos un objeto 
        basemap: 'satellite',
        // //ahora ponemos el centro en un punto en avila  
        // center: [-4.692268, 40.658077],
        // // //Ahora hacemos zoom
        // zoom:13
        //Ahora vamos a hacer extensión para Españita
        extent: new Extent ({
            xmin: -2290762.5378059917,
            ymin: 4043672.7247320134,
            xmax: 1466270.2764659931,
            ymax: 5809673.826232256,
            spatialReference: {
                 wkid: 102100}})
    });
},

)
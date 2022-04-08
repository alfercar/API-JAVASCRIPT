
var webmapId = "1c39bc1ee6984408804c81e8a4b00678";


require([
    "esri/map",
    "esri/geometry/Extent",


    "esri/dijit/Legend",
    "esri/dijit/Search",
    "esri/dijit/BasemapGallery",
    "esri/dijit/OverviewMap",
    "esri/dijit/Scalebar",

    "esri/InfoTemplate",
    "esri/layers/FeatureLayer",



    "dijit/TitlePane",
    "dijit/layout/TabContainer",
    "dijit/layout/ContentPane",
    "dijit/layout/BorderContainer",
    "dojo/domReady!"],

    function (
        Map,
        Extent,


        Legend,
        Search,
        BasemapGallery,
        OverviewMap,
        Scalebar,

        InfoTemplate,
        FeatureLayer,


    ) {


        //Mapa

        var extentInitial = new Extent({
            "xmin": -417155.29869496945,
            "ymin": 4925555.384089252,
            "xmax": -402479.38926423533,
            "ymax": 4932453.825891979,
            "spatialReference": {
                "wkid": 102100
            }
        });



        mapMain = new Map("map", {
            basemap: "topo-vector",
            extent: extentInitial
        });



        //popups

        var popupTiendas = new InfoTemplate(
            "${nombre}", "Plan: ${plan_}<br>Valoración: ${valoracion} <hr> Para mas información acceda a la aplicación.");

        var popupTeatros = new InfoTemplate(
            "${nombre}", "Plan: ${plan_}<br>Valoración: ${valoracion} <hr> Para mas información acceda a la aplicación.");

        var popupParques = new InfoTemplate(
            "${nombre}", "Plan: ${plan_}<br>Valoración: ${valoracion} <hr> Para mas información acceda a la aplicación.");

        var popupOcioNocturno = new InfoTemplate(
            "${nombre}", "Plan: ${plan_}<br>Valoración: ${valoracion} <hr> Para mas información acceda a la aplicación.");

        var popupMuseos = new InfoTemplate(
            "${nombre}", "Plan: ${plan_}<br>Valoración: ${valoracion} <hr> Para mas información acceda a la aplicación.");

        var popupDistritos = new InfoTemplate(
            "${nomdis}", "Distrito: ${nomdis}");

        var popupDeporte = new InfoTemplate(
            "${nombre}", "Plan: ${plan_}<br>Valoración: ${valoracion} <hr> Para mas información acceda a la aplicación.");

        var popupCines = new InfoTemplate(
            "${nombre}", "Plan: ${plan_}<br>Valoración: ${valoracion} <hr> Para mas información acceda a la aplicación.");

        var popupBares = new InfoTemplate(
            "${nombre}", "Plan: ${plan_}<br>Valoración: ${valoracion} <hr> Para mas información acceda a la aplicación.");

        //outfields

        var outfieldsTiendas = ["*"];
        var outfieldsTeatros = ["*"];
        var outfieldsCines = ["*"];
        var outfieldsBares = ["*"];
        var outfieldsOcioNocurno = ["*"];
        var outfieldsDistritos = ["*"];
        var outfieldsParques = ["*"];
        var outfieldsDeporte = ["*"];
        var outfieldsMuseos = ["*"];


        //capas
        var tiendas = new FeatureLayer("https://services5.arcgis.com/zZdalPw2d0tQx8G1/ArcGIS/rest/services/Datos_PlanApp1/FeatureServer/8", {
            "outFields": outfieldsTiendas,
            "infoTemplate": popupTiendas
        });

        var teatros = new FeatureLayer("https://services5.arcgis.com/zZdalPw2d0tQx8G1/ArcGIS/rest/services/Datos_PlanApp1/FeatureServer/7", {
            "outFields": outfieldsTeatros,
            "infoTemplate": popupTeatros
        });

        var parques = new FeatureLayer("https://services5.arcgis.com/zZdalPw2d0tQx8G1/ArcGIS/rest/services/Datos_PlanApp1/FeatureServer/6", {
            "outFields": outfieldsParques,
            "infoTemplate": popupParques
        });

        var ocioNocturno = new FeatureLayer("https://services5.arcgis.com/zZdalPw2d0tQx8G1/ArcGIS/rest/services/Datos_PlanApp1/FeatureServer/5", {
            "outFields": outfieldsOcioNocurno,
            "infoTemplate": popupOcioNocturno
        });

        var museos = new FeatureLayer("https://services5.arcgis.com/zZdalPw2d0tQx8G1/ArcGIS/rest/services/Datos_PlanApp1/FeatureServer/4", {
            "outFields": outfieldsMuseos,
            "infoTemplate": popupMuseos
        });

        var distritos = new FeatureLayer("https://services5.arcgis.com/zZdalPw2d0tQx8G1/ArcGIS/rest/services/Datos_PlanApp1/FeatureServer/3", {
            "outFields": outfieldsDistritos,
            "infoTemplate": popupDistritos
        });

        var deporte = new FeatureLayer("https://services5.arcgis.com/zZdalPw2d0tQx8G1/ArcGIS/rest/services/Datos_PlanApp1/FeatureServer/2", {
            "outFields": outfieldsDeporte,
            "infoTemplate": popupDeporte
        });

        var cines = new FeatureLayer("https://services5.arcgis.com/zZdalPw2d0tQx8G1/ArcGIS/rest/services/Datos_PlanApp1/FeatureServer/1", {
            "outFields": outfieldsCines,
            "infoTemplate": popupCines
        });

        var bares = new FeatureLayer("https://services5.arcgis.com/zZdalPw2d0tQx8G1/ArcGIS/rest/services/Datos_PlanApp1/FeatureServer/0", {
            "outFields": outfieldsBares,
            "infoTemplate": popupBares
        });



        mapMain.addLayers([distritos, tiendas, bares, deporte, cines, museos, parques, ocioNocturno, teatros]);



        mapMain.on("layers-add-result", function () {
            var leyenda = new Legend({
                map: mapMain,

                arrangement: Legend.ALIGN_LEFT,
                layerInfos: [{
                    layer: bares,
                    title: 'Bares y Restaurantes'
                }, {
                    layer: ocioNocturno,
                    title: 'Ocio Nocturno'
                }, {
                    layer: tiendas,
                    title: 'Tiendas'
                }, {
                    layer: cines,
                    title: 'Cines'
                }, {
                    layer: parques,
                    title: 'Parques'
                }, {
                    layer: teatros,
                    title: 'Teatros'
                }, {
                    layer: deporte,
                    title: 'Instalaciones deportivas'
                }, {
                    layer: museos,
                    title: 'Museos'
                }, {
                    layer: distritos,
                    title: 'Distritos Centro y Chamberí'
                }]
            }, "legendDiv");
            leyenda.startup();
        });



        //Widget busqueda

        var widgetBuscar = new Search({
            map: mapMain,
            autocomplete: true,
        }, "search");
        widgetBuscar.startup();

        //Basemap Gallery

        var basemapGallery = new BasemapGallery({
            showArcGISBasemaps: true,
            map: mapMain,
            attachTo: "top-right",
        }, "basemapGallery");
        basemapGallery.startup();

        //Overview Map

        var OverviewMap = new OverviewMap({
            map: mapMain,
            attachTo: "bottom-left",
            height: 150,
            width: 150,
            visible: true
        });
        OverviewMap.startup();

        //Barra de escalas

        var scalebar = new Scalebar({
            map: mapMain,
            attachTo: "bottom-center",
            scalebarUnit: "metric"
        });


    });


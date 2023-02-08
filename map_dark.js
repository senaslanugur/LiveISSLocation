require([
    "esri/Map",
    "esri/views/MapView",
    "esri/Graphic",
    "esri/widgets/BasemapToggle",
    "esri/geometry/Point",
    "esri/symbols/PictureMarkerSymbol",
    "esri/widgets/Search",
  ], function (Map, MapView, Graphic, BasemapToggle, Point, PictureMarkerSymbol, Search) {
    var map = new Map({
      basemap: "dark-gray",
    });
  
    var view = new MapView({
      container: "viewDiv",
      map: map,
      center: [0, 0],
      zoom: 5,
    });
  
    var symbol = new PictureMarkerSymbol({
      url: "https://cdn-icons-png.flaticon.com/512/124/124542.png",
      height: 32,
      width: 32,
    });
  
    var issMarker = new Graphic({
      symbol: symbol,
      geometry: new Point({
        longitude: 0,
        latitude: 0,
      }),
    });
    view.graphics.add(issMarker);
  
    var searchWidget = new Search({
      view: view,
      includeDefaultSources: false,
    });
    view.ui.add(searchWidget, "top-right");
  
    setInterval(function () {
      fetch("https://api.wheretheiss.at/v1/satellites/25544")
        .then((response) => {
          if (!response.ok) {
            console.error("Error fetching ISS location data.");
          }
          return response.json();
        })
        .then((data) => {
          view.center = [data.longitude, data.latitude];
          issMarker.geometry = new Point({
            longitude: data.longitude,
            latitude: data.latitude,
          });
        })
        .catch((error) => {
          console.error(error);
        });
    }, 3000);
  });
  
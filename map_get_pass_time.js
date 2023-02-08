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
    view.on("click", function(event) {
        var lat = event.mapPoint.latitude;
        var lon = event.mapPoint.longitude;
      
        // Use the following API endpoint
        fetch(`https://api.n2yo.com/rest/v1/satellite/passes/25544/${lat}/${lon}/0/2/&apiKey=8SH8GT-29KQ2R-73CVJV-4NSE`)
          .then(response => response.json())
          .then(data => {
            console.log(data.passes);
            // Display the pass times in an info popup or custom widget
          })
          .catch(error => console.error(error));
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

 
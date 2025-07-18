var map = L.map('map').setView([-25.0, 122.0], 5);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var erosionHotspotsLayer = L.layerGroup();

var overlayMaps = {
    "Coastal Erosion Hotspots": erosionHotspotsLayer
};

var layerControl = L.control.layers(null, overlayMaps).addTo(map);

// A tracker to prevent duplicate fetching
let erosionHotspotsLoaded = false;

map.addEventListener('overlayadd', function(event) {
    if (event.name === "Coastal Erosion Hotspots" && !erosionHotspotsLoaded) {
        fetchErosionHotspotsData();
    }
});

async function fetchErosionHotspotsData() {
    try {
        const response = await fetch("/app/data/processed/erosion_hotspots_geojson.geojson");
        if (!response.ok) {
            throw new Error("Unable to fetch resource");
        } 

        const data = await response.json();
        
        const geoLayer = L.geoJSON(data, {
            style: layerStyle.default,
            onEachFeature: function(feature, layer) {
                const props = feature.properties;
                layer.bindPopup(props.HOTSPOTS_NA);
                layer.on('click', function(){
                    this.setStyle(layerStyle.selection)
                    this.openPopup();
                })
                layer.on('mouseover', function(){
                    this.setStyle(layerStyle.highlighted)
                })
                layer.on('mouseout', function(){
                    this.setStyle(layerStyle.default)
                })
            }
        });

        erosionHotspotsLayer.addLayer(geoLayer);
        erosionHotspotsLoaded = true;
        
    } catch (error) {
        console.log("There was an error loading GeoJSON:", error);
    };
}

fetchInfrasDOT18Data();
async function fetchInfrasDOT18Data() {
    try {
        const response = await fetch("/app/data/processed/coastal_infrastructure_DOT_018.geojson");
        if (!response.ok) {
            throw new Error("Unable to fetch DOT-018");
        }

        const data = await response.json();

        L.geoJSON(data, {
            pointToLayer: function(feature, latlng) {
                // Simple orange circle marker with radius 6
                return L.circleMarker(latlng, {
                    radius: 6,
                    fillColor: "orange",
                    color: "darkorange",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            },
            onEachFeature: function(feature, layer) {
                // Popup content using assetdesc and lga fields from properties
                const props = feature.properties || {};
                const desc = props.assetdesc || "No description";
                const lga = props.lga || "Unknown area";

                layer.bindPopup(`<strong>Asset:</strong> ${desc}<br><strong>LGA:</strong> ${lga}`);
            }
        }).addTo(map);
    } catch (error) {
        console.error("Error loading DOT-018:", error);
    }
}

//fetchInfraDOT20Data();
async function fetchInfraDOT20Data() {
    try {
        const response = await fetch("/app/data/processed/coastal_infrastructure_DOT-020.geojson");
        if (!response.ok) {
            throw new Error("Unable to fetch DOT-020");
        }

        const data = await response.json();

        L.geoJSON(data, {
            style: function(feature) {
                // Color by structype (example colors)
                const structype = feature.properties.structype || "OTHER";
                let fillColor = "#3388ff"; // default blue
                
                if (structype === "CPK") fillColor = "#f28f3b"; // orange for Coastal Protection Keys
                else if (structype === "BLD") fillColor = "#33a02c"; // green for Buildings
                else if (structype === "WAL") fillColor = "#e31a1c"; // red for Walls
                // Add more structype cases as needed

                return {
                    color: fillColor,
                    weight: 2,
                    opacity: 1,
                    fillOpacity: 0.5
                };
            },
            onEachFeature: function(feature, layer) {
                const props = feature.properties || {};
                const structype = props.structype || "Unknown";
                const assetgroup = props.assetgroup || "N/A";
                const editDate = props.EditDate_txt || "No date";

                layer.bindPopup(
                    `<strong>Structure Type:</strong> ${structype}<br>` +
                    `<strong>Asset Group:</strong> ${assetgroup}<br>` +
                    `<strong>Edit Date:</strong> ${editDate}`
                );
            }
        }).addTo(map);

        console.log("DOT-020 polygons added");
    } catch (error) {
        console.error("Error loading DOT-020:", error);
    }
}

//fetchDEACoastlinesShorelinesData();
async function fetchDEACoastlinesShorelinesData() {
    try {
        const response = await fetch("/app/data/processed/dea_coastlines_shorelines.geojson");
        if (!response.ok) {
            throw new Error("Unable to fetch resource");
        } 

        const data = await response.json();
        
        L.geoJSON(data, {
            style: layerStyle.default,
            onEachFeature: function(feature, layer) {
                const props = feature.properties;
                layer.bindPopup(props.HOTSPOTS_NA);
                layer.on('click', function(){
                    this.setStyle(layerStyle.selection)
                    this.openPopup();
                })
                layer.on('mouseover', function(){
                    this.setStyle(layerStyle.highlighted)
                })
                layer.on('mouseout', function(){
                    this.setStyle(layerStyle.default)
                })
            }
        }).addTo(map)
        
    } catch (error) {
        console.log("There was an error loading GeoJSON:", error);
    };
}

//fetchDEACoastlinesRatesData();
async function fetchDEACoastlinesRatesData() {
    try {
        const response = await fetch("/app/data/processed/dea_coastlines_rates.geojson");
        if (!response.ok) {
            throw new Error("Unable to fetch resource");
        } 

        const data = await response.json();
        
    L.geoJSON(data, {
      style: layerStyle.default,
      onEachFeature: function(feature, layer) {
        const props = feature.properties;
        // Popup fallback
        const popupText = props.HOTSPOTS_NA || `Rate: ${props.rate_time || 'N/A'}`;
        layer.bindPopup(popupText);

        layer.on('click', function() {
          this.setStyle(layerStyle.selection);
          this.openPopup();
        });
        layer.on('mouseover', function() {
          this.setStyle(layerStyle.highlighted);
        });
        layer.on('mouseout', function() {
          this.setStyle(layerStyle.default);
        });
      }
    }).addTo(map);
        
    } catch (error) {
        console.log("There was an error loading GeoJSON:", error);
    };
}

var layerStyle = {
    'default': {
        'color': 'purple',
        'fillOpacity': 0.4,
        'weight': 2
    },
    'highlighted': {
        'color': 'blue',
        'fillOpacity': 0.4,
        'weight': 2
    },
    'selection': {
        'color': 'yellow',
        'fillOpacity': 0.4,
        'weight': 2
    }
}
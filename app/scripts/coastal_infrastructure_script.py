""" 
This script captures datasets: Coastal Infrastructures DOT-18 (Points), DOT-19 (Lines) and DOT-20 (Polygons) from DataWA's WFS API. 

DOT-18 (Points) - The Points feature class contains DoT Service Assets (water distribution, drainage, sewerage, electrical distribution etc), overbeach launches, boat mooring piles, DoT Signs and point representation of maintained (dredged) areas of deep water (channels and harbours).
DOT-19 (Lines) - The Lines feature class currently contains only DoT maintained roads. Roads included in this dataset are limited to those identified in the DoT asset management database
DOT-20 (Polygons) - The Polygons feature class contains coastal protection structures (seawalls, groynes, breakwaters).
"""
import geopandas as gpd

BASE_WFS_URL = "https://public-services.slip.wa.gov.au/public/services/SLIP_Public_Services/Infrastructure_and_Utilities_WFS/MapServer/WFSServer"

DATASETS = {
    "coastal_infrastructure_DOT_018": "esri:Coastal_Infrastructure_Point__DOT-018_",
    "coastal_infrastructure_DOT-019": "esri:Coastal_Infrastructure_Line__DOT-019_",
    "coastal_infrastructure_DOT-020": "esri:Coastal_Infrastructure_DOT__DOT-020_",
} # DOT-19 does not seem to have a geometry layer, so it does not seem to be working. Will come back to it.

# Download each layer and save as GeoJSON
def coastal_infrastructures_wfs():
    for dataset, layer_name in DATASETS.items():
        print(f"Downloading {dataset}...")
        wfs_url = (
            f"{BASE_WFS_URL}?service=WFS"
            f"&version=2.0.0"
            f"&request=GetFeature"
            f"&typeNames={layer_name}"
            f"&srsName=EPSG:4326"              # Reproject to lat/lon (WGS84)
        )
        
        try:
            gdf = gpd.read_file(wfs_url)
            gdf.to_file(f"../data/processed/{dataset}.geojson", driver="GeoJSON")
            print(f"Saved {dataset}.geojson")
        except Exception as e:
            print(f"Error downloading {dataset}: {e}")

# Calling the function
coastal_infrastructures_wfs()
# Print statement for successful donwload of datasets
print("The datasets have been successfully downloaded")
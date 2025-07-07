import requests
import geopandas as gpd

SHAPEFILE_FILE = "../data/raw/coastal_erosion_shapefile"
GEOJSON_FILE = "../data/processed/erosion_hotspots_geojson"

def shapefile_to_geojson(input_file_path, output_file_path):
    # Open and read shapefile
    gdf = gpd.read_file(input_file_path)

    # Shapefile with its original CRS (EPSG:7844)
    # Reproject to EPSG:4326 (WGS84) for compatibility with Leaflet.js
    gdf = gdf.to_crs(epsg=4326)

    # Write the shapefile into new .geojson file
    gdf.to_file(output_file_path, driver="GEOJSON")

# Call function with file paths as arguments
shapefile_to_geojson(SHAPEFILE_FILE, GEOJSON_FILE)

# Print statement for successful execution of file conversion
print("The shapefile has been converted into GEOJSON file format. Reprojected using Leaflet.js coordinate system.")
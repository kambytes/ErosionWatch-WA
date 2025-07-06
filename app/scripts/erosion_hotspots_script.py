import requests
import geopandas as gpd

SHAPEFILE_FILE = "../data/raw/"
GEOJSON_FILE = "../data/processed/"

def shapefile_to_geojson(input_file_path, output_file_path):
    # Open and read shapefile
    gdf = gpd.read_file(input_file_path)

    # Write the shapefile into new .geojson file
    gdf.to_file(output_file_path)

# Call function with file paths as arguments
shapefile_to_geojson(SHAPEFILE_FILE, GEOJSON_FILE)

# Print statement for successful execution of file conversion
print("The shapefile has been converted into GEOJSON file format.")
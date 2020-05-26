# MA Municipalities

## Data Conversion

We had to take the [TOWNSURVEY_POLYM.shp ](https://docs.digital.mass.gov/dataset/massgis-data-community-boundaries-towns-survey-points) and update `MANCHESTER` to `MANCHESTER-BY-THE-SEA` using QGIS.


Then we need to combine our data files with the shapefile into a TopoJSON using Mapshaper.
```sh
mapshaper assets/data/TOWNSURVEY_POLYM_2.shp \
  -join assets/data/ma-municipal-government-forms.csv keys=TOWN,Community string-fields='Home Rule 43B Adoption Year' \
  -o format=geojson - | \
mapshaper -i - -join assets/data/GenFundExpenditures2019.csv keys=TOWN,Municipality -o format=geojson - | \
mapshaper -i - -join assets/data/DOR_Income_EQV_Per_Capita.csv keys=TOWN,Municipality -o format=geojson - | \
geoproject 'd3.geoIdentity().reflectY(true).fitSize([900, 700], d)' | \
mapshaper -i - -o format=topojson assets/data/ma-municipal-government-forms-and-finances.json
```

Convert .xls to CSV
```sh
in2csv -l --sheet "Sheet1" assets/data/RegisteredVoters.xls > assets/data/RegisteredVoters.csv
```

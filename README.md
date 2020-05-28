# Massachusetts Municipalities Government Types Map

## Data Sources
* [2018-19 Municipal Directory](https://www.mma.org/wp-content/uploads/2017/12/muni_forms_of_gov2018.pdf)
* [2017-18 Municipal Directory](https://www.mma.org/wp-content/uploads/2018/07/muni_forms_of_gov_2017.pdf)
* [Massachusetts Cities and Towns](https://www.sec.state.ma.us/cis/cispdf/City_Town_Map.pdf)
* [Municipal Databank Including Cheery Sheets](https://www.mass.gov/municipal-databank-data-analytics-including-cherry-sheets)

## Data Conversion
The 2018-19 Municipal Directory was converted to a table using [Excalibur](https://github.com/camelot-dev/excalibur).

Datasets were normalized to all caps municipalities using [OpenRefine](https://openrefine.org).

We had to take the [TOWNSURVEY_POLYM.shp ](https://docs.digital.mass.gov/dataset/massgis-data-community-boundaries-towns-survey-points) and update `MANCHESTER` to `MANCHESTER-BY-THE-SEA` using QGIS.


Then we need to combine our data files with the shapefile into a TopoJSON using [Mapshaper](https://github.com/mbloch/mapshaper). The rationale for our GeoJSON to TopoJSON conversion is described [here](https://github.com/MAPC/infrastructure/blob/master/docs/D3%20Map%20Setup.md).
```sh
mapshaper assets/data/TOWNSURVEY_POLYM_2.shp \
  -join assets/data/ma-municipal-government-forms.csv keys=TOWN,Community string-fields='Home Rule 43B Adoption Year' \
  -o format=geojson - | \
mapshaper -i - -join assets/data/GenFundExpenditures2019.csv keys=TOWN,Municipality -o format=geojson - | \
mapshaper -i - -join assets/data/DOR_Income_EQV_Per_Capita.csv keys=TOWN,Municipality -o format=geojson - | \
geoproject 'd3.geoIdentity().reflectY(true).fitSize([900, 700], d)' | \
mapshaper -i - -o format=topojson assets/data/ma-municipal-government-forms-and-finances.json
```

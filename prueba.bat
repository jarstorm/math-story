cd js
del app.min.js
type *.js >> app.js
cd ..

:: Para producción
:: java -jar yuicompressor-2.4.2.jar -o ./js/app.min.js ./js/app.js

:: Para desarrollo
cd js
copy app.js app.min.js
cd ..

cd js
del app.js
cd ..
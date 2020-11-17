# ClarisaApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.1.4.
## Previous installations
Install [Node.js](https://nodejs.org/) to use npm.

Install project dependencies with npm at the root of the project
```sh
$ cd ClarisaApp
$ npm install
```
## Development server

Run `npm start` for a dev server to use proxy.conf. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Interface instructions
- #### Load .xlsx  file "Excel"
    Cargar archivo .xlsx.
- #### Post all institutions
    Una vez cargado el archivo .xlsx, esta funcionalidad permite subir instituciones y aceptarlas a la misma vez.
    Muchas veces el servidor responde con "[500 Internal Server Error](https://developer.mozilla.org/es/docs/Web/HTTP/Status/500)" por lo que se puede presionar nuevamente Post all institutions para volver a subir la instituciones restantes sin enviar las que ya se subieron, siempre y cuando el archivo tenga registro de si tiene instituciones subidas, en pocas palabras esto quiere decir que la instituciones que tienen codigo en el archivo de excel no se vuelven a enviar por condiciones en el codigo del proyecto.

- ####  Accept remaining
    Esta funcionalidad permite aceptar las instituciones que no quedaron aceptadas por el mismo "[500 Internal Server Error](https://developer.mozilla.org/es/docs/Web/HTTP/Status/500)" mencionado anteriormente ya que pueden surgir que multiples instituciones se suban pero no se acepten por el error 500.

- ####  Excel from storage
   Esta funcionalidad es de tipo emergencia ya que puede ocurrir que por equivocación se cierre el navegador sin haber generado el archivo de excel y no quede registro de los diferentes códigos que se obtienen, por lo que esta información quedará guardado en la memoria del navegador para poder descargarla al abrir nuevamente el navegador.

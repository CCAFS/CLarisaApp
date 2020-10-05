// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyA3UkEIFW8lwAiOlcwkOLJWmmfvlPCgx4k",
    authDomain: "clarisa-testing-app.firebaseapp.com",
    databaseURL: "https://clarisa-testing-app.firebaseio.com",
    projectId: "clarisa-testing-app",
    storageBucket: "clarisa-testing-app.appspot.com",
    messagingSenderId: "209124284302",
    appId: "1:209124284302:web:1eb8d6e34e66c7474f36df"
  },
  userData:{
    user: 'marlosadmin',
    password:'123'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

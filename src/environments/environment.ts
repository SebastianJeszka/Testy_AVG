// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  nonProdFeatures: true,
  appName: 'FormGen',
  origin: ['MSTUDENT', 'SIO', 'LOGIN_GOV_PL'],
  gatewayUrl: 'https://internal-k8s-edukacjadev-1b2195b825-1834133841.eu-central-1.elb.amazonaws.com',
  previewFormUrl: 'http://localhost:4222/',
  showDemoModeInfo: false,
  terytApiUrl: 'http://3.74.46.241:8091/app/teryt/api/v1',
  appId: '09a4c446-b356-4f9d-9ebc-0bed75f3f3d5'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

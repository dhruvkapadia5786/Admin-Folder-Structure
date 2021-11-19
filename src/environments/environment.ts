// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
	production: false,
	current_environment:'local',
  	encryption_key:'teledaddyFloridaPatel_healthcare',
	api_url: 'http://localhost:3001/',
  	client_app_url: 'http://localhost:4200/',
	stripeKey: 'pk_test_J1qdy5OTEEIhXIdoCT1arBrk',
	websocket_url: 'http://localhost:3001/',
	agora_app_id: '51be4b52db464404b35cba61cdbb3a82',
  	google_map_api_key:'AIzaSyCI53DNz8ya-neDPgwYH-TS__Wwxl_f3ms'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

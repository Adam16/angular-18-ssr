import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  provideClientHydration,
  withEventReplay,
  withHttpTransferCacheOptions,
} from '@angular/platform-browser';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideClientHydration(
      // in Developer Preview since NG 18
      withEventReplay(),
      // Configure SSR API Request Cache
      withHttpTransferCacheOptions({
        filter: () => true,
        includeHeaders: [],
        includePostRequests: true,
        includeRequestsWithAuthHeaders: false,
      }),
    ),
    provideRouter(appRoutes),
  ],
};

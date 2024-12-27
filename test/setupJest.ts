import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';
import './jestGlobalMocks'; // browser mocks globally available for every test

setupZoneTestEnv();

export * from './logger.service';
export * from './page-streams.service';
export * from './searching.service';
export * from './helper-functions.service';
export * from './app-mode.service';

import { LoggerService } from './logger.service';
import { SearchingService } from './searching.service';
import { HelperFunctionsService } from './helper-functions.service';
import { AppModeService } from './app-mode.service';

export const CORE_SERVICES = [
    LoggerService,
    AppModeService,
    SearchingService,
    HelperFunctionsService
];

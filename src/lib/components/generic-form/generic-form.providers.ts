import { CustomValidatorService } from './validators/custom-validator-type.service';
import { LinkResolverService } from './linking-factories/link-resolver.service';
import { ValidatorHelper } from './validators/validation.helper';
import { CustomFactoryResolver } from './linking-factories/link-factory-resolver.interface';
import { LinkFactoryResolverService } from './linking-factories/link-factory-resolver.service';
import { ValidatorChangeResolver } from './linking-factories/base-link-resolvers/validator-change.resolver';

export const GENERIC_FORM_RESOLVERS_PROVIDERS = [
    ValidatorChangeResolver
];

export const GENERIC_FORM_PROVIDERS = [
    CustomValidatorService,
    ValidatorHelper,
    LinkResolverService,
    LinkFactoryResolverService,
    CustomFactoryResolver,
    ...GENERIC_FORM_RESOLVERS_PROVIDERS
];

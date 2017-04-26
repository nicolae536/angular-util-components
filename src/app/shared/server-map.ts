let dataFoler = '/assets/mocks/app-configuration';

export const SERVER_MAP = {
    appSideMenu: dataFoler + '/app-side-menu.json',
    autocompleteData: dataFoler + '/search-data.json',
    components: {
        autocomplete: dataFoler + '/api-documentation/autocomplete.json',
        form: dataFoler + '/api-documentation/generic-form-api.json'
    },
    form: {
        'definition': dataFoler + '/api-documentation/generic-form-definition.json',
        'validation': dataFoler + '/api-documentation/generic-form-validation.json',
        'static-links': dataFoler + '/api-documentation/generic-form-static-links.json',
        'runtime-links': dataFoler + '/api-documentation/generic-form-runtime-links.json',
    },
    services: {
        'page-streams': dataFoler + '/api-documentation/page-streams.json',
        'searching': dataFoler + '/api-documentation/searching-service.json'
    },
    formDefinitions: {
        simpleExample: dataFoler + '/form-definitions/generic-form-simple-example.json',
        definitionExample: dataFoler + '/form-definitions/generic-form-definition-example.json',
        validationExample: dataFoler + '/form-definitions/generic-form-validation-example.json',
        staticLinksExample: dataFoler + '/form-definitions/generic-form-static-links-example.json',
        runtimeLinksExample: dataFoler + '/form-definitions/generic-form-runtime-links-example.json',
        newFormExemple: dataFoler + '/form-definitions/new-form-api-example.json'
    }
};

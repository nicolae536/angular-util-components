#Generic form component

###Form component api
Field|type|Description
-----|----|--------
initialValue|@Input| if the initial value is not passed the form will use it's own generated initial value from the fields
resetFormOnValueChange|@Input| if you want to set a new value from the upper component and to reset for errors along with it this should be true
formValue|@Input|The form value
formDefinition|@Input|[The form definition which is described here ](https://github.com/nicolae536/ng2Tools/tree/master/src/core/components/generic-form/GENERIC_FORM_CONFIGURATION.md)
dataServices|@Input| not implemented yet the autocomplete needs this to call your backend
useDefaultTheme|@Input| if you want to use my default theme for testing
enableLogging|@Input| if you want to see the value of the form in html
onFormReady|@Output| when the form was rendered
onValueChange|@Output| each time a user changes a value this event will emit
onFormSubmit|@Output| when the form was submitted

###Form component declaration
This is a small exemple for form declaration
```html
<ngt-generic-form
    [formDefinition]="formDefinition"
    [formValue]="value"
    [enableLogging]="true">
</ngt-generic-form>
```
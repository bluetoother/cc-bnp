var util = require( "util" );

var ccBnpError = {
    HciError: HciError,
    AttError: AttError,
    GenericError: GenericError
};

module.exports = ccBnpError;

function CcBnpError (settings, implementationContext) {
    settings = settings || {};
    this.name = 'ccBnpError';

    this.type = ( settings.type || 'ccBnpError' );
    this.message = ( settings.message || 'An error occurred in CcBpn framework.' );
    this.detail = ( settings.detail || '' );
    this.extendedInfo = ( settings.extendedInfo || '' );
    this.errorCode = ( settings.errorCode || '' );
    this.isCoatError = true;

     Error.captureStackTrace( this, ( implementationContext || CcBnpError ) );
}
util.inherits(CcBnpError, Error);

function HciError(message, code) {
    return new CcBnpError({
        type: 'HciError',
        message: (' HciError, ' + message),
        errorCode: ( code || '' )
    });
}

function AttError(message, code) {
    return new CcBnpError({
        type: 'AttError',
        message: ( 'AttError, ' + message),
        errorCode: ( code || '' )
    });
}

function GenericError(message, code) {
    return new CcBnpError({
        type: 'GenericError',
        message: ( 'GenericError, ' + message),
        errorCode: ( code || '' )
    });
}
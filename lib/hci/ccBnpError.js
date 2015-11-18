var util = require( "util" );

var ccBnpError = {
    HciError: HciError,
    AttError: AttError,
    GenericError: GenericError
};

module.exports = ccBnpError;

function CcBnpError (settings, implementationContext) {
    settings = settings || {};

    this.name = ( settings.name || 'ccBnpError' );
    this.type = ( settings.type || 'ccBnpError' );
    this.message = ( settings.message || 'An error occurred in CcBpn framework.' );
    this.errorCode = ( settings.errorCode || '' );
    this.isCcBnpError = true;

     Error.captureStackTrace( this, ( implementationContext || CcBnpError ) );
}
util.inherits(CcBnpError, Error);

function HciError(message, code) {
    return new CcBnpError({
        name: 'HciError' + '(' + code + ')',
        type: 'HciError',
        message: ( message || '' ),
        errorCode: ( code || '' )
    });
}

function AttError(message, code) {
    return new CcBnpError({
        name: 'AttError' + '(' + code + ')',
        type: 'AttError',
        message: ( message || '' ),
        errorCode: ( code || '' )
    });
}

function GenericError(message, code) {
    return new CcBnpError({
        name: 'GenericError' + '(' + code + ')',
        type: 'GenericError',
        message: ( message || '' ),
        errorCode: ( code || '' )
    });
}
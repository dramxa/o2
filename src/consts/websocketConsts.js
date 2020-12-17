export const wsObjectTypes = {
    'org'       : 'org',
    'user'      : 'usr',
    'role'      : 'role',
    'limit'     : 'lmt',

    'project'   : 'prj',
    'group'     : 'grp',
    'vm'        : 'vm',

    'media'     : 'med',
    'template'  : 'tmpl',

    'network'   : 'net',
    'pricelist' : 'prc',
}

export const wsStatusCodes = {
    '1000': { error: false, caption : 'Normal Closure'             , description: 'Normal closure; the connection successfully completed whatever purpose for which it was created.'},
    '1001': { error: true , caption : 'Going Away'                 , description: 'The endpoint is going away, either because of a server failure or because the browser is navigating away from the page that opened the connection.' },
    '1002': { error: true , caption : 'Protocol Error'             , description: 'The endpoint is terminating the connection due to a protocol error.' },
    '1003': { error: true , caption : 'Unsupported Data'           , description: 'The connection is being terminated because the endpoint received data of a type it cannot accept (for example, a text-only endpoint received binary data).' },
    '1005': { error: true , caption : 'No Status Received'         , description: 'Reserved.  Indicates that no status code was provided even though one was expected.' },
    '1006': { error: true , caption : 'Abnormal Closure'           , description: 'Reserved. Used to indicate that a connection was closed abnormally (that is, with no close frame being sent) when a status code is expected.' },
    '1007': { error: true , caption : 'Invalid frame payload data' , description: 'The endpoint is terminating the connection because a message was received that contained inconsistent data (e.g., non-UTF-8 data within a text message).' },
    '1008': { error: true , caption : 'Policy Violation'           , description: 'The endpoint is terminating the connection because it received a message that violates its policy. This is a generic status code, used when codes 1003 and 1009 are not suitable.' },
    '1009': { error: true , caption : 'Message too big'            , description: 'The endpoint is terminating the connection because a data frame was received that is too large.' },
    '1010': { error: true , caption : 'Missing Extension'          , description: 'The client is terminating the connection because it expected the server to negotiate one or more extension, but the server didn\'t.' },
    '1011': { error: true , caption : 'Internal Error'             , description: 'The server is terminating the connection because it encountered an unexpected condition that prevented it from fulfilling the request.' },
    '1012': { error: true , caption : 'Service Restart'            , description: 'The server is terminating the connection because it is restarting. [Ref]' },
    '1013': { error: true , caption : 'Try Again Later'            , description: 'The server is terminating the connection due to a temporary condition, e.g. it is overloaded and is casting off some of its clients. [Ref]' },
    '1014': { error: true , caption : 'Bad Gateway'                , description: 'The server was acting as a gateway or proxy and received an invalid response from the upstream server. This is similar to 502 HTTP Status Code.' },
    '1015': { error: true , caption : 'TLS Handshake'              , description: 'Reserved. Indicates that the connection was closed due to a failure to perform a TLS handshake (e.g., the server certificate can\'t be verified).' },
}
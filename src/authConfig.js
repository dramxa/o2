export default {
    urlToken          : 'v1.0/auth/connect/token',
    urlCheckToken     : 'v1.0/auth/connect/userinfo',  

    data         : {
        grant_type    : 'password', 

        scope        : 'PublicAPI offline_access openid',

        client_id     : 'FrontEndUI',

        client_secret : 'xNnXIfFDBZBTN5jkgwK6825XjOGJPywUDb1bX5ggYI8vWR1C88l8yXJGq0oVVBwdnjT2HUCVIy1G1u3r'
    }
}
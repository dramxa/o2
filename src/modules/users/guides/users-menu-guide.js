export default {
    usr_menu: {        
        sectionPath         : 'users',
        steps               : [

            {
                type                : 'step',
                objectSelector      : '.gd-account-menu-btn',
                showArrow           : true,
                scriptNext          : ()=>qs('.gd-account-menu-btn').click(),
            },

            {
                type                : 'step',
                objectSelector      : '.gd-account-menu',
                showArrow           : true,
                arrowType           : 'h-arrow',
                innerSelect         : '.gd-account-menu-profile',
                scriptBack          : ()=>qs('.gd-account-menu-btn').click(),
            },

            {
                type                : 'step',
                objectSelector      : '.gd-account-menu',
                showArrow           : true,
                arrowType           : 'h-arrow',
                innerSelect         : '.gd-account-menu-location',
            },

            {
                type                : 'step',
                objectSelector      : '.gd-account-menu',
                showArrow           : true,
                arrowType           : 'h-arrow',
                innerSelect         : '.gd-account-menu-changeTheme',
            },

            {
                type                : 'step',
                objectSelector      : '.gd-account-menu',
                showArrow           : true,
                arrowType           : 'h-arrow',
                innerSelect         : '.gd-account-menu-guides',
                feature             : 'ft_guideShow',
            },

            {
                type                : 'step',
                objectSelector      : '.gd-account-menu',
                showArrow           : true,
                arrowType           : 'h-arrow',
                innerSelect         : '.gd-account-menu-logout',
            },

        ]
    }
}
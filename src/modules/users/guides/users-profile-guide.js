export default {
    usr_profile: {        
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
                sectionPath         : 'profile',
                objectSelector      : '.gd-usrProfile-lastName',
                showArrow           : true,
                arrowType           : 'h-arrow',
                scriptBack          : ()=>qs('.gd-usrProfile-close').click(),
            },

            {
                type                : 'step',
                sectionPath         : 'profile',
                objectSelector      : '.gd-usrProfile-firstName',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },

            {
                type                : 'step',
                sectionPath         : 'profile',
                objectSelector      : '.gd-usrProfile-middleName',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },

            {
                type                : 'step',
                sectionPath         : 'profile',
                objectSelector      : '.gd-usrProfile-login',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },

            {
                type                : 'step',
                sectionPath         : 'profile',
                objectSelector      : '.gd-usrProfile-chngPass',
                showArrow           : true,
                arrowType           : 'h-arrow',
                feature             : 'ft_profUpdatePassword',
            },

            {
                type                : 'step',
                sectionPath         : 'profile',
                objectSelector      : '.gd-usrProfile-email',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },

            {
                type                : 'step',
                sectionPath         : 'profile',
                objectSelector      : '.gd-usrProfile-apply',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },

            {
                type                : 'step',
                sectionPath         : 'profile',
                objectSelector      : '.gd-usrProfile-close',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },


        ]
    }
}
import Vue from 'vue';
import rolesConst from './rolesConst'
import permConst from './permConst'

const store = Vue.prototype.$store

const moduleName = 'security'

const ROLE_KEY = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'

const module =  {
    /**
     * Проверка прав пользователя на наличие определенного разрешения
     * @param {*} permissionCode название разрешения
     */
    havePermissionGA: function(){
        return store.getters.glb_permissionPA;
    },

    havePermission: function(permissionCode){        
        if(isNullOrUndefined(permissionCode))
            return false;
        if(permissionCode=='ft_tskRead')
            return false;
        // if(store.getters.glb_permissionPA)
        //     return true;      

        return store.getters.glb_permissions.includes(permissionCode);
    },

    anyPermission: function(permissionCodes){
        if(isNullOrUndefined(permissionCodes))
            return false;
        // if(store.getters.glb_permissionPA)
        //     return true;

        var res = false;
        permissionCodes.forEach(permissionCode => {
            if(store.getters.glb_permissions.includes(permissionCode)){
                res = true;
                return;
            }
        });
        return res;
    },

    havePermissionObj: function(permissionCode, objId){
        if(isNullOrUndefined(permissionCode))
            return false;
        if(permissionCode=='ft_tskRead')
            return false;
        // if(store.getters.glb_permissionPA)
        //     return true;

        return store.getters.glb_permissions.includes(permissionCode);
    },

    anyPermissionObj: function(permissionCodes, objId){
        if(isNullOrUndefined(permissionCodes))
            return false;
        // if(store.getters.glb_permissionPA)
        //     return true;

        permissionCodes.forEach(permissionCode => {
            if(store.getters.glb_permissions.includes(permissionCode))
                return true;
        });
        return false;
    },

    fillPermissions: async function() {
        var roles = store.getters.auth_accessTokenInfo[ROLE_KEY];
        var allEnabledFeatures = await Vue.prototype.$features.computedFeatures();
        allEnabledFeatures = allEnabledFeatures.map(m=>m.code);
        if(!Array.isArray(roles))
            roles = [roles];
        
        log.info(roles, 'security')

        if(roles.includes('PlatformAdministrator')){
            store.dispatch('glb_setPermissions',  { permissions: allEnabledFeatures, globalAdministrator: true })
            return;
        }

        var userPermissions = [];
        roles.forEach(role => {
            if(!isNullOrUndefined(rolesConst[role])){
                userPermissions.push(...rolesConst[role].permissions)
            }
        });
        // убираем дубликаты пермишенов
        userPermissions = userPermissions.filter((value, index, self)=>self.indexOf(value) === index);

        var allowedUserFeatures = userPermissions.reduce((r,e)=>{
            var permItem = permConst.find(f=>f.code == e);
            if(!isNullOrUndefined(permItem)){
                var permFeatures = permItem.features;
                permFeatures.forEach(item=>{
                    if(allEnabledFeatures.some(f=>f == item))
                        r.push(item);
                })
            }
            return r;
        }, []);
        
        store.dispatch('glb_setPermissions',  { permissions:allowedUserFeatures, globalAdministrator: false })
    },

    /** Ф-я вызывается при получении по реактивности модели текущего пользователя
     *  Выполняет обновление текущего токена и проверяет наличие изменений в списке ролей
     * если роли не совпадают с старыми, делает рефреш страницы
     */
    checkAndUpdateUserToken: async function(incomingUser){
        // если пришло изменение пользователя не текущего, завершаем проверку
        if(incomingUser.id != store.getters.auth_accessTokenInfo.user_id || isNullOrUndefined(incomingUser.roles))
            return; 

        log.debug('checkAndUpdateUserToken', 'security')
        // первичная проверка по справочнику (если отличается от текущего, продолжаем проверку)
        var oldRoles = clone(store.getters.auth_accessTokenInfo[ROLE_KEY]);
        if(!Array.isArray(oldRoles))
            oldRoles = [oldRoles];

        var roleConstArray = Object.entries(rolesConst).map(e=>{ return { code: e[0], ...e[1] }} );
        var newRoles = roleConstArray.filter(i=>incomingUser.roles.some(k=>k == i.id)).map(m=>m.code);
        if(!Array.isArray(newRoles))
            newRoles = [newRoles];

        let compareResult = oldRoles.length === newRoles.length && oldRoles.sort().every(function(value, index) { return value === newRoles.sort()[index]});
        if(compareResult){
            // console.log('checkAndUpdateUserToken return')
            return;
        }

        var res = await Vue.prototype.$auth.tryRefresh();
        if(res){ // если удалось обновить ключи
            log.debug('compare roles of current users', 'security')
            let newRoles = clone(store.getters.auth_accessTokenInfo[ROLE_KEY]);
            if(!Array.isArray(newRoles))
                newRoles = [newRoles];
            // console.log({ oldRoles, newRoles, auth_accessTokenInfo : store.getters.auth_accessTokenInfo});
            let compareResult = oldRoles.length === newRoles.length && oldRoles.sort().every(function(value, index) { return value === newRoles.sort()[index]});
            // console.log('compare =' + compareResult);
            if(!compareResult){
                // console.log(Vue.prototype.$routerStatic)
                document.location.reload(true);
                //Vue.prototype.$routerStatic.go();
            }
        }
    },

    enable: async function(){
        var roles = store.getters.auth_accessTokenInfo[ROLE_KEY];        
        if(!Array.isArray(roles))
            roles = [roles];

        var allEnabledFeatures = await Vue.prototype.$features.computedFeatures();
        allEnabledFeatures = allEnabledFeatures.map(m=>m.code);        
        
        if(roles.includes('PlatformAdministrator')){
            store.dispatch('glb_setPermissions',  { permissions: allEnabledFeatures, globalAdministrator: true })
            return;
        }

        var userPermissions = Object.values(rolesConst).reduce((r,e)=>{ r.push(...e.permissions); return r;}, []);
        // убираем дубликаты пермишенов
        userPermissions = userPermissions.filter((value, index, self)=>self.indexOf(value) === index);



        var allowedUserFeatures = userPermissions.reduce((r,e)=>{
            var permItem = permConst.find(f=>f.code == e);
            if(!isNullOrUndefined(permItem)){
                var permFeatures = permItem.features;
                permFeatures.forEach(item=>{
                    if(allEnabledFeatures.some(f=>f == item))
                        r.push(item);
                })
            }
            return r;
        }, []);
        
        store.dispatch('glb_setPermissions',  { permissions:allowedUserFeatures, globalAdministrator: false })
    },

    featureSet: function({ add, del, pa }){
        var nowFeatures = store.getters.glb_permissions;
        var nowPa = store.getters.glb_permissionPA;
        if(!isNullOrUndefined(add) && !nowFeatures.some(s=>s==add)){
            nowFeatures.push(add)
        }

        if(!isNullOrUndefined(del) && nowFeatures.some(s=>s==del)){
            nowFeatures = nowFeatures.filter(f=>f!=del)
        }

        if(!isNullOrUndefined(pa)){
            nowPa = pa
        }

        store.dispatch('glb_setPermissions',  { permissions: nowFeatures, globalAdministrator: nowPa })
    }

}

  
export default function () {
    let key = `$${moduleName}`;
    Vue.prototype[key] = module
}
  
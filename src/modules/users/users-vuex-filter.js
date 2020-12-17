import { objectValuesToString } from '@/utilites'

export default { 
    filter: {
        use     : false,
        search  : '',
        
        login        : "",
        fullName     : "",
        email        : "",
        blocked      : [],
        
        date   : { 
            use  : false, 
            from : "", 
            to   : ""
        }, 

    },

    applyFilter: function (item, filter){
        return (!filter.use ? true :
        (!filter.login         != "" ? true : item.login.toLowerCase().includes(filter.login.toLowerCase())) &&
        (!filter.fullName      != "" ? true : item.prep.nameFull.toLowerCase().includes(filter.fullName.toLowerCase())) &&
        (!filter.email         != "" ? true : item.email.toLowerCase().includes(filter.email.toLowerCase())) &&
        (!filter.date.use            ? true : item.createDate >= filter.date.from && item.createDate <= filter.date.to) &&
        (!filter.blocked.length  > 0 ? true : filter.blocked.some( filterItem => filterItem == item.isBlocked.toString())))
        
        && (!filter.search   != ""   ? true : objectValuesToString(item).includes(filter.search.toLowerCase()))
    }
}
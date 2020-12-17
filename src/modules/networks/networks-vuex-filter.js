import { objectValuesToString } from '@/utilites'

export default { 
    filter: {
        use     : false,
        search  : '',
        
        name         : "",
        location     : "",
        statuses     : [],
        types        : [],
        comment      : "",

        vlan         :  { 
            use  : false, 
            from : "", 
            to   : ""
        },

        vmCount: { 
            use  : false, 
            from : "", 
            to   : ""
        },  

        vlan        : { 
            use  : false, 
            from : "", 
            to   : ""
        },

        date   : { 
            use  : false, 
            from : "", 
            to   : ""
        }, 
    },
   
    applyFilter: function (item, filter){
        return (!filter.use ? true :
        (!filter.statuses.length > 0 ? true : filter.statuses.some( filterItem => filterItem == item.statusCode)) &&
        (!filter.types.length    > 0 ? true : filter.types.some( filterItem => filterItem == item.type)) &&
        (!filter.name          != "" ? true : item.name.toLowerCase().includes(filter.name.toLowerCase())) &&
        (!filter.comment       != "" ? true : item.comment.includes(filter.comment)) &&
        (!filter.vmCount.use         ? true : item.connectedVms.length >= filter.vmCount.from && item.connectedVms.length <= filter.vmCount.to) &&
        (!filter.date.use            ? true : item.createDate >= filter.date.from && item.createDate <= filter.date.to) &&
        (!filter.location      != "" ? true : (isNullOrUndefined(item.prep.resourceProfileFullpath)? true : item.prep.resourceProfileFullpath.includes(filter.location))) &&      
        (!filter.vlan.use            ? true : item.vlan >= filter.vlan.from && item.vlan <= filter.vlan.to))

        && (!filter.search   != ""   ? true : objectValuesToString(item).includes(filter.search.toLowerCase()))
    }
}
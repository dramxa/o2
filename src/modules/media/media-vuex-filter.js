import { objectValuesToString } from '@/utilites'

export default { 
    filter: {
        use     : false,
        search  : '',

        name         : "",
        location     : "",
        statuses     : [],

        connectedVms: { 
            use  : false, 
            from : "", 
            to   : ""
        },  

        size   : { 
            use  : false, 
            from : "", 
            to   : ""
        },    

        date   : { 
            use  : false, 
            from : "", 
            to   : ""
        }
    },

    applyFilter: function (item, filter){
        return (!filter.use ? true :
        (!filter.statuses.length > 0 ? true : filter.statuses.some( filterItem => filterItem == item.statusCode)) &&
        (!filter.name          != "" ? true : item.name.toLowerCase().includes(filter.name.toLowerCase())) &&

        (!filter.connectedVms.use  ? true : item.connectedVms.length >= filter.connectedVms.from && item.connectedVms.length <= filter.connectedVms.to) &&
        (!filter.date.use          ? true : item.createDate >= filter.date.from && item.createDate <= filter.date.to) &&
        (!filter.location    != "" ? true : (isNullOrUndefined(item.prep.resourceProfileFullpath)? true : item.prep.resourceProfileFullpath.includes(filter.location))) &&      
        (!filter.size.use          ? true : item.size >= filter.size.from*1024 && item.size <= filter.size.to*1024))
        
        && (!filter.search != ""   ? true : objectValuesToString(item).includes(filter.search.toLowerCase()))

    }
}
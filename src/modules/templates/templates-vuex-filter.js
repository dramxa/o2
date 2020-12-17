import { objectValuesToString } from '@/utilites'

export default { 
    filter: {
        use     : false,
        search  : '',

        name         : "",
        location     : "",
        statuses     : [],
        os           : [],
        locked       : [],

        cpu    : { 
            use  : false, 
            from : "", 
            to   : ""
        },  

        ram    : { 
            use  : false, 
            from : "", 
            to   : ""
        },  

        storage: { 
            use  : false, 
            from : "", 
            to   : ""
        }, 

        date   : { 
            use  : false, 
            from : "", 
            to   : ""
        }, 

        price  : { 
            use  : false, 
            from : "", 
            to   : ""
        } 
    },

    applyFilter: function (item, filter){
        return (!filter.use ? true :
            (!filter.statuses.length > 0 ? true : filter.statuses.some( filterItem => filterItem == item.statusCode)) &&
            (!filter.os.length       > 0 ? true : filter.os.some( filterItem => filterItem == item.osCode)) &&
            (!filter.name        != "" ? true : item.name.toLowerCase().includes(filter.name.toLowerCase())) &&
            (!filter.cpu.use           ? true : item.cpu >= filter.cpu.from && item.cpu <= filter.cpu.to) &&
            (!filter.ram.use           ? true : item.ram >= filter.ram.from*1024 && item.ram <= filter.ram.to*1024) && 
            (!filter.storage.use       ? true : item.prep.storageTotal >= filter.storage.from && item.prep.storageTotal <= filter.storage.to) &&
            (!filter.date.use          ? true : item.createDate >= filter.date.from && item.createDate <= filter.date.to) &&
            (!filter.location    != "" ? true : (isNullOrUndefined(item.prep.resourceProfileFullpath)? true : item.prep.resourceProfileFullpath.includes(filter.location))) &&      
            (!filter.price.use         ? true : item.prep.priceTotal >= filter.price.from && item.prep.priceTotal <= filter.price.to) &&
            (!filter.locked.length > 0 ? true : filter.locked.some(fi => fi == item.isLocked.toString()))
            )

            && (!filter.search != ""   ? true : objectValuesToString(item).includes(filter.search.toLowerCase()))
        }
}
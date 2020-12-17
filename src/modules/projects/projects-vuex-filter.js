import { objectValuesToString } from '@/utilites'

export default { 
    filter: {
        use     : false,
        search  : '',

        name         : "",
        statuses     : [],

        groupCount: { 
            use  : false, 
            from : "", 
            to   : ""
        }, 

        vmCount: { 
            use  : false, 
            from : "", 
            to   : ""
        },  

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


        date   : { 
            use  : false, 
            from : "", 
            to   : ""
        }, 

        dateExpired  : { 
            use  : false, 
            from : "", 
            to   : ""
        }, 

        price        : { 
            use  : false, 
            from : "", 
            to   : ""
        } 
    },

    applyFilter: function (item, filter){
        return (!filter.use ? true :
            (!filter.statuses.length > 0 ? true : filter.prep.statuses.some( filterItem => item.prep.statuses.includes(filterItem))) &&
            (!filter.name          != "" ? true : item.name.toLowerCase().includes(filter.name.toLowerCase())) &&
            (!filter.groupCount.use      ? true : item.prep.groupCount >= filter.groupCount.from && item.prep.groupCount <= filter.groupCount.to) &&
            (!filter.vmCount.use         ? true : item.prep.vmCount >= filter.vmCount.from && item.prep.vmCount <= filter.vmCount.to) &&
            (!filter.cpu.use             ? true : item.prep.cpuTotal >= filter.cpu.from && item.prep.cpuTotal <= filter.cpu.to) &&
            (!filter.ram.use             ? true : item.prep.ramTotal >= filter.ram.from*1024 && item.prep.ramTotal <= filter.ram.to*1024) && 
            (!filter.date.use            ? true : item.createDate >= filter.date.from && item.createDate <= filter.date.to) &&
            (!filter.price.use           ? true : item.prep.price >= filter.price.from && item.prep.price <= filter.price.to))

            && (!filter.search   != ""   ? true : objectValuesToString(item).includes(filter.search.toLowerCase()))

    }
}
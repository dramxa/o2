import { objectValuesToString } from '@/utilites'

export default { 
    filter: {
        use     : false,

        search  : "",

        states       : [],
        name         : "",
        statuses     : [],
        projectName  : "",
        groupName    : "",
        os           : [],
        location     : "",


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
            (!filter.states.length   > 0 ? true : filter.states.some( filterItem => filterItem == item.powerStateCode)) &&
            (!filter.statuses.length > 0 ? true : filter.statuses.some( filterItem => filterItem == item.statusCode)) &&
            (!filter.os.length       > 0 ? true : filter.os.some( filterItem => filterItem == item.osCode)) &&
            (!filter.name        != "" ? true : item.name.toLowerCase().includes(filter.name.toLowerCase())) &&
            (!filter.projectName != "" ? true : (isNullOrUndefined(item.prep.projectName)? (filter.projectName=='null'? true: false) : item.prep.projectName.toLowerCase().includes(filter.projectName.toLowerCase()))) && 
            (!filter.groupName   != "" ? true : (isNullOrUndefined(item.prep.groupName)? (filter.groupName=='null'? true: false)  : item.prep.groupName.toLowerCase().includes(filter.groupName.toLowerCase()))) &&     
            (!filter.cpu.use           ? true : item.cpu >= filter.cpu.from && item.cpu <= filter.cpu.to) &&
            (!filter.ram.use           ? true : item.ram >= filter.ram.from*1024 && item.ram <= filter.ram.to*1024) && 
            (!filter.storage.use       ? true : item.prep.storageTotal >= filter.storage.from && item.prep.storageTotal <= filter.storage.to) &&
            (!filter.date.use          ? true : item.createDate >= filter.date.from && item.createDate <= filter.date.to) &&
            (!filter.price.use         ? true : item.prep.priceTotal >= filter.price.from && item.prep.priceTotal <= filter.price.to) &&
            (!filter.location    != "" ? true : (isNullOrUndefined(item.prep.resourceProfileFullpath)? true : item.prep.resourceProfileFullpath.includes(filter.location)))      
            )

            && (!filter.search    != ""   ? true : objectValuesToString(item).includes(filter.search.toLowerCase()))
    }
}
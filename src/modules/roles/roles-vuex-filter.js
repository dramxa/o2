import { objectValuesToString } from '@/utilites'

export default { 
    filter: {
        use     : false,
        search  : '',

        name         : "",    
        
        description  : "",

        system   : [],

        date   : { 
            use  : false, 
            from : "", 
            to   : ""
        }

    },

    applyFilter: function (item, filter){
        return (!filter.use ? true :
            (!filter.name        != "" ? true : item.name.toLowerCase().includes(filter.name.toLowerCase())) &&
            (!filter.date.use          ? true : item.createDate >= filter.date.from && item.createDate <= filter.date.to) &&
            (!filter.description != "" ? true : (isNullOrUndefined(item.description)? (filter.description=='null'? true: false) : item.description.toLowerCase().includes(filter.description.toLowerCase()))) && 
            (!filter.system.length > 0 ? true : filter.system.some( filterItem => filterItem == item.isSystem.toString()))
            )

            && (!filter.search != ""   ? true : objectValuesToString(item).includes(filter.search.toLowerCase()))

    }
}
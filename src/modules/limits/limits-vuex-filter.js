import { objectValuesToString } from '@/utilites'

export default { 
    filter: {
        use     : false,
        search  : '',

        name         : "",    
        
        projectName  : "",
        groupName    : "",
        location     : "",
        providerLimit: [],

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
            (!filter.projectName != "" ? true : (isNullOrUndefined(item.prep.projectName)? (filter.projectName=='null'? true: false) : item.prep.projectName.toLowerCase().includes(filter.projectName.toLowerCase()))) && 
            (!filter.groupName   != "" ? true : (isNullOrUndefined(item.prep.groupName)? (filter.groupName=='null'? true: false)  : item.prep.groupName.toLowerCase().includes(filter.groupName.toLowerCase()))) &&
            (!filter.location    != "" ? true : (isNullOrUndefined(item.prep.resourceProfileFullpath)? true : item.prep.resourceProfileFullpath.includes(filter.location))) &&      
            (!filter.providerLimit.length  > 0 ? true : filter.providerLimit.some( filterItem => filterItem == item.isProviderLimit.toString()))
            )
        
            && (!filter.search != ""   ? true : objectValuesToString(item).includes(filter.search.toLowerCase()))

    }
}
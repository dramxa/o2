import { objectValuesToString } from '@/utilites'

export default { 
    filter: {
        use     : false,
        search  : '',
        
        name            : "",
        description     : "",
        projectName     : "",
        groupName       : "",
        location        : "",
        currencies      : [],
        isProviderPrice : [],
        date   : { 
            use  : false, 
            from : "", 
            to   : ""
        }

    },

    applyFilter: function (item, filter){
        return (!filter.use ? true :
            (!filter.currencies.length  >  0 ? true : filter.currencies.some( filterItem => filterItem == item.currencyCode)) &&
            (!filter.name              != "" ? true : item.name.toLowerCase().includes(filter.name.toLowerCase())) &&
            (!filter.description       != "" ? true : item.description.toLowerCase().includes(filter.description.toLowerCase())) &&
            (!filter.projectName       != "" ? true : (isNullOrUndefined(item.prep.projectName)? (filter.projectName=='null'? true: false) : item.prep.projectName.toLowerCase().includes(filter.projectName.toLowerCase()))) && 
            (!filter.groupName         != "" ? true : (isNullOrUndefined(item.prep.groupName)? (filter.groupName=='null'? true: false)  : item.prep.groupName.toLowerCase().includes(filter.groupName.toLowerCase()))) &&     
            (!filter.isProviderPrice.length  > 0 ? true : filter.isProviderPrice.some( filterItem => filterItem == item.isProviderPrice.toString())) &&
            (!filter.location    != "" ? true : (isNullOrUndefined(item.prep.resourceProfileFullpath)? true : item.prep.resourceProfileFullpath.includes(filter.location))) &&      
            (!filter.date.use          ? true : item.createDate >= filter.date.from && item.createDate <= filter.date.to)) 

            && (!filter.search != ""   ? true : objectValuesToString(item).includes(filter.search.toLowerCase()))
        }
}
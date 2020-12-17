import { objectValuesToString } from '@/utilites'

export default { 
    filter: {
        use     : false,
        search  : '',

        name         : "",
        fullName     : "",
        code         : "",
        comment      : "",
        blocked      : [],

        

        projectCount: { 
            use  : false, 
            from : "", 
            to   : ""
        }, 

        groupCount: { 
            use  : false, 
            from : "", 
            to   : ""
        }, 

        date   : { 
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
        (!filter.name          != "" ? true : item.name.toLowerCase().includes(filter.name.toLowerCase())) &&
        (!filter.fullName      != "" ? true : item.fullName.toLowerCase().includes(filter.fullName.toLowerCase())) &&
        (!filter.code          != "" ? true : item.code.toLowerCase().includes(filter.code.toLowerCase())) &&
        (!filter.comment       != "" ? true : item.comment.toLowerCase().includes(filter.comment.toLowerCase())) &&
        (!filter.projectCount.use    ? true : item.projectsCount >= filter.projectCount.from && item.projectsCount <= filter.projectCount.to) &&
        (!filter.groupCount.use      ? true : item.groupsCount >= filter.groupCount.from && item.groupsCount <= filter.groupCount.to) &&
        (!filter.date.use            ? true : item.createDate >= filter.date.from && item.createDate <= filter.date.to) &&
        (!filter.blocked.length  > 0 ? true : filter.blocked.some( filterItem => filterItem == item.isBlocked.toString())))

        && (!filter.search   != ""   ? true : objectValuesToString(item).includes(filter.search.toLowerCase()))
    }
}
import { objectValuesToString } from '@/utilites'

export default { 
    filter: {
        use     : false,
        search  : '',
        
        jobName : '',
        target : '',
        status : [],
        acknowledge : [],
        initiator : '',

        startTime   : { 
            use  : false, 
            from : "", 
            to   : ""
        },

        completeTime   : { 
            use  : false, 
            from : "", 
            to   : ""
        },
        
        duration   : { 
            use  : false, 
            from : "", 
            to   : ""
        }
        
    },
    
    applyFilter: function (item, filter){
        return (!filter.use ? true :
        (!filter.target      != "" ? true : (item.objectName.toLowerCase().includes(filter.target.toLowerCase()) || item.objectId.toLowerCase().includes(filter.target.toLowerCase())))
        
        // (!filter.stateCodes.length > 0 ? true : filter.stateCodes.some( filterItem => filterItem == item.stateCode)) &&
        // (!filter.typeCodes.length  > 0 ? true : filter.typeCodes.some( filterItem => filterItem == item.typeCode)) &&
        // (!filter.objectType.length > 0 ? true : filter.objectType.some( filterItem => filterItem == item.objectType)) &&
        // (!filter.objectName      != "" ? true : (item.objectName.toLowerCase().includes(filter.objectName.toLowerCase()) || item.objectId.toLowerCase().includes(filter.objectName.toLowerCase()))) &&
        // (!filter.userLogin       != "" ? true : item.userLogin.toLowerCase().includes(filter.userLogin.toLowerCase())) &&
        // (!filter.message         != "" ? true : item.message.toLowerCase().includes(filter.message.toLowerCase())) &&
        // (!filter.date.use              ? true : item.createDate >= filter.date.from && item.createDate <= filter.date.to) &&
        // (!filter.acknowledge.length> 0 ? true : filter.acknowledge.some( filterItem => filterItem == item.acknowledge.toString())))
        )
        && (!filter.search     != ""   ? true : objectValuesToString(item).includes(filter.search.toLowerCase()))
        
    }
}
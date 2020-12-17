import { objectValuesToString } from '@/utilites'

export default {
    filter: {
        use     : false,
        search  : '',    
        name    : ''
    },
    
    applyFilter: function(item, filter){
        return (!filter.use ? true :
        (!filter.name        != "" ? true : item.name.toLowerCase().includes(filter.name.toLowerCase())) 
        )
        && (!filter.search != ""   ? true : objectValuesToString(item).includes(filter.search.toLowerCase()))        
    }
}
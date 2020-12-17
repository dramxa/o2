import { vmPowerStateCode } from '@/consts/vmConsts';
import { currenciesCode   } from '@/consts/pricelistConst';
import { objStatusCode, objBlockedCode, objLockedCode, objYesNoCode, netTypesCode  } from '@/consts/_otherConsts';
import { tskStateCodes, tskObjTypeCodes  } from '@/consts/taskConsts';
              
export default {
    data () { return {
        chipsInner : [],
        useFilter  : false,
        state      : null,
    } },

    computed:{
        chipsSorted(){
          return this.chipsInner.sort((a,b) => (a.orderIndex > b.orderIndex) ? 1 : ((b.orderIndex > a.orderIndex) ? -1 : 0)); 
        }, 
    },

    watch:{
        filter:{
            handler: function(filter){
                    this.headers.forEach(item => {
                        switch(item.value){
                            // Checkbox combo fields
                            case 'powerStateCode':{
                                item.choosen = filter.states;
                                item.onChange = (value)=>this.filter.states = value;
                                item.items = vmPowerStateCode;
                                this.updateChipsCombo(item);
                                break;
                            };
                            case 'statusCode':{
                                item.choosen = filter.statuses;
                                item.onChange =  (value)=>this.filter.statuses = value;
                                item.items = objStatusCode;
                                this.updateChipsCombo(item);
                                break;
                            };
                            case 'tskStates':{
                                item.choosen = filter.stateCodes;
                                item.onChange =  (value)=>this.filter.stateCodes = value;
                                item.items = tskStateCodes;
                                this.updateChipsCombo(item);
                                break;
                            };
                            case 'tskObjTypes':{
                                item.choosen = filter.objectType;
                                item.onChange =  (value)=>this.filter.objectType = value;
                                item.items = tskObjTypeCodes;
                                this.updateChipsCombo(item);
                                break;
                            };
                            case 'isLocked':{
                                item.choosen = filter.locked;
                                item.onChange =  (value)=>this.filter.locked = value;
                                item.items = objLockedCode;
                                this.updateChipsCombo(item);
                                break;
                            };
                            case 'isBlocked':{
                                item.choosen = filter.blocked;
                                item.onChange =  (value)=>this.filter.blocked = value;
                                item.items = objBlockedCode;
                                this.updateChipsCombo(item);
                                break;
                            };
                            case 'currencyCode':{
                                item.choosen = filter.currencies;
                                item.onChange =  (value)=>this.filter.currencies = value;
                                item.items = currenciesCode;
                                this.updateChipsCombo(item);
                                break;
                            };
                            case 'prep.osName':{
                                item.choosen = filter.os;
                                item.onChange = (value)=>this.filter.os = value;
                                item.items = this.os_itemsAll;
                                this.updateChipsCombo(item);
                                break;
                            };
                            case 'netType':{
                                item.choosen = filter.types;
                                item.onChange = (value)=>this.filter.types = value;
                                item.items = netTypesCode;
                                this.updateChipsCombo(item);
                                break;
                            };
                            case 'isProviderLimit':{
                                item.choosen = filter.providerLimit;
                                item.onChange =  (value)=>this.filter.providerLimit = value;
                                item.items = objYesNoCode;
                                this.updateChipsCombo(item);
                                break;
                            };
                            case 'isProviderPrice':{
                                item.choosen = filter.isProviderPrice;
                                item.onChange =  (value)=>this.filter.isProviderPrice = value;
                                item.items = objYesNoCode;
                                this.updateChipsCombo(item);
                                break;
                            };                            
                            case 'isSystem':{
                                item.choosen = filter.system;
                                item.onChange =  (value)=>this.filter.system = value;
                                item.items = objYesNoCode;
                                this.updateChipsCombo(item);
                                break;
                            };


                            // Text fields
                            case 'name':{
                                item.choosen = filter.name;
                                item.onChange = (value)=>this.filter.name = value;
                                break;
                            };
                            case 'prep.projectName':{
                                item.choosen = filter.projectName;
                                item.onChange = (value)=>this.filter.projectName = value;
                                break;
                            };
                            case 'prep.groupName':{
                                item.choosen = filter.groupName;
                                item.onChange = (value)=>this.filter.groupName = value;
                                break;
                            };
                            case 'comment':{
                                item.choosen = filter.comment;
                                item.onChange = (value)=>this.filter.comment = value;
                                break;
                            };                            
                            case 'code':{
                                item.choosen = filter.code;
                                item.onChange = (value)=>this.filter.code = value;
                                break;
                            };

                            case 'userLogin':{
                                item.choosen = filter.userLogin;
                                item.onChange = (value)=>this.filter.userLogin = value;
                                break;
                            };
                            case 'objectName':{
                                item.choosen = filter.objectName;
                                item.onChange = (value)=>this.filter.objectName = value;
                                break;
                            };
                            case 'message':{
                                item.choosen = filter.message;
                                item.onChange = (value)=>this.filter.message = value;
                                break;
                            };

                            case 'prep.nameFull':{
                                item.choosen = filter.fullName;
                                item.onChange = (value)=>this.filter.fullName = value;
                                break;
                            };
                            case 'login':{
                                item.choosen = filter.login;
                                item.onChange = (value)=>this.filter.login = value;
                                break;
                            };
                            case 'email':{
                                item.choosen = filter.email;
                                item.onChange = (value)=>this.filter.email = value;
                                break;
                            };                            
                            case 'description':{
                                item.choosen = filter.description;
                                item.onChange = (value)=>this.filter.description = value;
                                break;
                            };                            

                            // From-To fields  #int
                            case 'cpu':{
                                item.choosen = filter.cpu;
                                item.onChange = (value)=>this.filter.cpu = value;
                                this.updateChipsFromTo(item)
                                break;
                            }; 
                            case 'ram':{
                                item.choosen = filter.ram;
                                item.onChange = (value)=>this.filter.ram = value;
                                this.updateChipsFromTo(item)
                                break;
                            };
                            case 'prep.vmCount':{
                                item.choosen = filter.vmCount;
                                item.onChange = (value)=>this.filter.vmCount = value;
                                this.updateChipsFromTo(item)
                                break;
                            }; 
                            case 'prep.groupCount':{
                                item.choosen = filter.groupCount;
                                item.onChange = (value)=>this.filter.groupCount = value;
                                this.updateChipsFromTo(item)
                                break;
                            };
                            case 'projectsCount':
                            case 'prep.projectsCount':{
                                item.choosen = filter.projectCount;
                                item.onChange = (value)=>this.filter.projectCount = value;
                                this.updateChipsFromTo(item)
                                break;
                            }; 
                            case 'groupsCount':
                            case 'prep.groupsCount':{
                                item.choosen = filter.groupCount;
                                item.onChange = (value)=>this.filter.groupCount = value;
                                this.updateChipsFromTo(item)
                                break;
                            };
                            case 'connectedVms':{
                                item.choosen = filter.connectedVms;
                                item.onChange = (value)=>this.filter.connectedVms = value;
                                this.updateChipsFromTo(item)
                                break;
                            };
                            case 'vlan':{
                                item.choosen = filter.vlan;
                                item.onChange = (value)=>this.filter.vlan = value;
                                this.updateChipsFromTo(item)
                                break;
                            };
                            case 'size':{
                                item.choosen = filter.size;
                                item.onChange = (value)=>this.filter.size = value;
                                this.updateChipsFromTo(item)
                                break;
                            };

                            case 'prep.storageTotal':{
                                item.choosen = filter.storage;
                                item.onChange = (value)=>this.filter.storage = value;
                                this.updateChipsFromTo(item)
                                break;
                            };
                            case 'prep.priceTotal':{
                                item.choosen = filter.price;
                                item.onChange = (value)=>this.filter.price = value;
                                this.updateChipsFromTo(item)
                                break;
                            };

                            // From-To fields  #date
                            case 'createDate':
                            case 'prep.createDateFormatted':{
                                item.choosen = filter.date;
                                item.onChange = (value)=>this.filter.date = value;
                                this.updateChipsFromTo(item)
                                break;
                            };
                            case 'expiryDate':{
                                item.choosen = filter.dateExpired;
                                item.onChange = (value)=>this.filter.dateExpired = value;
                                this.updateChipsFromTo(item)
                                break;
                            };

                            // Location field
                            case 'prep.resourceProfileFullpath':{
                                item.choosen = filter.location;
                                item.onChange = (value)=>this.filter.location = value;
                                this.updateChipsLocation(item)
                                break;
                            };
                        }                
                    })  
                    
                    if(filter.use)
                        this.$nav.setFilter(filter);
                    else
                        this.$nav.clearFilter();
            },
            deep:true,
            immediate:true
        },

        'filter.use':{
            handler: function(use){
                this.useFilter = use;
            },
            immediate: true
        }
    },

    methods:{
        updateChipsCombo(headerItem){
            this.deleteChipsByTypeName(headerItem.text);

            var itemsCodeNames = headerItem.items.reduce(function(r, e) {
                r[e['code']] = e['name'];
                return r;
              }, {});            

            var value = headerItem.choosen.map(m=>itemsCodeNames[m]);  
            if(value.length>0)
              this.chipsInner.push({type: headerItem.text, text: value.join(', '), orderIndex: 1, clear: ()=>{ headerItem.onChange([]) } })
        },

        updateChipsFromTo(headerItem){
            this.deleteChipsByTypeName(headerItem.text);
            
            var chipText = headerItem.fromToType == 'date' ? 
                    formatDate(headerItem.choosen.from) + ' - ' + formatDate(headerItem.choosen.to)
                    :  headerItem.choosen.from + ' - ' + headerItem.choosen.to 

            if(headerItem.choosen.use)
              this.chipsInner.push({type: headerItem.text, text: chipText, orderIndex: 3, clear: ()=>{ headerItem.onChange({ use: false, from:'', to: ''}) } })

        },

        updateChipsLocation(headerItem){
            this.deleteChipsByTypeName(headerItem.text);
            
            var chipText = headerItem.choosen; 
            if(headerItem.choosen!='')
              this.chipsInner.push({type: headerItem.text, text: chipText, orderIndex: 3, clear: ()=>{ headerItem.onChange('')  }})
        },

        deleteChipsByTypeName(typeName){
            var f= this.chipsInner.map((m, index)=>{
              return { type: m.type, index}
            }
              ).filter(f=>f.type==typeName);
            for(var i=f.length-1; i>=0; i--){
              this.chipsInner.splice(f[i].index,1);
            }
        }
    
    }
}
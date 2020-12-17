<template>
<div class="w-project white pa-3 br-2 relative" >
<div v-if="loading" class="w-project__loading-overlay white">
    <div class="fs-m fw-b pa-3" :class="[dsbrd_prj_loading ? 'widgets-title-opacity' : 'grey700']">RESOURCES AND PROJECTS</div>
    <div v-if="dsbrd_prj_loading" class="w-project__loading-message fs-ml text-center">Loading...</div>
    <div v-else class="w-project__no-data d-flex align-center justify-space-around">
        <div class="fs-ml fw-b grey700 px-2">No objects for accounting</div>
    </div>
</div>
<div class="grey700 fs-m fw-b mb-2 d-flex justify-space-between" v-if="!loading">
    <div>RESOURCES AND PROJECTS</div>
    <v-menu offset-y left width="170px">
        <template v-slot:activator="{ on, value }">
            <v-btn v-on="on" :class="{'grey100-b': value}" icon tile text width="24" height="24" class="w-project__export-btn br-4 ml-2">
                <i class="grey500-i icon-Donner icon-16"></i>
            </v-btn>
        </template>
        <v-list width="170px" class="control-combobox py-2 border blue050-border br-4">
            <v-list-item height="32px" class="fs-m" @click="exportCsv()">Export list (CSV)</v-list-item>
        </v-list>
    </v-menu>
</div>
<div class="w-project__chart-wrapper d-flex relative" v-if="!loading">
    <!-- <v-flex style="max-width: 121px;" class="border-right grey300-border" v-if="!$vuetify.breakpoint.smAndDown">
        <div class="grey500 fs-m">Total Count</div>
        <div class="fs-xxl grey500 text-center mt-6 mr-3">{{totalProjects}}</div>
    </v-flex> -->
    <div class="w-project__chart-title fs-s grey500" :class="[$vuetify.breakpoint.smAndDown ? 'text-right' : 'text-center']" :style="{right: $vuetify.breakpoint.smAndDown ? '24px' : '128px'}">TOTAL PROJECTS - <span class="fw-b">{{totalProjects}}</span></div>
    <v-flex>
        <div class="fs-m grey500"><span :class="[storageMode ? 'pointer border-bottom-dashed grey500-border' : '', ]" @click="storageMode = false">Resources</span> {{storageMode ? '/ Storage' : ''}}</div>
        <div class="d-flex mt-2" v-if="!storageMode">
            <div class="fs-s grey500 project-widget-chart-resource flex-grow-0 mr-2">
                <div class="d-flex align-center mb-1">CPU</div>
                <div class="d-flex align-center mb-1">RAM</div>
                <div class="d-flex align-center pointer border-bottom-dashed grey500-border" @click="storageMode = true">Storage</div>
            </div>
            <div class="project-widget-chart flex-grow-1">
                <div class="project-widget-chart-line mb-1 d-flex relative">
                    <!--  -->
                    <div v-if="total.cpu.total == 0" class="project-widget-chart-item" style="position:absolute;top:0;bottom:0;left:0;right:0;background:rgba(156, 156, 156, 0.5);z-index:1;"></div>
                    <div :class="{'project-widget-custom-tooltip-hide': !tooltip.show}" class="px-4 py-2 grey100 project-widget-custom-tooltip fs-s" style="background:rgba(0,0,0,0.8);margin: -5px -16px;position:absolute;bottom:39px;width:180px;" :style="{left: `${tooltip.left}px`, transform: `${!tooltip.show ? 'scale(0)' : 'none'}`}">
                        <div class="fs-m fw-b text-center mb-2" style="color:rgba(255,255,255,0.92)">{{tooltip.name}}</div>
                        <div class="d-flex">
                            <div class="fw-b flex-grow-1">
                                <div style="color:rgba(255,255,255,0.76)">CPU:</div>
                                <div style="color:rgba(255,255,255,0.76)">RAM:</div>
                                <div style="color:rgba(255,255,255,0.76)">STORAGE:</div>
                            </div>
                            <div class="text-right mr-1 flex-grow-0">
                                <div class="fw-b monospace" style="color:rgba(255,255,255,0.92)">{{tooltip.cpu.size}}&nbsp;&nbsp;&nbsp;</div>
                                <div class="fw-b monospace" style="color:rgba(255,255,255,0.92)">{{correctStorageValue(tooltip.ram.converted.value)}}</div>
                                <div class="fw-b monospace" style="color:rgba(255,255,255,0.92)">{{correctStorageValue(tooltip.storage.converted.value)}}</div>
                            </div>
                            <div class="flex-grow-0 text-left">
                                <div style="color:rgba(255,255,255,0.76)">CORES</div>
                                <div style="color:rgba(255,255,255,0.76)">{{tooltip.ram.converted.unit}}</div>
                                <div style="color:rgba(255,255,255,0.76)">{{tooltip.storage.converted.unit}}</div>
                            </div>
                        </div>
                    </div>                    
                    <div class="project-widget-chart-item pointer relative" 
                        v-for="prj in projects" :key="prj.id"
                        :class="{'project-widget-chart-item-hover': prj.tooltip}"
                        :style="{background: prj.color, '--box-shadow-color': prj.color, width: calcPercentWidth(total.cpu.total, prj.cpu.size) }" 
                        @mouseenter="prj.tooltip = true, onHover(prj, $event), hoverOpacity($event, true), tooltip.show = true"
                        @mouseleave="prj.tooltip = false, hoverOpacity($event, false), tooltip.show = false"
                    ></div>
                </div>
                <div class="project-widget-chart-line mb-1 d-flex relative">
                    <div v-if="total.ram.total == 0" class="project-widget-chart-item" style="position:absolute;top:0;bottom:0;left:0;right:0;background:rgba(156, 156, 156, 0.5);z-index:1;"></div>
                    <div 
                    class="project-widget-chart-item pointer relative" 
                    :class="{'project-widget-chart-item-hover': prj.tooltip}"
                    v-for="prj in projects" :key="prj.id" 
                    :style="{background: prj.color, '--box-shadow-color': prj.color, width: calcPercentWidth(total.ram.total, prj.ram.size) }"
                    @mouseenter="prj.tooltip = true, onHover(prj, $event), hoverOpacity($event, true), tooltip.show = true"
                    @mouseleave="prj.tooltip = false, hoverOpacity($event, false), tooltip.show = false"
                    ></div>
                </div>
                <div class="project-widget-chart-line d-flex relative">
                    <div v-if="total.storage.total == 0" class="project-widget-chart-item" style="position:absolute;top:0;bottom:0;left:0;right:0;background:rgba(156, 156, 156, 0.5);z-index:1;"></div>
                    <div class="project-widget-chart-item pointer relative" 
                    :class="{'project-widget-chart-item-hover': prj.tooltip}"
                    v-for="prj in projects" 
                    :key="prj.id" 
                    :style="{background: prj.color, '--box-shadow-color': prj.color, width: calcPercentWidth(total.storage.total, prj.storage.size) }"
                    @mouseenter="prj.tooltip = true, onHover(prj, $event), hoverOpacity($event, true), tooltip.show = true"
                    @mouseleave="prj.tooltip = false, hoverOpacity($event, false), tooltip.show = false"
                    ></div>
                </div>
            </div>
            <div class="flex-grow-0 project-widget-chart-resource-quantity fs-m grey500 mr-3">
                <div class="d-flex mb-1 pt-1">
                    <div style="width:45px;" class="text-right flex-grow-0 mr-1 grey700 fw-b monospace">{{total.cpu.total}}</div>
                    <div class="flex-grow-1">CORES</div>
                </div>
                <div class="d-flex mb-1 pt-1">
                    <div style="width:45px;" class="text-right flex-grow-0 mr-1 grey700 fw-b monospace">{{total.ram.converted.value}}</div>
                    <div class="flex-grow-1">{{total.ram.converted.unit}}</div>
                </div>
                <div class="d-flex pt-1">
                    <div style="width:45px;" class="text-right flex-grow-0 mr-1 grey700 fw-b monospace">{{total.storage.converted.value}}</div>
                    <div class="flex-grow-1">{{total.storage.converted.unit}}</div>
                </div>
            </div>
        </div>
        <div class="d-flex mt-2" v-if="storageMode">
            <div class="fs-s grey500 project-widget-chart-resource flex-grow-0 mr-2">
                <div class="d-flex align-center mb-1">SAS</div>
                <div class="d-flex align-center mb-1">SATA</div>
                <div class="d-flex align-center">SSD</div>
            </div>
            <div class="project-widget-chart flex-grow-1">
                <div class="project-widget-chart-line mb-1 d-flex relative">
                    <div v-if="total.sas.total == 0" class="project-widget-chart-item" style="position:absolute;top:0;bottom:0;left:0;right:0;background:rgba(1, 40, 84, 0.13);z-index:1;"></div>
                    <div :class="{'project-widget-custom-tooltip-hide': !tooltip.show}" class="px-4 py-2 grey100 project-widget-custom-tooltip fs-s" style="background: rgba(0, 0, 0, 0.8);margin: -5px -16px;position:absolute;bottom:35px;width:180px;" :style="{left: `${tooltip.left}px`, transform: `${!tooltip.show ? 'scale(0)' : 'none'}`}">
                        <div class="fs-m fw-b text-center mb-2" style="color:rgba(255, 255, 255, 0.92)">{{tooltip.name}}</div>
                        <div class="d-flex">
                            <div class="flex-grow-1 fw-b">
                                <div style="color:rgba(255, 255, 255, 0.76)">SAS:</div>
                                <div style="color:rgba(255, 255, 255, 0.76)">SATA:</div>
                                <div style="color:rgba(255, 255, 255, 0.76)">SSD:</div>
                            </div>
                            <div class="flex-grow-0 text-right fw-b monospace mr-1">
                                <div style="color:rgba(255, 255, 255, 0.92)">{{correctStorageValue(tooltip.sas.converted.value)}} </div>
                                <div style="color:rgba(255, 255, 255, 0.92)">{{correctStorageValue(tooltip.sata.converted.value)}}</div>
                                <div style="color:rgba(255, 255, 255, 0.92)">{{correctStorageValue(tooltip.ssd.converted.value)}} </div>
                            </div>
                            <div class="flex-grow-0 text-left">
                                <div style="color:rgba(255, 255, 255, 0.76)">{{tooltip.sas.converted.unit}} </div>
                                <div style="color:rgba(255, 255, 255, 0.76)">{{tooltip.sata.converted.unit}}</div>
                                <div style="color:rgba(255, 255, 255, 0.76)">{{tooltip.ssd.converted.unit}} </div>
                            </div>
                        </div>
                    </div>
                    <div class="project-widget-chart-item pointer relative" 
                        v-for="prj in projects" :key="prj.id"
                        :class="{'project-widget-chart-item-hover': prj.tooltip}"
                        :style="{background: prj.color, '--box-shadow-color': prj.color, width: calcPercentWidth(total.sas.total, prj.sas.size) }" 
                        @mouseenter="prj.tooltip = true, onHover(prj, $event), hoverOpacity($event, true), tooltip.show = true"
                        @mouseleave="prj.tooltip = false, hoverOpacity($event, false), tooltip.show = false"
                    ></div>

                </div>
                <div class="project-widget-chart-line mb-1 d-flex relative">
                    <div v-if="total.sata.total == 0" class="project-widget-chart-item" style="position:absolute;top:0;bottom:0;left:0;right:0;background:rgba(1, 40, 84, 0.13);z-index:1;"></div>
                    <div 
                    class="project-widget-chart-item pointer relative" 
                    :class="{'project-widget-chart-item-hover': prj.tooltip}"
                    v-for="prj in projects" :key="prj.id" 
                    :style="{background: prj.color, '--box-shadow-color': prj.color, width: calcPercentWidth(total.sata.total, prj.sata.size) }"
                    @mouseenter="prj.tooltip = true, onHover(prj, $event), hoverOpacity($event, true), tooltip.show = true"
                    @mouseleave="prj.tooltip = false, hoverOpacity($event, false), tooltip.show = false"
                    ></div>
                </div>
                <div class="project-widget-chart-line d-flex relative">
                    <div v-if="total.ssd.total == 0" class="project-widget-chart-item" style="position:absolute;top:0;bottom:0;left:0;right:0;background:rgba(1, 40, 84, 0.13);z-index:1;"></div>
                    <div class="project-widget-chart-item pointer relative" 
                    :class="{'project-widget-chart-item-hover': prj.tooltip}"
                    v-for="prj in projects" 
                    :key="prj.id" 
                    :style="{background: prj.color, '--box-shadow-color': prj.color, width: calcPercentWidth(total.ssd.total, prj.ssd.size) }"
                    @mouseenter="prj.tooltip = true, onHover(prj, $event), hoverOpacity($event, true), tooltip.show = true"
                    @mouseleave="prj.tooltip = false, hoverOpacity($event, false), tooltip.show = false"
                    ></div>
                </div>
            </div>
            <div class="flex-grow-0 project-widget-chart-resource-quantity fs-m grey500">
                <div class="d-flex mb-1 pt-1">
                    <div style="width:45px;" class="text-right flex-grow-0 mr-1 grey700 fw-b monospace">{{total.sas.converted.value}}</div>
                    <div class="flex-grow-1">{{total.sas.converted.unit}}</div>
                </div>
                <div class="d-flex mb-1 pt-1">
                    <div style="width:45px;" class="text-right flex-grow-0 mr-1 grey700 fw-b monospace">{{total.sata.converted.value}}</div>
                    <div class="flex-grow-1">{{total.sata.converted.unit}}</div>
                </div>
                <div class="d-flex pt-1">
                    <div style="width:45px;" class="text-right flex-grow-0 mr-1 grey700 fw-b monospace">{{total.ssd.converted.value}}</div>
                    <div class="flex-grow-1">{{total.ssd.converted.unit}}</div>
                </div>
            </div>
        </div>
    </v-flex>
</div>
</div>
</template>

<script>
import colors from '@/consts/chartColorConsts'
import { mapGetters, mapActions } from 'vuex';

const computedRources = [ 'cpu', 'ram' ]
const storResources   = [ 'sas', 'sata', 'ssd' ]
const allResources    = [...computedRources, ...storResources]
const tooltip = { 
            show  : false,  
            left  : 0,
            storage : { size : 0, converted : { value : 0, unit : 'MB'} },
            ...allResources.reduce((r, code)=>{ 
                r[code] = { 
                    size      : 0,
                    converted : { value : 0, unit  : code == 'cpu' ? '' : 'MB' }
                    }
                return r
                }
            ,{})
        }

export default {    
    data(){
        return{

            colors,
            loading       : true,
            storageMode   : false,
            totalProjects : 0,
            total         : null,

            tooltip      ,
            projects      :[],
        }
    },

    created(){

    },

    computed: {
        ...mapGetters([ 
            'dsbrd_prj_loading',
            'dsbrd_prj_items'
        ]),

        items(){
            return this.dsbrd_prj_items;
        }
    },

    watch:{
        dsbrd_prj_items:{
            handler:  function(value){
                if(value != null && value.length > 0){
                    this.pushProjects(value);
                    this.calcTotal();
                    this.loading = false;
                }
            },
            immediate : true,
            deep      : true
        }
    },
    
    methods: {

        hoverOpacity(e, opacity){
            if(opacity)
                e.target.style.opacity = 0.7
            else
                e.target.style.opacity = 1
        },

        onHover(prj, event){
            this.tooltip = Object.assign(this.tooltip, prj)
            this.tooltip.left = event.target.offsetLeft + (event.target.offsetWidth / 2) - 164;
        },

        exportCsv(){
            var toCsv = this.projects.map(p=>{ return { 
                NAME                 : p.name, 
                CPU                  : p.cpu, 
                "RAM (MB)"           : p.ram.size, 
                "STORAGE TOTAL (MB)" : p.storage.size, 
                "SAS (MB)"           : p.sas.size, 
                "SATA (MB)"          : p.sata.size, 
                "SSD (MB)"           : p.ssd.size
            } });

            this.$export.csv(toCsv, 'projects.csv')
        },

        pushProjects(projectArr){
            this.projects = []
            let colorIndex = 0;
            let colorsArr = Object.values(this.colors);

            this.totalProjects = projectArr.filter(f=>f.projectName != null).length;

            var res = projectArr.map(prj=>{
                // считаем значение по стораджам
                let storage = storResources.reduce((r, code)=>{
                    r += isNullOrUndefined(prj.resources.find(f=>f.code == code), { y: _=> 0, n: v=> v.value });
                    return r;
                }, 0);
                // обрабатываем конец массива цветов
                if(colorIndex + 1 == colorsArr.length)
                    colorIndex = 0
                // подготавливаем список ресурсов
                var resources = {};
                allResources.forEach(code=>{ 
                    var prjRes = isNullOrUndefined(prj.resources.find(f=>f.code == code), { y: _=> 0, n: v=> v.value });
                    resources[code] =   { 
                                            size      : prjRes,
                                            converted : convertStorageValue(prjRes),
                                        }                       
                }) 
                // формируем итоговый класс 
                return {
                    isEmptyProject : isNullOrUndefined(prj.projectName),
                    name    : isNullOrUndefined(prj.projectName) ? 'VMs not in project' : prj.projectName,
                    color   : isNullOrUndefined(prj.projectName) ? 'repeating-linear-gradient( -45deg, #606dbc, #606dbc 5px, #465298 5px, #465298 10px )' : colorsArr[colorIndex++].normal,
                    tooltip : false,
                    
                    ...resources,

                    storage: {
                        size      : storage,
                        converted : convertStorageValue(storage)
                    }                
                };
            })
            res.sort((a,b)=>{
                if (a.isEmptyProject) return 1
                if (b.isEmptyProject) return -1
                if (a.projectName > b.projectName) return 1;
                if (a.projectName < b.projectName) return -1;
                return 0;
            })
            this.projects = res;
        },

        calcTotal(){
            var calc = (data, prop)=>{
                var total = data.reduce((r, v)=>{ r += v[prop].size; return r; }, 0);
                return { 
                    total, 
                    converted : convertStorageValue(total) 
                };
            }

            var res = allResources.reduce((r, v)=>{
                r[v] = calc(this.projects, v) 
                return r;
            }, {});

            var storage = this.projects.reduce((r, v)=>{
                r += storResources.reduce((re, code)=>{  
                    re += v[code].size;                  
                    return re;
                }, 0);
                return r;
            }, 0);           
            
            res.storage = {
                total : storage,
                converted : convertStorageValue(storage) 
            }
            this.total = res;
        },

        calcPercentWidth(total, part){
            let percent = total == 0 ? 0 : part * 100  / total;            
            return percent + '%'
        },

        correctStorageValue(value){
            let newValue = value.toString()
            if(newValue.split('').includes('.'))
                return newValue
            else
                return newValue + '.0'
        },
    }
}
</script>
<style lang="stylus" scoped>
.w-project
    height 168px
    cursor default
    &__loading-overlay
        position absolute
        top 0
        bottom 0
        left 0
        right 0
        left 0
        z-index 1
    &__loading-message
        position absolute
        top calc(50% - 12px)
        width 100%
    &__no-data
        height calc(100% - 40px - 12px)
        background url('/img/dasboard/prj-widget-bg.svg') no-repeat center center
    &__export-btn
        margin-bottom -8px
    &__chart-wrapper
        height 122px
    &__chart-title
        position absolute
        top 0
        left 128px

</style>
<style scoped>
    .project-widget-chart-resource div, .project-widget-chart-resource-quantity div{height: 24px;}
    .project-widget-chart-line, .project-widget-chart-item{height: 24px;}
    .project-widget-chart-item{box-shadow: inset 0px 2px 0 0px #fff, inset 0px -2px 0 0px #fff;}
    .project-widget-custom-tooltip{transition:all .5s, opacity .5s ease;border-radius: 2px;border-bottom-right-radius: 0;z-index:1;}
    .project-widget-custom-tooltip-hide{opacity:0;transition:all .5s, transform 0s linear .5s, opacity .5s ease;}
    .project-widget-custom-tooltip::after{
        content: " ";
        position: absolute;
        top: 100%;  /* At the top of the tooltip */
        right: 0;
        width: 0;
        height: 0;
        border-top: 6px solid rgba(0, 0, 0, 0.8);
        border-left: 8px solid transparent;
    }
</style>
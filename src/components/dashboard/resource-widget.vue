<template>
    <div class="w-resource resource-widget-block white pa-3 br-2 relative" :class="[!open ? 'w-resource--closed' : resourceProfiles.length > 2 ? 'w-resource--open-expand' : 'w-resource--open', isHover && this.dsbrd_res_items.length > 0 ? 'resource-widget-block-hover pointer' : '']">
    <div v-if="loading" class="w-resource__loading-overlay tasks-widget-loading white">
        <div class="fs-m fw-b pa-3 widgets-title-opacity"></div>
        <div class="w-resource__loading-message fs-ml text-center">Loading...</div>
    </div>

    <v-layout v-if="!loading" @click="openClick()" class="w-resource__main-content pa-3" @mouseenter="isHover=true" @mouseleave="isHover=false">
    <v-flex class="">
        <div class="fs-ml grey700 fw-b uppercase">{{code}}</div>
        <div class="w-resource__subtitle fs-s grey500">{{subtitle}}</div>
    </v-flex>
    <v-flex class="w-resource__resources text-right">
        <div class="d-flex align-end">
            <div class="fs-xl grey700 flex-grow-1 text-right mr-1 monospace">{{resourceValue.value}}</div>
            <div class="w-resource__resources-unit fs-m grey500 flex-grow-0 text-left pb-1">{{resourceValue.unit}}</div>
        </div>
        <div v-if="code != 'templates'" class="fs-s" :class="[resourcePercent == 0 ? 'green600' : resourcePercent == 100 ? 'red500' : 'percent-text' ]">{{resourcePercent}}% in powered off</div>
    </v-flex>
    </v-layout>
    <v-divider v-if="open" class="my-1" />
    <v-layout v-if="open" class="w-resource__chart">
        <line-chart :ref="`chart-${code}`"  v-if="!loading" :chartdata="chartData" :height="60" :width="256" :options="chartOptions"></line-chart>
    </v-layout>
    <v-layout v-if="open" class="d-flex justify-space-around">
        <div class="d-flex fs-s align-center pointer" @click="changeDataChart('max')">
            <div class="w-resource__chart-current"></div>
            <div class="ml-2" :class="{'w-resource__chart-diabled-type' : !dataToShow.current}">Count</div>
        </div>
        <div class="d-flex fs-s align-center pointer" @click="changeDataChart('current')">
            <div class="w-resource__chart-max"></div>
            <div class="ml-2" :class="{'w-resource__chart-diabled-type' : !dataToShow.max}">Max</div>
        </div>
    </v-layout>
    <v-layout v-if="open" class="fs-s grey500 mt-1">
    Resource Profile
    </v-layout>
    <v-divider v-if="open" class="my-1" />
    <div v-if="open" :style="'height:'+ rpListHeight + 'px;'" class="resource-widget-scrolling-block" v-bar>
        <div>
            <v-layout v-for="(rp, index) in resourceProfiles" :key="index" class="py-0-5 border-bottom grey100-border">
                <v-flex xs9 class="align-self-center">
                    <div class="fs-m blue800">{{rp.resourceProfile}}</div>
                    <div class="fs-s grey600">{{rp.serviceProvider}}/{{rp.dataCenter}}</div>
                </v-flex>
                <v-flex xs3 class="align-self-center grey700 fs-m text-right pr-1">
                    {{rp.value}} {{rp.unit}}
                </v-flex>
            </v-layout>
        </div>
    </div>

    </div>
</template>

<script>
import LineChart from '@/components/charts/lineChart.js'
import { mapGetters, mapActions } from 'vuex';

export default {
    components: {
      LineChart
    },

    props:[        
        'code'
    ],


    data(){
        return{
            // значение по умолчанию
            resourceValue: {
                value: 0,
                unit: ''
            },

            dataToShow:{
                current: true,
                max:     true
            },

            dataForChart: {},


            resourceActive: 0,
            resourcePercent: 0,

            resourceProfiles: [],

            open: false,
            isHover: false,

            chartData:{ datasets:[] },


            chartOptions: {
                responsive: true, 
                maintainAspectRatio:true, 
                legend:{
                    display:false
                },
                scales: {
                    yAxes: [{
                        display: false
                    }],
                    xAxes: [{
                        type: 'time',
                        time: {
                            displayFormats: {
                                minute: 'D',
                                hour: 'D',
                                day: 'D',
                                month: 'D'
                            }
                        },
                        fontColor: "#fff",
                        fontSize: 50,
                        distribution: 'series',
                        offset: true,
                        ticks: {
                            maxRotation: 0,
                            fontSize: 10,
                            // Include a dollar sign in the ticks
                            callback: function(value, index, values) {
                                return value;
                            }
                        }
                    }],
                },
                tooltips: {
                    mode: 'index',
                    position: 'nearest',
                    enabled: false,
                    displayColors: false,
                    intersect: false,
                    custom: function(tooltipModel) {
                        // Tooltip Element
                        var tooltipEl = document.getElementById('chartjs-tooltip-resource');

                        // Create element on first render
                        if (!tooltipEl) {
                            tooltipEl = document.createElement('div');
                            tooltipEl.id = 'chartjs-tooltip-resource';
                            tooltipEl.classList.add('resource-widget-tooltip')
                            tooltipEl.innerHTML = '<table></table>';
                            document.body.appendChild(tooltipEl);
                        }

                        // Hide if no tooltip
                        if (tooltipModel.opacity === 0) {
                            tooltipEl.style.opacity = 0;
                            return;
                        }

                        // Set caret Position
                        tooltipEl.classList.remove('above', 'below', 'no-transform');
                        if (tooltipModel.yAlign) {
                            tooltipEl.classList.add(tooltipModel.yAlign);
                        } else {
                            tooltipEl.classList.add('no-transform');
                        }

                        function getBody(bodyItem) {
                            return bodyItem.lines;
                        }

                        // Set Text
                        if (tooltipModel.body) {
                            var titleLines = tooltipModel.title || [];
                            var bodyLines = tooltipModel.body.map(getBody);

                            var innerHtml = '<thead>';

                            titleLines.forEach(function(title) {
                                let dd   = new Date(title).getDate();
                                let mm   = new Date(title).getMonth() + 1;
                                if (dd<10)
                                    dd = '0' + dd;
                                if (mm<10)
                                    mm = '0' + mm;
                                let yyyy = new Date(title).getFullYear();
                                innerHtml += '<tr><th style="color:rgba(255, 255, 255, 0.92)">' + dd + '.' + mm + '.' + yyyy + '</th></tr>';
                            });
                            innerHtml += '</thead><tbody>';
                            let datasetsCopy = this._data.datasets
                            bodyLines.forEach(function(body, i) {
                                var colors = tooltipModel.labelColors[i];
                                var style = 'background:' + colors.borderColor;
                                style += '; border-color:' + colors.borderColor;
                                style += '; border-width: 2px';
                                var span = '<div style="' + style + ';height: 14px;width: 14px;display:inline-block; margin-right:5px;margin-bottom:-2px;"></div>';

                                let unit = body[0].substr(0, body[0].indexOf(':'));
                                var value = tooltipModel.dataPoints[i].yLabel;
                                switch(unit){
                                    case 'GB': value = Math.round(value / 1024); break;
                                    case 'TB': value = Math.round(value / 1024 / 1024); break;
                                    default: break;
                                }
                                innerHtml += `<tr><td style="color:rgba(255, 255, 255, 0.78)">${datasetsCopy[i].dataType}: <b style="color:rgba(255, 255, 255, 0.92)">${value} ${unit}</b></td></tr>`;
                            });
                            innerHtml += '</tbody>';

                            var tableRoot = tooltipEl.querySelector('table');
                            tableRoot.innerHTML = innerHtml;
                        }

                        // `this` will be the overall tooltip
                        var position = this._chart.canvas.getBoundingClientRect();

                        // Display, position, and set styles for font
                        tooltipEl.style.opacity = 1;
                        tooltipEl.style.padding = '10px';
                        tooltipEl.style.borderRadius = '2px';
                        tooltipEl.style.borderBottomLeftRadius = 0;
                        tooltipEl.style.transition = 'all 0.3s ease 0s, opacity 0.5s ease 0s';
                        tooltipEl.style.position = 'absolute';
                        tooltipEl.style.background = 'rgba(0,0,0,0.8)';
                        tooltipEl.style.left = position.left + globalThis.pageXOffset + tooltipModel.caretX + 'px';
                        tooltipEl.style.top = position.top + globalThis.pageYOffset + tooltipModel.caretY - tooltipModel.height - 24 + 'px';
                        tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
                        tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
                        tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
                        tooltipEl.style.pointerEvents = 'none';
                    }
                }
            }
        }
    },

    
    methods: {
        prepareData(){  
            if(this.dsbrd_res_items.length > 0){
                let nonConvertedCodes = { cpu: '', vm: '', templates: ''}

                var convertData = function(code, value){
                    return Object.keys(nonConvertedCodes).some(s=>s == code) 
                            ? { unit : nonConvertedCodes[code], value } : convertStorageValue(value)
                    }

                var filteredData = this.dsbrd_res_items[this.dsbrd_res_items.length - 1].resourceProfiles.filter(f=>f.code == this.code)
                
                // формируем данные для таблицы
                this.resourceProfiles = filteredData.map(m=>{
                        let rpItem =  this.lctn_itemsAll.find(v=>v.id == m.resourceProfileId);
                        let dataConverted = convertData(m.code, m.count)
                        return  {
                                    rpId            : m.resourceProfileId,
                                    unit            : dataConverted.unit,
                                    value           : dataConverted.value,
                                    resourceProfile : rpItem.resourceProfile.name,
                                    serviceProvider : rpItem.serviceProvider.name,
                                    dataCenter      : rpItem.datacenter.name                               
                                }
                    })

                // формируем данные здя Title (общее количество, ед.измерения, % эффективности)
                var preRes = filteredData.reduce((r,v)=>{
                        r.count += v.count;
                        r.active += v.active;
                        return r;
                    }, { count: 0, active: 0})
                this.resourceValue = convertData(this.code, preRes.count);
                this.resourcePercent = 100 - Math.round(preRes.active / preRes.count * 100);

                // формируем данные для таблицы
                let dataForChartCurrent = this.dsbrd_res_items.reduce((r,v)=>{
                        r.push({
                            t: new Date(v.date).getTime(),
                            y: v.resourceProfiles.filter(f=>f.code == this.code).reduce((r1,v1)=>{ r1 += v1.count; return r1 }, 0)
                        })
                        return r;
                    }, [])

                let dataForChartMax = this.dsbrd_res_items.reduce((r,v)=>{
                        r.push({
                            t: new Date(v.date).getTime(),
                            y: v.resourceProfiles.filter(f=>f.code == this.code).reduce((r1,v1)=>{ r1 += v1.maxPerDay; return r1 }, 0)
                        })
                        return r;
                    }, [])

                this.dataForChart = {
                    current: {
                        label: this.resourceValue.unit,
                        backgroundColor: 'rgb(37, 125, 193)',
                        borderColor: 'rgb(37, 125, 193)',
                        borderWidth: 1,
                        pointRadius: 1,
                        pointHoverRadius: 2,
                        dataType: 'Count',
                        data: dataForChartCurrent,
                        fill: false,
                        lineTension: 0.1
                    },
                    max: {
                        label: this.resourceValue.unit,
                        backgroundColor: 'rgb(232, 76, 61)',
                        borderColor: 'rgb(232, 76, 61)',
                        borderWidth: 1,
                        pointRadius: 1,
                        pointHoverRadius: 2,
                        dataType: 'Max',
                        data: dataForChartMax,
                        fill: false,
                        lineTension: 0.1
                    }
                }

                this.chartData.datasets = [this.dataForChart.current, this.dataForChart.max]
            }
        },

        openClick(){
            if(this.dsbrd_res_items.length > 0)
                this.open = !this.open
        },

        changeDataChart(type){
            if(type=='all'){
                this.chartData.datasets = [this.dataForChart.current, this.dataForChart.max]
                this.dataToShow = { current: true, max: true }
            }
            if(type=='max'){
                if(!this.dataToShow.current){
                    this.chartData.datasets = [this.dataForChart.current, this.dataForChart.max]
                    this.dataToShow = { current: true, max: true }
                }else{
                    this.chartData.datasets = [this.dataForChart.max]
                    this.dataToShow = { current: false, max: true }
                }
            }
            if(type=='current'){
                if(!this.dataToShow.max){
                    this.chartData.datasets = [this.dataForChart.current, this.dataForChart.max]
                    this.dataToShow = { current: true, max: true }
                }else{
                    this.chartData.datasets = [this.dataForChart.current]
                    this.dataToShow = { current: true, max: false }
                }
            }

            var chart = this.$refs[`chart-${this.code}`];
            chart.refreshChart();

        },

    },


    watch:{
        loading(value){
            if(!value){
                this.prepareData();
            }
        },
    },

    computed: {
        ...mapGetters(['lctn_itemsAll', 'lctn_loading', 'dsbrd_res_loading', 'dsbrd_res_items']),

        subtitle(){
            if(this.code == 'vm' || this.code == 'templates')
                return 'Total count'
            if(this.code == 'cpu' || this.code == 'ram')
                return 'Allocated to VM and Templates'
            if(this.code == 'sas' || this.code == 'sata' || this.code == 'ssd')
                return 'Allocated to VM, Templates, Medias'
        },

        loading(){
            return this.dsbrd_res_loading || this.lctn_loading
        },

        rpListHeight(){
            return this.resourceProfiles.length > 2 ? '168' : '78';
        },
    },

    mounted(){
        if(!this.loading)
            this.prepareData();
    }
}
</script>
<style lang="stylus" scoped>
.w-resource
    width 280px 
    transition height .5s
    &--closed
        height 74px
    &--open-expand
        height 356px
    &--open
        height 262px
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
    &__main-content
        margin -12px
        height 74px
    &__subtitle
        line-height 14px !important
    &__resources
        min-width 115px
        &-unit
            width 20px
    &__chart
        height 60px
    &__chart-current, &__chart-max
        width 16px
        height 4px
    &__chart-current
        background rgb(37, 125, 193)
    &__chart-max
        background rgb(232, 76, 61)
    &__chart-diabled-type
        text-decoration line-through

.percent-text
    color rgba(238, 143, 0, 0.85)
</style>
<style>
.resource-widget-scrolling-block .vb-dragger{right:-2px !important;}
.resource-widget-tooltip{z-index: 3;}
.resource-widget-tooltip::after{
        content: " ";
        position: absolute;
        top: 100%;  /* At the top of the tooltip */
        left: 0;
        width: 0;
        height: 0;
        border-top: 6px solid rgba(0, 0, 0, 0.8);
        border-right: 8px solid transparent;
    }
</style>
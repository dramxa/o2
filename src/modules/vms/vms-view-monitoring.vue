<template>
    <div v-if="itemReady">
        <v-toolbar flat  max-height="112px" class="pl-2">
            <v-toolbar-title style="line-height: 20px; font-size:20px" class="grey500 d-flex align-center nonselect">
                <i :class="glb_currentSection.icon" class="mr-3 grey500-i" style="font-size:22px; vertical-align: bottom;"></i>
                <span>Monitoring VM <span class="blue700 pl-2 fw-b">{{item.name}}</span></span>
            </v-toolbar-title>

            <div class="flex-grow-1"></div>

            <v-btn class="br-4 mx-2" height="36" width="36" icon tile @click="closeVmMonitoring()">
                <i class="icon-Close icon-24 grey500-i"></i>
            </v-btn>
        </v-toolbar>

        <v-toolbar flat  class="toolbar-ext border-bottom pl-4"> 
                <v-layout row wrap class="d-flex fs-ml relative">
                    <div class="px-2 mx-2 pointer blue700-border" :class="[active == 'Performance' ? 'monitoring-active-tab-class blue700 fw-b' : 'grey700']" @click="active = 'Performance'">Performance</div>
                    <div class="px-2 mx-2 pointer blue700-border" :class="[active == 'Tasks' ? 'monitoring-active-tab-class blue700 fw-b' : 'grey700']" @click="active = 'Tasks'">Tasks</div>
                    <div class="grey200-b vm-monitoring-toolbar-border"></div>
                </v-layout>
        </v-toolbar>
        <div v-if="active == 'Performance'" class="d-flex px-2 pb-2 justify-space-between" style="position: -webkit-sticky; position: sticky;top:0; z-index:1;">
            <div>
                <!-- <div class="fs-m fw-b grey800 mb-1">CPU (Usage %)</div>
                <div class="fs-s d-flex align-center">
                    <div class="text-center">
                        <div class="grey600">20.05.2020</div>
                        <div class="grey600">23:59</div>
                    </div>
                    <div class="px-2 grey300">&mdash;</div>
                    <div class="text-center">
                        <div class="grey600">20.07.2020</div>
                        <div class="grey600">15:07</div>
                    </div>
                </div> -->
            </div>
            <div class="d-flex align-center fs-m">
                <div class="px-1-5 fw-b pointer" @click="activePeriod = '1h'    " :class="activePeriod == '1h'     ? 'grey900' : 'grey300'">1h</div>
                <div class="px-1-5 fw-b pointer" @click="activePeriod = '24h'   " :class="activePeriod == '24h'    ? 'grey900' : 'grey300'">24h</div>
                <div class="px-1-5 fw-b pointer" @click="activePeriod = '7d'    " :class="activePeriod == '7d'     ? 'grey900' : 'grey300'">7d</div>
                <div class="px-1-5 fw-b pointer" @click="activePeriod = '1m'    " :class="activePeriod == '1m'     ? 'grey900' : 'grey300'">1m</div>
                <div class="px-1-5 fw-b pointer" @click="activePeriod = 'Custom'" :class="activePeriod == 'Custom' ? 'grey900' : 'grey300'">Custom</div>
                <div>
                    <v-btn text class="normal-text blue500-b white--text px-2 ml-2">
                        <i class="mdi mdi-progress-download pr-2 icon-20"></i> Download data
                    </v-btn>
                </div>
            </div>
        </div>
        <v-card flat data-simplebar style="height: calc(100vh - 112px - 44px);">
            <div class="container-fluid pt-0 px-8" v-show="active == 'Performance'">
                <v-layout class="row wrap">
                    <div :class="$vuetify.breakpoint.mdAndDown ? 'col-12' : 'col-6'">
                        <div class="fs-m fw-b grey800 px-2 mb-4 text-center">
                            <span>CPU</span>  
                            <v-menu offset-y left width="218px">
                                <template v-slot:activator="{ on }">
                                    <v-btn text v-on="on" class="normal-text fs-m fw-b grey800 mb-0-5 mx-1 px-0 border-none br-4" style="min-width:unset;" height="24px">(<span class="grey800-border border-bottom-dashed">{{cpuUnit}}</span>)</v-btn>
                                </template>
                                <v-list width="150px" class="control-combobox py-2 border blue050-border br-4 gd-tb-price-menu">
                                    <v-list-item class="fs-m dropdown-menu-item" @click="cpuUnit = 'Usage %'    "><span :class="cpuUnit=='Usage %'     ? 'blue800 fw-b':'grey700'">Usage %</span></v-list-item>
                                    <v-list-item class="fs-m dropdown-menu-item" @click="cpuUnit = 'Usage Cores'"><span :class="cpuUnit=='Usage Cores' ? 'blue800 fw-b':'grey700'">Usage Cores</span></v-list-item>
                                </v-list>
                            </v-menu>
                        </div>
                        <line-chart-custom v-show="cpuUnit=='Usage %'" :chart-data="chartData1" :width="$vuetify.breakpoint.mdAndDown ? 900 : 900" :height="$vuetify.breakpoint.mdAndDown ? 300 : 300" :options="chartOptions1" />
                        <line-chart-custom v-show="cpuUnit=='Usage Cores'" :chart-data="chartData2" :width="$vuetify.breakpoint.mdAndDown ? 900 : 900" :height="$vuetify.breakpoint.mdAndDown ? 300 : 300" :options="chartOptions2" />
                    </div>
                    <div :class="$vuetify.breakpoint.mdAndDown ? 'col-12' : 'col-6'">
                        <div class="fs-m fw-b grey800 px-2 mb-4 text-center">
                            <span>RAM</span>  
                            <v-menu offset-y left width="218px">
                                <template v-slot:activator="{ on }">
                                    <v-btn text v-on="on" class="normal-text fs-m fw-b grey800 mb-0-5 mx-1 px-0 border-none br-4" style="min-width:unset;" height="24px">(<span class="grey800-border border-bottom-dashed">{{ramUnit}}</span>)</v-btn>
                                </template>
                                <v-list width="150px" class="control-combobox py-2 border blue050-border br-4 gd-tb-price-menu">
                                    <v-list-item class="fs-m dropdown-menu-item" @click="ramUnit = 'Usage %' "><span :class="ramUnit=='Usage %'     ? 'blue800 fw-b':'grey700'">Usage %</span></v-list-item>
                                    <v-list-item class="fs-m dropdown-menu-item" @click="ramUnit = 'Usage GB'"><span :class="ramUnit=='Usage Cores' ? 'blue800 fw-b':'grey700'">Usage GB</span></v-list-item>
                                </v-list>
                            </v-menu>
                        </div>
                        <line-chart-custom :chart-data="ramUnit=='Usage %' ? chartData1 : chartData2" :width="$vuetify.breakpoint.mdAndDown ? 900 : 900" :height="$vuetify.breakpoint.mdAndDown ? 300 : 300" :options="chartOptions1" />
                    </div>
                </v-layout>
                <v-layout class="row wrap" :class="$vuetify.breakpoint.mdAndDown ? '' : 'mt-4'">
                    <div :class="$vuetify.breakpoint.mdAndDown ? 'col-12' : 'col-6'" >
                        <div class="fs-m fw-b grey800 px-2 mb-4 text-center">
                            <span>Disk</span>  
                            <v-menu offset-y left width="218px">
                                <template v-slot:activator="{ on }">
                                    <v-btn text v-on="on" class="normal-text fs-m fw-b grey800 mb-0-5 mx-1 px-0 border-none br-4" style="min-width:unset;" height="24px">(<span class="grey800-border border-bottom-dashed">{{diskUnit}}</span>)</v-btn>
                                </template>
                                <v-list width="150px" class="control-combobox py-2 border blue050-border br-4 gd-tb-price-menu">
                                    <v-list-item class="fs-m dropdown-menu-item" @click="diskUnit = 'Usage KBps'"><span :class="diskUnit=='Usage MBps'     ? 'blue800 fw-b':'grey700'">Usage KBps</span></v-list-item>
                                    <v-list-item class="fs-m dropdown-menu-item" @click="diskUnit = 'Usage MBps'"><span :class="diskUnit=='Usage MBps' ? 'blue800 fw-b':'grey700'">Usage MBps</span></v-list-item>
                                </v-list>
                            </v-menu>
                        </div>
                        <line-chart-custom :chart-data="chartData2" :width="$vuetify.breakpoint.mdAndDown ? 900 : 900" :height="$vuetify.breakpoint.mdAndDown ? 300 : 300" :options="chartOptions2" />
                    </div>
                    <div :class="$vuetify.breakpoint.mdAndDown ? 'col-12' : 'col-6'" >
                        <div class="fs-m fw-b grey800 px-2 mb-4 text-center">
                            <span>Network</span>  
                            <v-menu offset-y left width="218px">
                                <template v-slot:activator="{ on }">
                                    <v-btn text v-on="on" class="normal-text fs-m fw-b grey800 mb-0-5 mx-1 px-0 border-none br-4" style="min-width:unset;" height="24px">(<span class="grey800-border border-bottom-dashed">{{netUnit}}</span>)</v-btn>
                                </template>
                                <v-list width="150px" class="control-combobox py-2 border blue050-border br-4 gd-tb-price-menu">
                                    <v-list-item class="fs-m dropdown-menu-item" @click="netUnit = 'Usage KBps'"><span :class="netUnit=='Usage MBps' ? 'blue800 fw-b':'grey700'">Usage KBps</span></v-list-item>
                                    <v-list-item class="fs-m dropdown-menu-item" @click="netUnit = 'Usage MBps'"><span :class="netUnit=='Usage MBps' ? 'blue800 fw-b':'grey700'">Usage MBps</span></v-list-item>
                                </v-list>
                            </v-menu>
                        </div>
                        <line-chart-custom :chart-data="chartData2" :width="$vuetify.breakpoint.mdAndDown ? 900 : 900" :height="$vuetify.breakpoint.mdAndDown ? 300 : 300" :options="chartOptions2" />
                    </div>
                </v-layout>
            </div>
        </v-card>
    </div>

</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import LineChartCustom from '@/components/charts/lineChartCustom';

export default {

    components: {
      LineChartCustom
    },

     data(){
        return {
            active: 'Performance',
            activePeriod: '1h',
            cpuUnit: 'Usage %',
            ramUnit: 'Usage %',
            diskUnit: 'Usage KBps',
            netUnit: 'Usage KBps',

            chartData1:{
                // labels:['4','8','12','16','20','24','28'],
                datasets:[{
                    label: false,
                    backgroundColor: 'rgba(112, 183, 232, 0.1)',
                    borderColor: 'rgb(112, 183, 232)',
                    borderWidth: 3,
                    pointRadius: 0,
                    pointHoverRadius: 2,
                    fill: true,
                    data: [
                        {t: 1593025200000, y: 44},
                        {t: 1593111600000, y: 43},
                        {t: 1593198000000, y: 87},
                        {t: 1593284400000, y: 25},
                        {t: 1593370800000, y: 72},
                        {t: 1593457200000, y: 41},
                        {t: 1593543600000, y: 77},
                        {t: 1593630000000, y: 7},
                        {t: 1593716400000, y: 86},
                        {t: 1593802800000, y: 20},
                        {t: 1593889200000, y: 74},
                        {t: 1593975600000, y: 28},
                        {t: 1594062000000, y: 26},
                        {t: 1594148400000, y: 65},
                        {t: 1594234800000, y: 37},
                        {t: 1594321200000, y: 52},
                        {t: 1594407600000, y: 88},
                        {t: 1594494000000, y: 6},
                        {t: 1594580400000, y: 13},
                        {t: 1594666800000, y: 81},
                        {t: 1594753200000, y: 72},
                        {t: 1594839600000, y: 94},
                        {t: 1594926000000, y: 5},
                    ],
                    lineTension: 0.3
                }],
            },
            chartData2:{
                // labels:['4','8','12','16','20','24','28'],
                datasets:[{
                    label: false,
                    backgroundColor: 'rgba(112, 183, 232, 0.1)',
                    borderColor: 'rgb(112, 183, 232)',
                    borderWidth: 3,
                    pointRadius: 0,
                    pointHoverRadius: 2,
                    fill: true,
                    data: [
                        {t: 1593025200000, y: 29},
                        {t: 1593111600000, y: 28},
                        {t: 1593198000000, y: 28},
                        {t: 1593284400000, y: 30},
                        {t: 1593370800000, y: 33},
                        {t: 1593457200000, y: 36},
                        {t: 1593543600000, y: 33},
                        {t: 1593630000000, y: 35},
                        {t: 1593716400000, y: 35},
                        {t: 1593802800000, y: 38},
                        {t: 1593889200000, y: 36},
                        {t: 1593975600000, y: 38},
                        {t: 1594062000000, y: 36},
                        {t: 1594148400000, y: 38},
                        {t: 1594234800000, y: 36},
                        {t: 1594321200000, y: 36},
                        {t: 1594407600000, y: 36},
                        {t: 1594494000000, y: 39},
                        {t: 1594580400000, y: 41},
                        {t: 1594666800000, y: 40},
                        {t: 1594753200000, y: 41},
                        {t: 1594839600000, y: 41},
                        {t: 1594926000000, y: 42},
                    ],
                    lineTension: 0.3
                }],
            },
            chartOptions1: {
                responsive: true,
                maintainAspectRatio:true, 
                legend:{
                    display:false
                },
                scales: {
                    yAxes: [{
                        type: 'linear',
                        ticks:{
                            fontColor: '#546E7A',
                            beginAtZero: true,
                            stepSize: 25,
                            suggestedMin: 0,
                            suggestedMax: 100,
                        },
                    }],
                    xAxes: [{
                        type: 'time',
                        gridLines: {
                            display: false,
                        },
                        time: {
                            displayFormats: {
                                day: 'YYYY MMM DD',
                                month: 'YYYY MMM DD'
                            }
                        },
                        fontColor: "#fff",
                        fontSize: 50,
                        distribution: 'series',
                        offset: true,
                        ticks: {
                            maxRotation: 0,
                            fontColor: '#546E7A',
                            major:{
                                enabled:true,
                                fontStyle: 'bold',
                                fontColor: 'red',
                            },
                            // Include a dollar sign in the ticks
                            callback: function(value, index, values) {
                                let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                                let months = ["Jan", "Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
                                let day  = new Date(value).getDay();
                                let month = new Date(value).getMonth();
                                let dd   = new Date(value).getDate();
                                if (dd<10)
                                    dd = '0' + dd;                                
                                return [dd, dd == 1 ? months[month]: ''];
                            }
                        }
                    }],
                },
                tooltips: {
                    mode: 'label',
                    position: 'nearest',
                    enabled: false,
                    displayColors: false,
                    intersect: false,
                    custom: function(tooltipModel) {
                        // Tooltip Element
                        var tooltipEl = document.getElementById('chartjs-tooltip');

                        // Create element on first render
                        if (!tooltipEl) {
                            tooltipEl = document.createElement('div');
                            tooltipEl.id = 'chartjs-tooltip';
                            tooltipEl.innerHTML = '<table style="position:relative;"></table>';
                            document.body.appendChild(tooltipEl);
                        }
                        tooltipEl.classList.add('vms-monitoring-tooltip');

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
                                innerHtml += '<tr><th style="color:#fff;">' + dd + '.' + mm + '.' + yyyy + '</th></tr>';
                            });
                            innerHtml += '</thead><tbody>';
                            bodyLines.forEach(function(body, i) {
                                var colors = tooltipModel.labelColors[i];
                                var style = 'background:' + colors.borderColor;
                                style += '; border-color:' + colors.borderColor;
                                style += '; border-width: 2px';
                                var span = '<div style="' + style + ';height: 14px;width: 14px;display:inline-block; margin-right:5px;margin-bottom:-2px;"></div>';
                                innerHtml += '<tr><td style="color:#fff; text-align: right;">' + body + '%</td></tr>';
                            });
                            innerHtml += '</tbody>';

                            var tableRoot = tooltipEl.querySelector('table');
                            tableRoot.innerHTML = innerHtml;
                        }

                        // `this` will be the overall tooltip
                        var position = this._chart.canvas.getBoundingClientRect();

                        // Display, position, and set styles for font
                        tooltipEl.style.opacity = 1;
                        tooltipEl.style.position = 'absolute';
                        tooltipEl.style.background = 'rgba(69, 90, 100,0.8)';
                        tooltipEl.style.left = position.left + globalThis.pageXOffset + tooltipModel.caretX - 38 + 'px';
                        tooltipEl.style.top = position.top + globalThis.pageYOffset + tooltipModel.caretY - 62 + 'px';
                        tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
                        tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
                        tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
                        tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
                        tooltipEl.style.pointerEvents = 'none';
                    }
                }
            },
            chartOptions2: {
                responsive: true,
                maintainAspectRatio:true, 
                legend:{
                    display:false
                },
                scales: {
                    yAxes: [{
                        type: 'linear',
                        ticks:{
                            fontColor: '#546E7A',
                        }
                    }],
                    xAxes: [{
                        type: 'time',
                        gridLines: {
                            display: false
                        },
                        time: {
                            displayFormats: {
                                day: 'YYYY MMM DD',
                                month: 'YYYY MMM DD'
                            }
                        },
                        fontColor: "#fff",
                        fontSize: 50,
                        distribution: 'series',
                        offset: true,
                        ticks: {
                            maxRotation: 0,
                            fontColor: '#546E7A',
                            major:{
                                enabled:true,
                                fontStyle: 'bold',
                            },
                            callback: function(value, index, values) {
                                let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                                let months = ["Jan", "Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

                                let day  = new Date(value).getDay();
                                let month = new Date(value).getMonth();
                                let dd   = new Date(value).getDate();
                                if (dd<10)
                                    dd = '0' + dd;                                
                                return [dd, dd == 1 ? months[month]: ''];
                            }
                        },
                        callbacks:{
                            afterBuildTicks: function(axis, ticks){
                                console.log(ticks);
                            }
                        }
                    }],
                },
                tooltips: {
                    mode: 'label',
                    position: 'nearest',
                    enabled: false,
                    displayColors: false,
                    intersect: false,
                    custom: function(tooltipModel) {
                        // Tooltip Element
                        var tooltipEl = document.getElementById('chartjs-tooltip');

                        // Create element on first render
                        if (!tooltipEl) {
                            tooltipEl = document.createElement('div');
                            tooltipEl.id = 'chartjs-tooltip';
                            tooltipEl.innerHTML = '<table style="position:relative;"></table>';
                            document.body.appendChild(tooltipEl);
                        }
                        tooltipEl.classList.add('vms-monitoring-tooltip');
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
                                innerHtml += '<tr><th style="color:#fff;">' + dd + '.' + mm + '.' + yyyy + '</th></tr>';
                            });
                            innerHtml += '</thead><tbody>';
                            bodyLines.forEach(function(body, i) {
                                var colors = tooltipModel.labelColors[i];
                                var style = 'background:' + colors.borderColor;
                                style += '; border-color:' + colors.borderColor;
                                style += '; border-width: 2px';
                                var span = '<div style="' + style + ';height: 14px;width: 14px;display:inline-block; margin-right:5px;margin-bottom:-2px;"></div>';
                                innerHtml += '<tr><td style="color:#fff;text-align:right;">' + body + ' KBps</td></tr>';
                            });
                            innerHtml += '</tbody>';

                            var tableRoot = tooltipEl.querySelector('table');
                            tableRoot.innerHTML = innerHtml;
                        }

                        // `this` will be the overall tooltip
                        var position = this._chart.canvas.getBoundingClientRect();

                        // Display, position, and set styles for font
                        tooltipEl.style.opacity = 1;
                        tooltipEl.style.position = 'absolute';
                        tooltipEl.style.background = 'rgba(0,0,0,0.8)';
                        tooltipEl.style.left = position.left + globalThis.pageXOffset + tooltipModel.caretX - 38 + 'px';
                        tooltipEl.style.top = position.top + globalThis.pageYOffset + tooltipModel.caretY - 62 + 'px';
                        tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
                        tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
                        tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
                        tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
                        tooltipEl.style.pointerEvents = 'none';
                    }
                }
            },
        }
    },

    computed:{        
        ...mapGetters(['vm_monitoringVm', 'glb_currentSection']),

        item(){
            return this.vm_monitoringVm;
        },

        itemReady(){
            return this.item != null;
        }
    },

    methods:{
        ...mapActions(['vm_setMonitoringState']),

        closeVmMonitoring(){
            this.vm_setMonitoringState();
            this.$router.push({ path: `/vms` });
        }
    },
    
    created(){
        this.vm_setMonitoringState(this.$route.params.id);
    }
    
}
</script>
<style scoped>
.monitoring-active-tab-class{border-bottom:3px solid;}
.vm-monitoring-toolbar-border{position:absolute;left:0;right:0;bottom:1px;height:1px;z-index:-1;}
</style>
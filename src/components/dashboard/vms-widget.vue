<template>
<div class="vms-widget-block white pa-3 br-2 relative" >
    <div v-if="loading" class="vms-widget-loading white" style="position:absolute;top:0;bottom:0;left:0;right:0;left:0;z-index:1;">
        <div class="fs-m fw-b pa-3 widgets-title-opacity">VMs</div>
        <div class="fs-ml text-center" style="position: absolute;top:calc(50% - 12px);width: 100%;">Loading...</div>
    </div>
    <div v-if="!loading">
        <!-- <div style="width:60%;" class="mr-1">
            <div class="fs-m mb-1 fw-b">VMs</div>
            <div class="vms-widget-chart-block relative">
                <div style="position:absolute;left:0;top:3px;width:7px;height:1px;" class="grey500-b"></div>
                <bar-chart v-if="!loading" :chart-data="chartData" :height="125" :width="125" :options="chartOptions"></bar-chart>
            </div>
        </div>
        <div class="align-self-center" v-if="!loading">
            <div class="text-center">
                <div class="fs-s grey700">Total count</div>
                <div class="fs-m grey900">{{vms.totalCount}}</div>
            </div>
            <div class="text-center">
                <div class="fs-s grey700">In project</div>
                <div class="fs-m" style="color:#FF6384;">{{vms.inProjects}}</div>
            </div>
            <div class="text-center">
                <div class="fs-s grey700">Has backup</div>
                <div class="fs-m" style="color:#FF9F40;">118</div>
            </div>
            <div class="text-center">
                <div class="fs-s grey700">Has snapshots</div>
                <div class="fs-m" style="color:#36A2EB;">{{vms.hasSnapshots}}</div>
            </div>
        </div> -->
        <div class="fs-m mb-4 fw-b layout">
            <v-flex>
                VMs
            </v-flex>
            <v-flex style="max-width:36px;" class="text-right">
                <v-menu offset-y left width="170px">
                    <template v-slot:activator="{ on, value }">
                        <v-btn v-on="on" :class="{'grey100-b': value}" icon tile text width="24" height="24" class="br-4" style="margin-top:-6px;margin-right:-3px;" >
                            <i class="grey500-i icon-Donner icon-16"></i>
                        </v-btn>
                    </template>
                    <v-list width="170px" class="control-combobox py-2 border blue050-border br-4">
                        <v-list-item height="32px" class="fs-m" @click="exportCsv()">Export list (CSV)</v-list-item>
                    </v-list>
                </v-menu>
            </v-flex>
        </div>
        <div class="d-flex grey700">
            <div class="flex-grow-1">
                <div class="fs-m mb-3">In Projects</div>
                <div class="fs-m mb-3">Has snapshots</div>
                <div class="fs-m mb-3">Total snapshots</div>
                <div class="fs-ml fw-b">Total</div>
            </div>
            <div class="flex-grow-0 fw-b pr-2 monospace text-right">
                <div class="fs-m mb-3">{{vms.inProjects}}</div>
                <div class="fs-m mb-3">{{vms.hasSnapshots}}</div>
                <div class="fs-m mb-3">{{vms.totalSnapshots}}</div>
                <div class="fs-ml">{{vms.total}}</div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    data(){
        return{
            loading: true,
            vms: null,
            chartData:{},
            chartOptions:{
                legend:{
                    display:false
                },
                scales: {
                    yAxes: [{
                        display:false,
                        ticks:{
                            
                        }
                    }],
                    xAxes: [{
                        display:false
                    }],
                },
                tooltips:{
                    enabled: false,
                    custom: function(tooltipModel) {
                        // Tooltip Element
                        var tooltipEl = document.getElementById('chartjs-tooltip');

                        // Create element on first render
                        if (!tooltipEl) {
                            tooltipEl = document.createElement('div');
                            tooltipEl.id = 'chartjs-tooltip';
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

                            
                            innerHtml += '</thead><tbody>';

                            bodyLines.forEach(function(body, i) {
                                var colors = tooltipModel.labelColors[i];
                                var style = 'background:' + colors.borderColor;
                                style += '; border-color:' + colors.borderColor;
                                style += '; border-width: 2px';
                                var span = '<div style="' + style + ';height: 14px;width: 14px;display:inline-block; margin-right:5px;margin-bottom:-2px;"></div>';
                                
                                innerHtml += '<tr><td style="color:#fff;">' + body + '</td></tr>';
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
                        tooltipEl.style.left = position.left + globalThis.pageXOffset + tooltipModel.caretX + 'px';
                        tooltipEl.style.top = position.top + globalThis.pageYOffset + tooltipModel.caretY + 'px';
                        tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
                        tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
                        tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
                        tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
                        tooltipEl.style.pointerEvents = 'none';
                    }
                },
            }
        }
    },

    watch:{
        dsbrd_vms_item: function(value){
            if(value != {}){
                this.vms = value;
                this.setChartData(value)
                this.setChartOptions(value)
                this.loading = false;
            }
        }
    },

    computed: {
        ...mapGetters(['dsbrd_vms_item', 'dsbrd_vms_loading']),
    },
    
    methods: {
        ...mapActions(['dsbrd_vms_getItems']),

        exportCsv(){
            var toCsv = [
                {NAME: 'In Projects', VALUE: this.vms.inProjects},
                {NAME: 'Has snapshots', VALUE: this.vms.hasSnapshots},
                {NAME: 'Total snapshots', VALUE: this.vms.totalSnapshots},
                {NAME: 'Total', VALUE: this.vms.total},
            ]

            this.$export.csv(toCsv, 'vms.csv')
        },

        setChartData(value){
            this.chartData = {
                datasets: [{
                    label: 'Has snapshots',
                    backgroundColor: '#36A2EB',
                    borderColor: '#36A2EB',
                    borderWidth: 1,
                    data: [value.hasSnapshots]
                },
                {
                    label: 'In project',
                    backgroundColor: '#FF6384',
                    borderColor: '#FF6384',
                    borderWidth: 1,
                    data: [value.inProjects]
			    }],
            }
        },

        setChartOptions(value){
            this.chartOptions.scales.yAxes = 
            [{
                display:false,
                ticks:{
                    max: value.totalCount
                }
            }]
        }

    },

    mounted(){
        this.dsbrd_vms_getItems();
    }


}
</script>

<style scoped>
    .vms-widget-block{height: 168px; width:242px;}
    .vms-widget-chart-block{width:125px;height:125px;border-bottom:1px solid #707070;border-left:1px solid #707070;box-sizing: content-box;}
</style>
<style>
</style>
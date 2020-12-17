<template>
<div class="w-cost cost-widget-block white pa-3 br-2 d-flex pr-6 relative">
    <div v-if="loading && dsbrd_costs_loading" class="w-cost__loading-overlay white">
        <div class="fs-m fw-b pa-3 widgets-title-opacity">COSTS</div>
        <div class="w-cost__loading-message fs-ml text-center">Loading...</div>
    </div>
    <v-flex class="w-cost__chart-wrapper">
        <div class="fs-m grey700 fw-b mb-2">COSTS</div>
        <div class="w-cost__chart relative" :class="[loading && !dsbrd_costs_loading ?  'w-cost__chart--no-data d-flex align-center justify-space-around' : '']">
            <doughnut-chart v-if="!loading" :chartdata="chartItemsAll[currency]" :height="214" :width="214" :options="chartOptions"></doughnut-chart>
            <div v-if="!loading" class="w-cost__chart-total d-flex align-center justify-space-around fw-b grey700 monospace">
                {{totalToShow}}
            </div>
            <div v-if="loading && !dsbrd_costs_loading" class="fs-ml grey700 fw-b px-2 dashboard-no-data-title-bg">No objects for accounting</div>
        </div>
    </v-flex>
    <v-flex class="ml-2">
        <div class="grey500 d-flex align-center justify-space-between">
            <div>Home</div>
            <div>
                <v-btn v-if="!loading && !btnDisabled" text @click="inTurn = !inTurn" :class="[inTurn ? 'blue500 blue300-border' : 'grey500 grey300-border', btnDisabled ? 'd-none' : '']" class="w-cost__btn br-2 normal-text fs-s border relative px-0 mr-2">
                    IN TURN
                </v-btn>
                <v-menu offset-y left width="170px" v-if="!loading">
                    <template v-slot:activator="{ on }">
                        <v-btn v-on="on" text :disabled="btnDisabled" class="w-cost__btn br-2 normal-text fs-s grey500 grey300-border border relative px-0">
                            <span class="pr-2">{{currency}}</span> <i class="w-cost__btn-icon grey500-i icon-ChDown"></i>
                        </v-btn>
                    </template>
                    <v-list class="w-cost__currency-list control-combobox py-2 border blue050-border br-4" width="68px">
                        <v-list-item v-for="c in currencyList" :key="`c-list-${c}`" class="w-cost__currency-list-item fs-s text-right" @click="currency=c,inTurn = false">{{c}}</v-list-item>
                    </v-list>
                </v-menu>
                <v-menu offset-y left width="170px">
                    <template v-slot:activator="{ on, value }">
                        <v-btn v-on="on" :class="{'grey100-b': value}" :disabled="loading" icon tile text width="24" height="24" class="w-cost__export-btn br-4 ml-2">
                            <i class="grey500-i icon-Donner icon-16"></i>
                        </v-btn>
                    </template>
                    <v-list width="170px" class="control-combobox py-2 border blue050-border br-4">
                        <v-list-item height="32px" class="fs-m" @click="exportCsv()">Export list (CSV)</v-list-item>
                    </v-list>
                </v-menu>
            </div>
        </div>
        <div>
            <v-data-table
                :headers="tableHeaders"
                :items.sync="costItems[currency]"
                item-key="id"
                sort-by="name"
                sort-desc
                fixed-header
                disable-pagination
                hide-default-header
                hide-default-footer
                class="w-cost__table custom-cost-table dashboard-table"
                > 
                <template v-slot:header="data">
                    <thead class="border-bottom blue050-border">
                    <tr>
                    <template v-for="header in data.props.headers">
                    <th :key="header.value" class="table-header-text pa-2 fw-n" >
                        <div class="d-flex align-center">
                            <span class="fs-s grey600 nonselect">{{header.text}}</span>
                        </div>
                    </th>
                    </template>
                    </tr>
                    </thead>

                </template>
                <template v-slot:item="data">
                    <tr class="row-with-hidden-menu border-bottom grey100-border">
                    <template v-for="(header, index) in data.headers">
                        <td :key="index" >
                            <!-- legend -->
                            <div v-if="header.value=='legend'">
                                <div class="w-cost__table-legend-block" :style="{background: data.item.legend}"></div>
                            </div>

                            <!-- name -->
                            <div v-if="header.value=='name'">
                                <div class="grey900 fs-m">{{data.item.name}}</div>
                            </div>
                            
                            <!-- cost -->
                            <div v-if="header.value=='cost'" class="text-right">
                                <span class="grey800 fw-b fs-ml monospace">{{data.item.costFormatted}}</span>
                            </div>
                        </td>
                    </template>
                    </tr>
                </template>
            </v-data-table>
        </div>
    </v-flex>
</div>
</template>

<script>
import DoughnutChart from '@/components/charts/doughnutChart.js'
import colors from '@/consts/chartColorConsts'
import { currencies } from '@/consts/pricelistConst'
import { costItemsCodes } from '@/consts/dashboardConsts'
import { mapGetters, mapActions } from 'vuex'

export default {
    components: {
      DoughnutChart
    },

    props:[
        'items'
    ],

    data(){
        return{
            loading: true,
            currency: 'RUB',
            costItemsCodes,
            colors,
            currencies,
            inTurnIndex: 0,
            total: 0,
            time: 10,
            inTurn: true,
            costItems: {},
            chartItemsAll: {},
            chartOptions:{
                legend:{
                    display:false
                },
                tooltips: {
                    enabled: false,
                    displayColors: false,
                    callbacks: {
                        label: function(tooltipItem, data) {
                            return data.datasets[0].data[tooltipItem.index].toLocaleString('ru-RU', { maximumFractionDigits:2, minimumFractionDigits:2 });
                        }
                    },
                    custom: function(tooltipModel) {
                        // Tooltip Element
                        var tooltipEl = document.getElementById('chartjs-tooltip-cost');

                        // Create element on first render
                        if (!tooltipEl) {
                            tooltipEl = document.createElement('div');
                            tooltipEl.id = 'chartjs-tooltip-cost';
                            tooltipEl.classList.add('price-widget-tooltip')
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
                        
                        var subTitle = this._data.labels[tooltipModel.dataPoints[0].index];
                        var currency = this._data.datasets[0].currency
                        // Set Text
                        if (tooltipModel.body) {
                            var titleLines = tooltipModel.title || [];
                            var bodyLines = tooltipModel.body.map(getBody);

                            var innerHtml = '<thead>';

                            titleLines.forEach(function(title) {
                                innerHtml += '<tr><th>' + title + '</th></tr>';
                            });
                            innerHtml += '</thead><tbody>';

                            bodyLines.forEach(function(body, i) {
                                var colors = tooltipModel.labelColors[i];
                                var style = 'background:' + colors.backgroundColor;
                                style += '; border-color:' + colors.borderColor;
                                style += '; border-width: 2px';
                                var span = '<span style="' + style + '"></span>';

                                innerHtml += '<tr><td style="color:rgba(255, 255, 255, 0.73);padding-bottom:5px;"><b>' + subTitle + '</b></td></tr>';
                                innerHtml += '<tr><td style="color:rgba(255, 255, 255, 0.93);text-align:center;">' + span + '<b>' + body + '</b> ' + currency + '</td></tr>';
                            });
                            innerHtml += '</tbody>';

                            var tableRoot = tooltipEl.querySelector('table');
                            tableRoot.innerHTML = innerHtml;
                        }

                        // `this` will be the overall tooltip
                        var position = this._chart.canvas.getBoundingClientRect();

                        // Display, position, and set styles for font
                        tooltipEl.style.opacity = 1;
                        tooltipEl.style.borderRadius = '2px';
                        tooltipEl.style.borderBottomLeftRadius = 0;
                        tooltipEl.style.transition = 'all 0.5s ease 0s';
                        tooltipEl.style.position = 'absolute';
                        tooltipEl.style.background = 'rgba(0,0,0,0.8)';
                        tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
                        tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY - 52 + 'px';
                        tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
                        tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
                        tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
                        tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
                        tooltipEl.style.pointerEvents = 'none';
                    }
                }
            },
            tableItems: [
                {
                    id:"1",
                    legend:"#FF6384",
                    name:"VMs in projects",
                    cost:"1 210 €",
                },
                {
                    id:"1",
                    legend:"#FF6384",
                    name:"VMs in projects",
                    cost:"1 210 €",
                },
                {
                    id:"1",
                    legend:"#FF6384",
                    name:"VMs in projects",
                    cost:"1 210 €",
                },
            ],
            tableHeaders: [
                {text:"LEGEND",value:"legend",width:"30px"},
                {text:"NAME",value:"name",width:"auto"},
                {text:"COST",value:"cost",width:"100px"},
            ],
        }
    },

    watch:{
        items: {
            handler: function(value){
                if(value.length > 0){
                    let colorIndex = 0;
                    let colorsArr = Object.values(this.colors);
                    let chartItems = {
                        datasets: [{
                            backgroundColor: [],
                            borderWidth: 1,
                            data: []
                        }],
                        labels: [],
                    }
                    this.chartItemsAll = {}
                    this.tableItems = []
                    this.costItems = {}
                    this. total = {}
                    value.forEach((item, index) => {
                        if(isNullOrUndefined(this.chartItemsAll[item.currency])){
                            this.chartItemsAll[item.currency] = {
                                datasets: [{
                                    backgroundColor: [],
                                    borderWidth: 1,
                                    data: [],
                                    borderColor: this.glb_current_theme == 'dark' ? '#181a1b' : '#fff',
                                    currency: this.currencies[item.currency].letter
                                }],
                                labels: [],
                            };
                        }
                        this.chartItemsAll[item.currency].datasets[0].backgroundColor.push(this.getColor(this.costItemsCodes[item.code][`${item.inProjects ? 'inProject' : 'notInProject'}`]))
                        this.chartItemsAll[item.currency].datasets[0].data.push(item.cost)
                        this.chartItemsAll[item.currency].labels.push(this.costItemsCodes[item.code][`${item.inProjects ? 'inProject' : 'notInProject'}`])
                        //console.log(item.currency)
                        if(isNullOrUndefined(this.costItems[item.currency])){
                            this.costItems[item.currency] = []
                        }
                        this.costItems[item.currency].push({
                            id: index,
                            legend: this.getColor(this.costItemsCodes[item.code][`${item.inProjects ? 'inProject' : 'notInProject'}`]),
                            name: this.costItemsCodes[item.code][`${item.inProjects ? 'inProject' : 'notInProject'}`],
                            costFormatted: localePrice(item.cost, item.currency),
                            cost: item.cost,
                            currency: item.currency
                        })
                        if(isNullOrUndefined(this.total[item.currency])){
                            this.total[item.currency] = 0
                        }
                        this.total[item.currency] += item.cost

                        colorIndex++
                        if(colorIndex+1 == colorsArr.length)
                            colorIndex = 0
                    })
                    this.loading = false;
                }
            }
        },
        time:function(value){
            if(value <= 0){
                this.changeCurrency()
                this.time = 10
                this.timeoutCheck(this)
            }
        }
    },
    
    methods: {
        exportCsv(){
            var toCsv = this.costItems[this.currency].map(item=>{ return { 
                NAME  : item.name, 
                [`PRICE ${this.currencies[this.currency].letter}`] : item.cost.toString().replace('.',',')
            } });

            this.$export.csv(toCsv, `costs ${this.currency}.csv`)
        },

        getColor(value){
            switch(value){
                case 'VMs in project':
                    return this.colors.green.normal
                    break;
                case 'VMs not in project':
                    return this.colors.blue.normal
                    break;
                case 'Templates':
                    return this.colors.red.normal
                    break;
                case 'Media':
                    return this.colors.orange.normal
                    break;
                default:
                    return 'rgb(219, 219, 219)'
            }
        },

        changeCurrency(){
            let currencyArr = Object.keys(this.costItems)
            this.inTurnIndex = currencyArr.indexOf(this.currency)

            if(this.inTurn && !this.btnDisabled){
                if(this.inTurnIndex == currencyArr.length - 1)
                    this.inTurnIndex = 0
                else
                    this.inTurnIndex++
                this.currency = currencyArr[this.inTurnIndex]
            }
        },

        async timeoutCheck() {
            while(this.time>0){
                await timeout(1000);
                this.time--
            }
        },
    },

    computed: {
        ...mapGetters([ 'dsbrd_costs_loading', 'glb_current_theme' ]),

        totalToShow(){
            let quantitySymbols = Math.floor(this.total[this.currency]).toString().split('').length
            return quantitySymbols > 6 ? localePrice(this.total[this.currency], this.currency, 0) : localePrice(this.total[this.currency], this.currency)
        },
        btnDisabled(){
            return Object.values(this.costItems).length == 1
        },
        currencyList(){
            return Object.keys(this.costItems)
        }
    },

    mounted(){
        new SimpleBar(qs(".custom-cost-table .v-data-table__wrapper"), { autoHide: true });
        this.timeoutCheck(this)
    }
}
</script>
<style lang="stylus" scoped>
.w-cost
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
    &__chart-wrapper
        max-width 238px
    &__chart
        height 214px
        width 214px
        &--no-data
            background url('/img/dasboard/cost-widget-bg.png') no-repeat center center
    &__chart-total
        position absolute
        top 53px
        left 53px
        bottom 53px
        right 53px
        border-radius 50%
    &__btn
        height 23px !important
        width 68px !important
    &__btn-icon
        position absolute
        right 3px
        top 2px
    &__export-btn
        margin-right -12px
    &__currency-list
        width 68px
    &__currency-list-item
        min-height 24px
    &__table
        width 100%
        max-height 212px
    &__table-legend-block
        width 22px
        height 9px
</style>
<style>
    .custom-cost-table .v-data-table__wrapper{max-height:212px;}
    .cost-widget-tooltip::after{
        content: " ";
        position: absolute;
        top: 100%;  /* At the top of the tooltip */
        left: 0;
        width: 0;
        height: 0;
        border-top: 6px solid rgba(0, 0, 0, 0.8);
        border-right: 8px solid transparent;
    }
    .v-data-table.custom-cost-table td {
        height: 40px;
    }
</style>
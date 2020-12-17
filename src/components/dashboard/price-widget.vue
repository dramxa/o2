<template>
<div class="w-monthly-cost price-widget-block white pa-3 br-2 relative" >
<div v-if="dsbrd_amount_loading" class="white w-monthly-cost__loading-overlay">
    <div class="fs-m fw-b pa-3 widgets-title-opacity">MONTHLY COST</div>
    <div class="fs-ml text-center w-monthly-cost__loading-message">Loading...</div>
</div>

<div class="d-flex justify-space-between">
    <div class="fs-m fw-b grey700 mb-2">MONTHLY COST</div>
    <v-menu offset-y left width="170px">
        <template v-slot:activator="{ on, value }">
            <v-btn v-on="on" :class="{'grey100-b': value}" icon :disabled="loading" tile text width="24" height="24" class="w-monthly-cost__export-btn br-4 ml-2">
                <i class="grey500-i icon-Donner icon-16"></i>
            </v-btn>
        </template>
        <v-list width="170px" class="control-combobox py-2 border blue050-border br-4">
            <v-list-item height="32px" class="fs-m" @click="exportCsv()">Export list (CSV)</v-list-item>
        </v-list>
    </v-menu>
</div>
<div class="d-flex" :style="{height: loading ? '60px' : '116px'}" v-if="!dsbrd_amount_loading">
    <v-flex style="width:90px;">
        <div class="fs-s grey500">Estimated</div>
    </v-flex>
    <v-flex class="align-self-top d-flex" v-if="!loading">
        <v-flex class="text-right pt-3 pr-3">
            <div v-for="(item, index) in items" :key="index" class="monospace w-monthly-cost__price" :style="{color: currency[item.currency].borderColor}">{{formatPrice(item)}}</div>
        </v-flex>
        <!-- <v-flex style="width:40px;">
            <div v-for="(item, index) in items" :key="index" class="pl-1 brown600">15%</div>
        </v-flex> -->
    </v-flex>
</div>
<div class="d-flex justify-space-around align-center w-monthly-cost__no-data" v-if="loading && !dsbrd_amount_loading">
    <div class="fs-ml grey700 fw-b">No objects for accounting</div>
</div>
<div v-if="!loading" class="w-monthly-cost__chart relative">
    <!-- <div style="position: absolute;top: -18px;bottom: 0;width: 1px;background: #707070;left: 11%;"></div> -->
    <line-chart :chart-data="chartData1" :height="110" :width="280" :options="chartOptions"></line-chart>
</div>
</div>
</template>

<script>
import LineChart from '@/components/charts/lineWithLineChart.js'
import colors from '@/consts/chartColorConsts'
import { currencies } from '@/consts/pricelistConst'
import { mapGetters, mapActions } from 'vuex';

export default {
    components: {
      LineChart
    },

    props:[ 'items' ],

    data(){
        return{
            loading: true,
            currencies,
            currency: {
                RUB:{
                    backgroundColor: colors.blue.light,
                    borderColor: colors.blue.normal,
                    symbol: '₽'
                },
                USD:{
                    backgroundColor: colors.orange.light,
                    borderColor: colors.orange.normal,
                    symbol: '$'
                },
                EUR:{
                    backgroundColor: colors.red.light,
                    borderColor: colors.red.normal,
                    symbol: '€'
                }
            },
            itemsArr: [],
            chartData1: null,
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
                        display: false
                    }],
                },
                hover:{
                    mode: 'index',
                    intersect: false,
                },
                tooltips: {
                    mode: 'index',
                    // displayColors: false,
                    enabled: false,
                    intersect: false,
                    position: 'nearest',
                    titleFontFamily: 'PTRootUI, sans-serif',
                    bodyFontFamily: 'PTRootUI, sans-serif',
                    custom: function(tooltipModel) {
                        // Tooltip Element
                        var tooltipEl = document.getElementById('chartjs-tooltip-price');

                        // Create element on first render
                        if (!tooltipEl) {
                            tooltipEl = document.createElement('div');
                            tooltipEl.id = 'chartjs-tooltip-price';
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
                                innerHtml += '<tr><th style="color:rgba(255, 255, 255, 0.92);padding-bottom:5px;">' + dd + '.' + mm + '.' + yyyy + '</th></tr>';
                            });
                            innerHtml += '</thead><tbody>';

                            var chartDatasets = this._data.datasets
                            var widgetItems = this._data.widgetItems
                            

                            bodyLines.forEach(function(body, i) {
                                var colors = tooltipModel.labelColors[i];
                                var style = 'background:' + colors.borderColor;
                                style += '; border-color:' + colors.borderColor;
                                style += '; border-width: 2px';
                                var span = '<div style="' + style + ';height: 14px;width: 14px;display:block;position:absolute;left:10px;margin-top:3px;"></div>';
                                

                                var currency = chartDatasets[i].currency;
                                let currencyCode = chartDatasets[i].currencyCode
                                let pricePerDay = widgetItems.find(wi=>wi.currency==currencyCode).history[tooltipModel.dataPoints[i].index].value
                                let pricePerDayFormatted = parseFloat(pricePerDay).toLocaleString('ru-RU', { maximumFractionDigits:2, minimumFractionDigits:2 })

                                
                                var price = parseFloat(body).toLocaleString('ru-RU', { maximumFractionDigits:2, minimumFractionDigits:2 })

                                innerHtml += '<tr><td class="monospace" style="color:rgba(255, 255, 255, 0.73);padding-left:24px;text-align:right;">' + span + 
                                '<div class="pw-tltp-flex"><div style="margin-right:4px;">Monthly cost: </div><div><b style="color:rgba(255, 255, 255, 0.85);">' + price + '</b> ' + currency + '</div></div>' + 
                                '<div class="pw-tltp-flex"><div style="margin-right:4px;">Daily cost: </div><div><b style="color:rgba(255, 255, 255, 0.85);">' + pricePerDayFormatted + '</b> ' + currency + '</div></div></td></tr>';
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
                        tooltipEl.style.paddingTop = '6px';
                        tooltipEl.style.borderRadius = '2px';
                        tooltipEl.style.borderBottomLeftRadius = 0;
                        tooltipEl.style.transition = 'all 0.1s ease 0s, opacity 0.5s ease 0s';
                        tooltipEl.style.position = 'absolute';
                        tooltipEl.style.background = 'rgba(0,0,0,0.8)';
                        tooltipEl.style.left = position.left + globalThis.pageXOffset + tooltipModel.caretX + 'px';
                        tooltipEl.style.top = position.top + globalThis.pageYOffset + tooltipModel.caretY - globalThis.qs('#chartjs-tooltip-price').offsetHeight - 10 + 'px';
                        tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
                        tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
                        tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
                        tooltipEl.style.pointerEvents = 'none';
                    }
                }
            }
        }
    },

    watch:{
        items: function(value){
            if(value.length > 0){
                let cd = {
                    labels: [],
                    datasets: []
                }
                value[0].history.forEach(h=>{
                    cd.labels.push(h.date)
                })
                value.forEach(p=>{
                    let dsItem = {
                        backgroundColor: this.currency[p.currency].backgroundColor,
                        borderColor: this.currency[p.currency].borderColor,
                        currency: this.currency[p.currency].symbol,
                        currencyCode: p.currency,
                        borderWidth: 2,
                        pointRadius: 0,
                        pointHoverRadius: 2,
                        data: [],
                        fill: true,
                        lineTension: 0.1,
                    }
                    p.history.forEach(h=>{
                        dsItem.data.push(h.monthly)//.value)
                    })
                    cd.datasets.push(dsItem);
                })
                cd.widgetItems = value
                this.chartData1 = cd;
                this.loading = false;
            }
        }
    },

    
    methods: {
        formatPrice(val){
            let price = val.history[val.history.length-1].estimated
            return localePrice(price, val.currency, 2)
        },

        exportCsv(){
            let toCsv = {}
            this.items.forEach(item=>{
                toCsv[item.currency] = item.history
            })

            for (let key in toCsv){
                let toExport = toCsv[key].map(p=>{ return { 
                    DATE  : formatDate(p.date), 
                    [`ESTIMATED ${this.currencies[key].letter}`] : p.estimated.toString().replace('.',','),
                    [`MONTHLY ${this.currencies[key].letter}`] : p.monthly.toString().replace('.',','),
                    [`DAILY ${this.currencies[key].letter}`] : p.value.toString().replace('.',',')
                } });

                this.$export.csv(toExport, `price ${key}.csv`)
            }
        },
    },

    computed: {
         ...mapGetters([ 'dsbrd_amount_loading' ])
    },

    mounted(){
        
    }
}

</script>
<style lang="stylus" scoped>
.w-monthly-cost
    height 262px
    width 280px
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
    &__export-btn
        position absolute
        right 8px
        top 8px
    &__price
        font-size 22px
        line-height 24px
    &__no-data
        height 120px
        background url('/img/dasboard/price-widget-bg.svg') no-repeat center center
    &__chart
        margin-left -12px
        margin-right -12px
        margin-bottom -12px
        height 110px
</style>
<style>
    .price-widget-tooltip{z-index:1;}
    .price-widget-tooltip::after{
        content: " ";
        position: absolute;
        top: 100%;  /* At the top of the tooltip */
        left: 0;
        width: 0;
        height: 0;
        border-top: 6px solid rgba(0, 0, 0, 0.8);
        border-right: 8px solid transparent;
    }
    .pw-tltp-flex{
        display: -webkit-box !important;
        display: -ms-flexbox !important;
        display: flex !important;
        -webkit-box-pack: justify !important;
        -ms-flex-pack: justify !important;
        justify-content: space-between !important;
    }
</style>
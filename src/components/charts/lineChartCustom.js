import Chart from 'chart.js'
import { generateChart, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

Chart.defaults.LineWithLine = Chart.defaults.line;
Chart.controllers.LineWithLine = Chart.controllers.line.extend({ 
    draw: function(ease) {
        Chart.controllers.line.prototype.draw.call(this, ease);

        if (this.chart.tooltip._active && this.chart.tooltip._active.length) {
           var activePoint = this.chart.tooltip._active[0],
              ctx = this.chart.ctx,
              x = activePoint.tooltipPosition().x,
              y = activePoint.tooltipPosition().y,
              topY = activePoint.tooltipPosition().y,
              topX = activePoint.tooltipPosition().x,
              // topYLine = this.chart.scales['y-axis-0'].top,
              rightX = this.chart.scales['x-axis-0'].right,
              bottomY = this.chart.scales['y-axis-0'].bottom,
              leftX = this.chart.scales['x-axis-0'].left;


           // draw line
           ctx.save();
           ctx.beginPath();
           ctx.setLineDash([10, 5]);
           ctx.moveTo(x, bottomY);
           ctx.lineTo(x , topY);
           ctx.lineWidth = 1;
           ctx.strokeStyle = '#78909C';
           ctx.stroke();
           ctx.restore();

           // draw line
           ctx.save();
           ctx.beginPath();
           ctx.setLineDash([10, 5]);
           ctx.moveTo(leftX, y);
           ctx.lineTo(rightX, y);
           ctx.lineWidth = 1;
           ctx.strokeStyle = '#78909C';
           ctx.stroke();
           ctx.restore();


           // draw Circle
           ctx.save();
           ctx.beginPath();
           ctx.arc(x , topY, 3, 0, 2 * Math.PI);
           ctx.fillStyle ="#78909C";
           ctx.strokeStyle = '#78909C';
           ctx.fill();
           ctx.stroke();

        }
     }
})


const CustomLine = generateChart('custom-line', 'LineWithLine')

export default {
  extends: CustomLine,
  mixins: [reactiveProp],
  props: ['options', 'chartData'],
  mounted () {
    // this.chartData создаётся внутри миксина.
    // Если вы хотите передать опции, создайте локальный объект options
    this.renderChart(this.chartData, this.options)
  }
}
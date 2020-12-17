import Chart from 'chart.js'
import { generateChart, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

Chart.defaults.LineWithLine2 = Chart.defaults.line;
Chart.controllers.LineWithLine2 = Chart.controllers.line.extend({ 
    draw: function() {
        Chart.controllers.line.prototype.draw.call(this, arguments);

        var scale = this.chart.scales['x-axis-0']

        let indexFirstDay = 0;
        this.chart.data.labels.forEach((l, index)=>{
            let day = new Date(l).getDate();
            if(day == 1)
                indexFirstDay = index

        })
        let tickSize = scale.maxWidth / (this.chart.data.labels.length - 1);
      //  console.log(indexFirstDay)
        let pointX = indexFirstDay * tickSize;

     //   console.log(this.chart)
        

        // draw line
        this.chart.ctx.beginPath();
        this.chart.ctx.moveTo(pointX, scale.bottom);
        this.chart.ctx.strokeStyle = '#FB7878';
        this.chart.ctx.lineWidth = 1;
        this.chart.ctx.lineTo(pointX, 16);
        this.chart.ctx.stroke();

        let img = new Image();
        img.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMSIgaGVpZ2h0PSIxNS43MTQiIHZpZXdCb3g9IjAgMCAxMSAxNS43MTQiPjxwYXRoIGlkPSJpY19wbGFjZV8yNHB4IiBkPSJNMTAuNSwyQTUuNSw1LjUsMCwwLDAsNSw3LjVjMCw0LjEyNSw1LjUsMTAuMjE0LDUuNSwxMC4yMTRTMTYsMTEuNjI1LDE2LDcuNUE1LjUsNS41LDAsMCwwLDEwLjUsMlptMCw3LjQ2NEExLjk2NCwxLjk2NCwwLDEsMSwxMi40NjQsNy41LDEuOTY1LDEuOTY1LDAsMCwxLDEwLjUsOS40NjRaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNSAtMikiIGZpbGw9InJnYigyNTEsIDEyMCwgMTIwKSIvPjwvc3ZnPg=="

        // let path = new Path2D('M10.5,2A5.5,5.5,0,0,0,5,7.5c0,4.125,5.5,10.214,5.5,10.214S16,11.625,16,7.5A5.5,5.5,0,0,0,10.5,2Zm0,7.464A1.964,1.964,0,1,1,12.464,7.5,1.965,1.965,0,0,1,10.5,9.464Z')

        this.chart.ctx.drawImage(img, pointX - 5.5, 0);
        // this.chart.ctx.fillStyle = 'rgba(225,82,82,0.72)'

        // this.chart.ctx.fill(path)
     
      }
})


const CustomLine = generateChart('line-with-line', 'LineWithLine2')

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
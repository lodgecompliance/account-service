<template>
  <div :id="containerId" :style="`width: 100%;`"></div>
</template>
<script>
import dependency from '@/mixins/dependency'
export default {
  name: "Chart",
  mixins: [dependency],
  data() {
    return {
      chart: null
    }
  },
  props: {
    id: { type: String, default: () => 'chart' },
    type: { type: String, default: () => 'bar' },
    labels: { type: Array },
    datasets: { type: Array },
  },

  computed: {
    containerId() {
      return this.id+'-container';
    },
    groupedData() {
      return this.groupData(this.data, this.groupBy, this.valueKey);
    },
  },
  methods: {
    createCanvas() {
      const canvas = document.createElement("canvas");
      canvas.setAttribute("id", this.id);
      return canvas;
    },
    getCanvas() {
      return document.getElementById(this.id)?.getContext('2d');
    },
    resetChartCanvas() {
      const container = document.getElementById(this.containerId);
      if(container) {
        container.innerHTML = "";
        container.append(this.createCanvas());
      }
    },
    setChartJS() {
      return this.setDependency('chart-js', 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.min.js',{});
    },
    buildChart() {
      /* eslint-disable */
      this.setChartJS().then(() => {
        new Chart(
            this.getCanvas(),
            {
              type: this.type,
              data: {
                labels: this.labels,
                datasets: this.datasets,
                options: {
                  scales: {
                    yAxes: [{
                      ticks: {
                        beginAtZero: true
                      }
                    }]
                  }
                }
              },
            }
        )
      })
    },
    render() {
      this.resetChartCanvas();
      this.buildChart()
    }
  },
  watch: {
    datasets: {
      immediate: true,
      handler() {
        this.render()
      }
    },
    type: {
      immediate: true,
      handler() {
        this.render()
      }
    }
  }
}
</script>
<template>
  <v-select
      v-model="filter"
      :items="filters"
      item-text="label"
      return-object
      v-bind="$attrs"
  >
  </v-select>
</template>

<script>
import moment from "moment";
export default {
  name: "PeriodFilter",
  data() {
    return {
      filter: null,
      filters: [
        {
          label: "Today",
          unit: 'day',
          granular: 'hour',
          comparisonFormat: "DD MMM, YYYY H",
          labelFormat: "ha",
        },
        {
          label: "This Week",
          unit: 'week',
          granular: 'day',
          comparisonFormat: "DD MMM, YYYY",
          labelFormat: "DD MMM",
        },
        {
          label: "This Month",
          unit: 'month',
          granular: 'day',
          comparisonFormat: "DD MMM, YYYY",
          labelFormat: "DD MMM",
        },
        {
          label: "This Year",
          unit: 'year',
          granular: 'month',
          comparisonFormat: "MMM, YYYY",
          labelFormat: "MMM",
        },
        // {
        //   label: "Last 7 Days",
        //   range: 7,
        //   unit: 'day',
        //   comparisonFormat: "DD MMM, YYYY",
        //   labelFormat: "DD MMM",
        // },
        // {
        //   label: "Last 30 Days",
        //   range: 30,
        //   unit: 'day',
        //   comparisonFormat: "DD MMM, YYYY",
        //   labelFormat: "DD MMM",
        // },
        // {
        //   label: "Last 6 Months",
        //   range: 6,
        //   unit: 'month',
        //   comparisonFormat: "MMM, YYYY",
        //   labelFormat: "MMM",
        // },
        // {
        //   label: "Last 12 Months",
        //   range: 12,
        //   unit: 'month',
        //   comparisonFormat: "MMM, YYYY",
        //   labelFormat: "MMM",
        // },
      ]
    }
  },
  props: {
    defaultFilter: String
  },
  mounted() {
    let defaultFilter = this.filter;
    if(this.defaultFilter) {
      defaultFilter = this.filters.find(f => f.label === this.defaultFilter);
    }
    this.filter = defaultFilter || this.filters.find(f => f.label == 'This Year');
  },
  watch: {
    filter: {
      immediate: true,
      handler(filter) {
        if(!filter) return;
        const periods = [];
        const labels = [];
        let start = null;
        let end = null;
        if(filter.range) {
          start = moment().subtract(filter.range, filter.unit);
          end = moment();
          for(
              let period = moment().subtract(filter.range, filter.unit);
              period.isBefore(moment());
              period.add(1, filter.unit)
          ) {
            periods.push(period.format(filter.comparisonFormat));
            labels.push(period.format(filter.labelFormat));
          }
        } else {
          start = moment().startOf(filter.unit);
          end = moment().endOf(filter.unit)
          for(
              let period = moment().startOf(filter.unit);
              period.isBefore(moment().endOf(filter.unit));
              period.add(1, filter.granular)
          ) {
            periods.push(period.format(filter.comparisonFormat));
            labels.push(period.format(filter.labelFormat));
          }
        }
        this.$emit("input", { ...filter, start, end, periods, labels });
      }
    }
  }
}
</script>


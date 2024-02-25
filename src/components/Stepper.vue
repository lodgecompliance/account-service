<template>
  <v-stepper v-model="currentStep" rounded v-bind="$attrs">
    <slot name="header" v-bind="{ steps }">
      <v-row v-if="showStepHeader" justify="center">
        <v-col cols="12" sm="8">
          <v-stepper-header class="box-shadow-unset">
            <template v-for="(step, n) in steps">
              <v-stepper-step
                  :key="`${step}-step-header`"
                  :step="n+1"
              >
              </v-stepper-step>
              <v-divider
                  v-if="n !== steps.length - 1"
                  :key="`${step}-step-header-divider`"
              ></v-divider>
            </template>
          </v-stepper-header>
        </v-col>
      </v-row>
    </slot>
    <v-stepper-items>
      <v-stepper-content
          v-for="(step, n) in steps"
          :key="step"
          :step="n+1"
      >
        <slot :name="step" v-bind="{ previousStep, nextStep, isLastStep, isFirstStep, stepCompleted }" />
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>

</template>

<script>

export default {
  name: "Stepper",
  components: {  },
  data() {
    return {
      currentStep: 1,
      results: {}
    }
  },
  computed: {
    isLastStep() {
      return this.currentStep === this.steps.length;
    },
    isFirstStep() {
      return this.currentStep === 1
    }
  },
  props: {
    steps: Array,
    showStepHeader: {
      type: Boolean,
      default: () => true
    }
  },
  methods: {

    previousStep() {
      if(!this.isFirstStep) this.currentStep--;
    },

    nextStep() {
      if(!this.isLastStep) this.currentStep++;
    },

    stepCompleted(result) {
      this.results[this.steps[this.currentStep - 1]] = result;
      this.$emit("results", { result: this.results, lastStep: this.isLastStep });
      if(this.isLastStep) this.allStepsCompleted()
      else this.nextStep()
    },

    allStepsCompleted() {
      this.$emit("completed", true)
    },

  }
}
</script>
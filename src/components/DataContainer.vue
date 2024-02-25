<template>
    <div>
        <template v-if="loading">
            <slot name="loading">
              <div class="text-center">
                <loader />
                <p v-if="loadingText">{{ loadingText }}</p>
              </div>
            </slot>
        </template>
        <template v-else-if="error">
          <slot v-if="renderRegardlessOfError" />
          <slot name="error" v-bind="{ error }">
            <error-handler
                :error="error"
                :can-retry="canRetry"
                v-on="$listeners"
            />
          </slot>
        </template>
        <template v-else>
            <slot />
        </template>
    </div>
</template>

<script>
import Loader from "@/components/Loaders/DottedSpinner";
import ErrorHandler from "@/components/ErrorHandler";
export default {
    name: "DataContainer",
  components: { ErrorHandler, Loader },
  props: {
        loading: Boolean,
        renderRegardlessOfError: {
          type: Boolean,
          default: () => false
        },
        loadingText: String,
        type: {
            default: () => 'list-item-two-line'
        },
        error: [Object, Error],
        canRetry: {
          default: () => false
        }
    }
}
</script>
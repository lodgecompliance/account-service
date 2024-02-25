<template>
  <v-dialog
      v-model="show"
      max-width="500"
      v-on="$listeners"
      persistent scrollable>
    <v-card :loading="saving">
      <v-card-title>
        <h4>{{ type.name }}</h4>
        <v-spacer></v-spacer>
        <v-switch
            v-model="form.enabled"
            inset
        >
        </v-switch>
        <v-btn icon @click="$emit('close')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-subtitle>{{ type.description }}</v-card-subtitle>
      <v-card-text class="pt-2">
        <error-handler :error="error" />
        <v-text-field
            outlined dense
            label="Integration Title"
            :rules="[rules.required]"
            type="text"
            v-model="form.title"
        ></v-text-field>
          <slot v-bind="{ integration, business, info: form, save, saving }" />
      </v-card-text>
      <v-card-actions v-if="$slots['actions']">
        <slot name="actions"></slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import formValidation from '@/helper/formValidation';
import ErrorHandler from "@/components/ErrorHandler.vue";
import integration from "@/domain/Business/Mixins/integration";

export default {
  name: "IntegrationSetup",
  mixins:[integration],
  components: {ErrorHandler},
  props: {
    open: Boolean,
    business: Object,
    integration: Object
  },
  data(){
    return {
      rules: formValidation.rules,
      show: false,
      saving: false,
      error: null,
      form: {
        enabled: false,
        title: null,
      }
    }
  },
  computed: {
    type() {
      return this.integration?.type;
    }
  },
  methods: {
    save({ credentials = {}, settings = {} }) {
      this.saving = true;
      this.error = null;
      this.integration.id
          ? this.updateIntegration(credentials, settings)
          : this.createIntegration(credentials, settings)
    },

    createIntegration(credentials = {}, settings = {}) {
      this.createBusinessIntegration(this.business.id, {
        ...this.form,
        credentials: JSON.stringify(credentials),
        settings: JSON.stringify(settings),
      })
      .then(response => {
        this.$emit('integration-created', response)
      })
      .catch(e => {
        this.error = e;
      })
      .finally(() => {
        this.saving = false;
      })
    },

    updateIntegration(credentials = {}, settings = {}) {
      if(!credentials || !Object.keys(credentials).length) this.form.enabled = false;
      this.updateBusinessIntegration(this.business.id, this.integration.id, {
        ...this.form,
        credentials: JSON.stringify(credentials),
        settings: JSON.stringify(settings),
      })
      .then(response => {
        this.$emit('integration-updated', response)
      })
      .catch(e => {
        this.error = e;
      })
      .finally(() => {
        this.saving = false;
      })
    }
  },
  watch: {
    open: {
      immediate: true,
      handler(open) {
        this.show = open;
        const integration = this.integration || {}
        this.form = {
          enabled: integration.enabled || false,
          type: this.type.identifier,
          title: integration.title
        }
      }
    },
  }
}
</script>
<template>
  <v-card :loading="loading" :disabled="loading">
    <file-upload
        v-if="property"
        @input="image => form.cover_image = image"
    >
      <template #default="{ document, selectNewFile }">
        <v-img
            :src="form.cover_image"
            height="200px"
            :alt="property.name"
            class="white--text pa-3"
            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
        >
          <div style="height: 200px" class="d-flex flex-wrap align-content-stretch">
            <div style="width: 100%" class="d-flex justify-end">
              <v-btn
                  dark
                  @click="selectNewFile"
                  :loading="document.uploading"
                  title="Update property cover image"
                  icon><v-icon>mdi-pencil</v-icon>
              </v-btn>
            </div>
            <div style="width: 100%">
              <avatar-form
                  :profile="property"
                  size="70"
                  color="accent"
                  title="Update property image"
                  @change="image => form.image = image"
              >
              </avatar-form>
            </div>
          </div>
        </v-img>
      </template>
    </file-upload>
    <v-card-title v-else class="d-flex justify-space-between">
      <span>Property</span>
      <v-btn icon @click="cancel">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    <div v-if="property" class="d-flex justify-space-between mb-3 px-3">
      <div class="d-flex align-center">

        <div class="ml-2">
          <div class="flex">
            {{ property.name }}
            <v-btn
                class="ml-2"
                :href="`${$store.getters.domains.host}/${property.id}`"
                target="_blank" icon
            >
              <v-icon small>mdi-open-in-new</v-icon>
            </v-btn>
          </div>
          <small class="grey--text">{{ property.address }}</small>
        </div>
      </div>
      <v-switch
          v-model="form.status"
          inset dense
          label="Active"
          false-value="disabled"
          true-value="enabled"
          class="ml-2"
      >
      </v-switch>
    </div>
    <v-tabs v-model="tab" >
      <v-tab>
        Info
      </v-tab>
      <v-tab>
        Integrations
      </v-tab>
    </v-tabs>
    <v-card-text>
      <v-tabs-items v-model="tab">
        <v-tab-item class="pt-4">
            <v-form ref="form">
              <v-text-field
                  v-model="form.name"
                  dense
                  outlined
                  label="Property Name*"
                  placeholder="Enter property name"
                  :rules="[rules.required]"
              ></v-text-field>

              <v-text-field
                  v-model="form.email"
                  dense
                  outlined
                  label="Property Email*"
                  placeholder="Enter property email"
                  :rules="[rules.required, rules.email]"
              ></v-text-field>

              <phone-number
                  v-model="form.phone"
                  dense
                  outlined
                  :include-meta="false"
                  label="Property Phone"
                  :rules="[rules.required]"
              />

              <address-input
                  v-model="form.address"
                  :google-places="{
                    label: 'Property Address',
                    outlined: true,
                    country: business.country,
                    dense: true,
                    clearable: true,
                    value: form.address,
                    rules: [rules.required]
                  }"
                  :text-field="{
                  label: 'Property Address',
                  outlined: true,
                  dense: true,
                  value: form.address,
                  rules: [rules.required]
                }"
              />

              <property-currency-select
                  outlined
                  label="Currency"
                  v-model="form.currency"
                  dense
              />

              <v-textarea
                  v-model="form.rules"
                  dense
                  outlined
                  height="80"
                  label="Property Rules"
                  placeholder="Enter property rules"
                  :rules="[]"
              ></v-textarea>

              <v-text-field
                  v-model="form.term_url"
                  dense
                  outlined
                  label="Terms"
                  placeholder="e.g https://example.com/terms"
                  :rules="[]"
              ></v-text-field>

              <error-handler :error="formError" />
            </v-form>
        </v-tab-item>
        <v-tab-item>
          <v-card
              v-for="integration in ['stripe', 'paystack', 'ezee', 'mailgun', 'remotelock', 'messagebird']" :key="integration"
              outlined
              class="my-2">
            <v-card-title>{{ integration | ucfirst }}</v-card-title>
            <v-card-text>
              <business-integration-select
                  outlined dense
                  :label="`Select ${integration} integration`"
                  :items="integrations"
                  :exclude="integrations.filter(i => i.type.identifier !== integration).map(i => i.id)"
                  v-model="form.integrations[integration]"
              >
                <template v-if="form.integrations[integration]" #append>
                  <v-btn @click="form.integrations[integration] = null" color="red" small text>Unset</v-btn>
                </template>
              </business-integration-select>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card-text>

    <slot name="action" v-bind="{ submitting, submit }">
      <v-card-actions class="align-center px-5">
        <v-spacer></v-spacer>
        <v-btn text @click="cancel">Cancel</v-btn>
        <v-btn
            :loading="submitting"
            color="primary" depressed
            @click="submit()"
        >
          {{ property ? 'Update Property' : 'Add Property' }}
        </v-btn>
      </v-card-actions>
    </slot>
  </v-card>
</template>

<script>
import form from "@/mixins/form";
import ErrorHandler from "@/components/ErrorHandler";
import { mapMutations } from "vuex";
import PhoneNumber from "@/components/Utilities/PhoneNumber";
import AddressInput from "@/components/Utilities/Address";
import ProfileAvatar from "@/components/ProfileAvatar";
import property from "@/domain/Business/Mixins/property";
import BusinessIntegrationSelect from "@/domain/Business/Components/BusinessIntegrationSelect.vue";
import business from "@/domain/Business/Mixins/business";
import AvatarForm from "@/components/AvatarForm.vue";
import FileUpload from "@/components/FileUpload.vue";
import PropertyCurrencySelect from "@/domain/Business/Components/PropertyCurrencySelect.vue";

export default {
  name: "BusinessPropertyForm",
  mixins:[form, business, property],
  components: {
    PropertyCurrencySelect,
    FileUpload,
    AvatarForm,
    BusinessIntegrationSelect,
    AddressInput,
    PhoneNumber,
    ErrorHandler
  },
  data() {
    return {
      loading: false,
      tab: 0,
      integrations: []
    }
  },

  props: {
    business: Object,
    property: Object
  },

  computed: {
    formData() {
      return {
        ...this.form,
        integrations: this.convertObjectToMetaKeyValue(this.form.integrations),
        metadata: this.convertObjectToMetaKeyValue(this.form.metadata),
      }
    }
  },

  methods: {
    ...mapMutations(['SNACKBAR']),
    cancel() {
      this.$refs.form.reset();
      this.$emit("close")
    },

    setForm() {
      const property = this.property || {}
      this.form = {
        name: property.name || null,
        email: property.email || null,
        phone: property.phone || null,
        address: property.address || null,
        rules: property.rules || null,
        currency: property.currency || null,
        term_url: property.term_url || null,
        image: property.image || null,
        cover_image: property.cover_image || null,
        status: property.status || 'enabled',
        integrations: this.convertMetaKeyValueToObj(property.integrations || []),
        metadata: this.convertMetaKeyValueToObj(property.metadata || [])
      }
    },

    submission() {
      if(!this.$refs.form.validate()) return Promise.resolve();
      return new Promise((resolve, reject) => {
        (this.property
            ? this.updateBusinessProperty(this.business.id, this.property.id, this.formData)
            : this.createBusinessProperty(this.business.id, this.formData))
            .then(property => {
              this.$refs.form.reset()
              this.SNACKBAR({
                status: true,
                text: this.property ? 'Property updated' : 'Property created',
                color: 'success'
              })
              this.$emit(this.property ? "property-updated" : "property-created", property);
              resolve(property);
            }).catch(e => reject(e))
      });
    },

  },
  watch: {
    property: {
      immediate: true,
      handler() {
        this.setForm();
        this.getBusinessById(this.business.id, `
              integrations {
                  id
                  enabled
                  title
                  settings
                  type {
                      name
                      tags
                      identifier
                      description
                  }
                }
            `)
            .then(business => {
              this.integrations = (business?.integrations || [])
            }).finally(() => this.loading = false)
      }
    }
  }
}
</script>
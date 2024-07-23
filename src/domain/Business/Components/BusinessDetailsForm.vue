<template>
  <v-card v-bind="$attrs" :loading="loading">
    <slot name="header" />
    <v-card-text class="pt-3">
      <v-form ref="form" v-bind="$attrs">
        <v-text-field
            v-model="form.name"
            dense
            outlined
            label="Business Name"
            :rules="[rules.required]"
        ></v-text-field>
        <country-select
            dense
            flat
            outlined
            label="Business Country"
            v-model="form.country"
            :rules="[rules.required]"
        />
        <address-input
            v-model="form.address"
            :google-places="{
          label: 'Business Address',
          outlined: true,
          dense: true,
          clearable: true,
          value: form.address,
          rules: [rules.required]
        }"
            :text-field="{
          label: 'Business Address',
          outlined: true,
          dense: true,
          value: form.address,
          rules: [rules.required]
        }"
        />
        <v-text-field
            v-model="form.rc_number"
            dense
            outlined
            label="Business RC Number"
            :rules="[]"
        ></v-text-field>
        <file-upload
            v-model="form.document"
            :custom-preview="true"
            accept="image/*,.pdf"
            path="business-docs"
            :rules="[]"
        >
          <template #default="{ document, selectNewFile }">
            <files-preview v-if="form.document" :value="[form.document]" :grid="1">
              <template #file-preview="{ file, placeholder, name, view }">
                <v-img
                    :src="placeholder"
                    height="200"
                    contain
                    class="mx-auto mb-3 pa-2"
                    gradient="to bottom, rgba(0,0,0,.5), rgba(0,0,0,.1)"
                >
                  <v-btn dark text small @click="view(file)">
                    <v-icon small>mdi-arrow-expand-all</v-icon> view full
                  </v-btn>
                </v-img>
              </template>
            </files-preview>
            <v-btn
                v-if="$attrs.disabled === undefined"
                color="primary"
                small text
                :loading="document.uploading"
                @click="selectNewFile"
            ><v-icon small>mdi-paperclip</v-icon> Upload document</v-btn>
          </template>
        </file-upload>
      </v-form>
      <error-handler :error="formError" />
    </v-card-text>
    <slot name="actions" v-bind="{ loading, canSubmit, submitting, submit }">
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            :loading="submitting"
            :disabled="loading"
            color="primary"
            @click="submit()"
        >
          {{ business ? 'Update' : 'Create' }} Business
        </v-btn>
      </v-card-actions>
    </slot>
  </v-card>
</template>

<script>
import form from "@/mixins/form";
import business from "@/domain/Business/Mixins/business"
import CountrySelect from "@/components/Utilities/CountrySelect";
import FileUpload from "@/components/FileUpload";
import DataContainer from "@/components/DataContainer";
import AddressInput from "@/components/Utilities/Address";
import ErrorHandler from "@/components/ErrorHandler";
import FilesPreview from "@/components/FilesPreview.vue";
export default {
  name: 'BusinessDetailsForm',
  mixins: [form, business],
  components:{FilesPreview, ErrorHandler, AddressInput, FileUpload, CountrySelect },
  data(){
    return {
      loading: false,
    };
  },

  props: {
    business: Object
  },

  methods: {

    setForm() {
      const business = this.business || {}
      this.form = {
        name: business.name || null,
        country: business.country || null,
        address: business.address || null,
        rc_number: business.rc_number || null,
        document: business.document || null,
      }
    },

    submission() {
      return new Promise((resolve, reject) => {
        if(!this.$refs.form.validate()) throw new Error("Some information are still missing");
        // if(!this.form.document) throw new Error("Upload your business document");
        (this.business ? this.updateBusiness(this.business.id, this.form) : this.createBusiness(this.form))
          .then(business => {
            if(!this.business) this.$refs.form.reset();
            this.$emit("saved", business);
            resolve(business);
          })
          .catch(e => reject(e))
      })
    },
  },

  watch: {
    business: {
      immediate: true,
      handler() {
        this.setForm()
      }
    }
  }
}
</script>

<template>
    <v-form ref="form">
      <template v-if="country">
        <v-select
            dense outlined
            label="ID Type"
            item-text="name"
            item-value="value"
            :items="idTypesOption"
            v-model="form.id_type"
            :rules="[rules.required]"
        >
        </v-select>
        <template v-if="form.id_type">
          <v-text-field
              dense outlined
              type="text"
              :label="idType.label || idType.name"
              v-model="form.id_number"
              :rules="[rules.required, idType.validator]"
          ></v-text-field>
          <file-upload
              v-if="uploadDoc"
              v-model="form.id_image"
              accept="image/*"
              :custom-preview="true"
              :rules="!form.id_image ? [rules.required] : []"
          >
            <template #default="{ document, selectNewFile }">
              <files-preview v-if="form.id_image" :value="[form.id_image]" :grid="1">
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
                  class="mb-2"
              ><v-icon small>mdi-paperclip</v-icon> Upload {{  idType && idType.name ? idType.name : 'ID' }}</v-btn>
            </template>
          </file-upload>
        </template>
        <error-handler :error="formError" />
        <v-btn
            :loading="submitting"
            :disabled="loading || !canSubmit"
            color="primary" depressed
            @click="submit()" block>
          Submit
        </v-btn>
      </template>
    </v-form>
</template>

<script>
import form from "@/mixins/form";
import countryHelper from '@/helper/country';
import FileUpload from "@/components/FileUpload";
import ErrorHandler from "@/components/ErrorHandler";
import user from "@/domain/User/Mixins/user";
import FilesPreview from "@/components/FilesPreview.vue";

export default {
  name: "ManualVerification",
  mixins: [form, user],
  components: {
    FilesPreview,
    ErrorHandler,
    FileUpload,
  },
  data() {
    return {
      loading: false,
      allCountries: countryHelper.countries,
      supportedCountries: [
        {
          value: 'GH',
          label: 'Ghana',
          id_types: [
            {
              name: 'Drivers License',
              value: 'DRIVERS_LICENSE',
              upload: true,
              validator: v => {
                return /^[a-zA-Z0-9]{6,10}$/i.test(v) || 'Format should be *B0000000'
              }
            },
            {
              name: 'Passport',
              value: 'PASSPORT',
              upload: true,
              validator: v => {
                // return /^(?i)G[a-zA-Z0-9]{7,9}$/i.test(v) || 'Format should be *G0000000'
              }
            },
            {
              name: 'SSNIT',
              value: 'SSNIT',
              upload: true,
              validator: v => {
                return /^[a-zA-Z]{1}[a-zA-Z0-9]{12,14}$/i.test(v) || 'Format should be *C000000000000'
              }
            },
            {
              name: 'Voter ID',
              value: 'VOTER_ID',
              upload: true,
              validator: v => {
                return /^[0-9]{10,12}$/.test(v) || 'Format should be 0000000000'
              }
            },
            {
              name: 'New Voter ID',
              value: 'NEW_VOTER_ID',
              upload: true,
              validator: v => {
                return /^[0-9]{10,12}$/.test(v) || 'Format should be 0000000000'
              }
            },
          ]
        },
        {
          value: 'KE',
          label: 'Kenya',
          id_types: [
            {
              name: 'Alien Card',
              value: 'ALIEN_CARD',
              upload: true,
              validator: v => {
                return /^[0-9]{6,9}$/.test(v) || 'Format should be 000000'
              }
            },
            {
              name: 'National ID',
              value: 'NATIONAL_ID',
              upload: true,
              validator: v => {
                return /^[0-9]{1,9}$/.test(v) || 'Format should be 00000000'
              }
            },
            {
              name: 'Passport',
              value: 'PASSPORT',
              upload: true,
              validator: v => {
                return/^[A-Z0-9]{7,9}$/.test(v) || 'Format should be *A00000000'
              }
            },
          ]
        },
        {
          value: 'NG',
          label: 'Nigeria',
          id_types: [
            {
              name: 'BVN',
              value: 'BVN',
              upload: false,
              validator: v => {
                return /^[0-9]{11}$/.test(v) || 'Formmat should be 00000000000'
              }
            },
            {
              name: 'NIN',
              value: 'NIN',
              upload: true,
              validator: v => {
                return /^[0-9]{11}$/.test(v) || 'Format should be 00000000000'
              }
            },
            {
              name: 'Drivers License',
              value: 'DRIVERS_LICENSE',
              label: 'Drivers License ID',
              upload: true,
              validator: v => {
                return /^[a-zA-Z]{3}([ -]{1})?[A-Z0-9]{6,12}$/i.test(v) || 'Format should be *ABC000000000';
              }
            },
            {
              name: 'Voter ID',
              value: 'VOTER_ID',
              label: 'Voter ID Number',
              upload: true,
              validator: v => {
                return /^[a-zA-Z0-9 ]{9,19}$/i.test(v) || 'Format should be 0000000000000000000'
              }
            },

          ]
        },
        {
          value: 'ZA',
          label: 'South Africa',
          id_types: [
            {
              name: 'National ID',
              value: 'NATIONAL_ID',
              upload: true,
              validator: v => {
                return /^[0-9]{13}$/.test(v) || 'Format should be 0000000000000'
              }
            },
            {
              name: 'National ID, No Photo',
              value: 'NATIONAL_ID_NO_PHOTO',
              upload: true,
              validator: v => {
                return /^[0-9]{13}$/.test(v) || 'Format should be 0000000000000'
              }
            }
          ]
        },
        {
          value: 'UG',
          label: 'Uganda',
          id_types: [
            {
              name: 'National ID, No Photo',
              value: 'NATIONAL_ID_NO_PHOTO',
              upload: true,
              validator: v => {
                return /^[A-Z0-9]{14}$/i.test(v) || 'Format should be 00000000000000'
              }
            }
          ]
        },
      ],
    }
  },
  props: {
    user: Object,
    country: String,
    verification: Object,
    requireUpload: Boolean,
  },
  computed: {
    countryList() {
      return this.allCountries.map(country => {
        const smileCountry = this.supportedCountries.find(c => c.value === country.code);
        if(smileCountry) return smileCountry;
        return {
          value: country.code,
          label: country.name,
          id_types: [
            {
              name: 'National ID',
              value: 'NATIONAL_ID',
              upload: true,
              validator: v => true
            },
            {
              name: 'Drivers License',
              value: 'DRIVERS_LICENSE',
              upload: true,
              validator: v => true
            },
            {
              name: 'Passport',
              value: 'PASSPORT',
              upload: true,
              validator: v => true
            },
          ]
        }
      })
    },

    idTypesOption() {
      if(!this.country) return [];
      return this.countryList.find(c => c.value === this.country).id_types;
    },

    idType() {
      if(!this.form.id_type) return null;
      return this.idTypesOption.find(type => type.value === this.form.id_type);
    },

    uploadDoc() {
      return this.requireUpload && this.idType?.upload
    }
  },

  methods: {
    setForm() {
      const verification = this.verification || {}
      this.form = {
        first_name: verification.first_name || null,
        last_name: verification.last_name || null,
        id_type: this.idTypesOption.find(type => type.value === verification.id_type)?.value,
        id_number: verification.id_number || null,
        id_image: verification.id_image || null
      }
    },

    submission() {
      if(!this.$refs.form.validate()) return Promise.resolve();
      this.form.country = this.country;
      if(this.uploadDoc && !this.form.id_image) return Promise.reject(new Error("Upload your "+this.form.id_type))
      return new Promise((resolve, reject) => {
        this.saveUserIdVerification(this.form)
        .then(id => {
          this.$emit("saved", id);
          resolve(id);
        })
        .catch(e => reject(e))
      })
    },
  },

  watch: {
    verification: {
      immediate: true,
      handler() {
        this.setForm()
      }
    }
  }
}
</script>
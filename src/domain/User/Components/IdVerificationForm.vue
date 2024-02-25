<template>
    <v-card v-bind="$attrs" :loading="loading">
      <slot name="header" />
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-form ref="form" v-bind="$attrs">
              <v-autocomplete
                  dense outlined
                  label="Country"
                  item-text="label"
                  item-value="value"
                  :items="countryList"
                  v-model="form.country"
                  @change="form.id_type = null"
                  :rules="[rules.required]"
              >
              </v-autocomplete>
              <template v-if="form.country">
                <v-select
                    dense outlined
                    label="ID Type"
                    item-text="label"
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
                      :label="`ID number on ${idType.label}`"
                      v-model="form.id_number"
                      :rules="[rules.required, idType.validator]"
                  ></v-text-field>
                  <v-text-field
                      dense outlined
                      type="text"
                      :label="`First Name on ${idType.label}`"
                      v-model="form.first_name"
                      :rules="[rules.required]"
                  >
                  </v-text-field>
                  <v-text-field
                      dense outlined
                      type="text"
                      :label="`Last Name on ${idType.label}`"
                      v-model="form.last_name"
                      :rules="[rules.required]"
                  >
                  </v-text-field>
                  <file-upload
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
                      ><v-icon small>mdi-paperclip</v-icon> Upload {{   form.id_type ? form.id_type : 'ID' }}</v-btn>
                    </template>
                  </file-upload>
                </template>
              </template>
            </v-form>
            <error-handler :error="formError" />
          </v-col>
          <v-col v-if="verification">
            <h4 class="headline text-center">Verification</h4>
            <user-identity-verification
                :user="user"
                :verification="verification"
                @synced="(id) => $emit('saved', id)"
            />
          </v-col>
        </v-row>
      </v-card-text>
      <slot name="actions" v-bind="{ loading, canSubmit, submitting, submit }"></slot>
    </v-card>
</template>

<script>
import form from "@/mixins/form";
import countryHelper from '@/helper/country';
import FileUpload from "@/components/FileUpload";
import ErrorHandler from "@/components/ErrorHandler";
import user from "@/domain/User/Mixins/user";
import FilesPreview from "@/components/FilesPreview.vue";
import UserIdentityVerification from "@/domain/User/Widgets/IdentityVerification.vue";

export default {
  name: "IdVerificationForm",
  mixins: [form, user],
  components: {
    UserIdentityVerification,
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
              label: 'Drivers License',
              value: 'DRIVERS_LICENSE',
              validator: v => {
                return /^[a-zA-Z0-9]{6,10}$/i.test(v) || 'Format should be *B0000000'
              }
            },
            {
                label: 'Passport',
                value: 'PASSPORT',
                validator: v => {
                    // return /^(?i)G[a-zA-Z0-9]{7,9}$/i.test(v) || 'Format should be *G0000000'
                }
            },
            {
              label: 'SSNIT',
              value: 'SSNIT',
              validator: v => {
                return /^[a-zA-Z]{1}[a-zA-Z0-9]{12,14}$/i.test(v) || 'Format should be *C000000000000'
              }
            },
            {
              label: 'Voter ID',
              value: 'VOTER_ID',
              validator: v => {
                return /^[0-9]{10,12}$/.test(v) || 'Format should be 0000000000'
              }
            },
            {
              label: 'New Voter ID',
              value: 'NEW_VOTER_ID',
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
              label: 'Alien Card',
              value: 'ALIEN_CARD',
              validator: v => {
                return /^[0-9]{6,9}$/.test(v) || 'Format should be 000000'
              }
            },
            {
              label: 'National ID',
              value: 'NATIONAL_ID',
              validator: v => {
                return /^[0-9]{1,9}$/.test(v) || 'Format should be 00000000'
              }
            },
            {
              label: 'Passport',
              value: 'PASSPORT',
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
              label: 'BVN',
              value: 'BVN',
              validator: v => {
                return /^[0-9]{11}$/.test(v) || 'Formmat should be 00000000000'
              }
            },
            {
              label: 'NIN',
              value: 'NIN',
              validator: v => {
                return /^[0-9]{11}$/.test(v) || 'Format should be 00000000000'
              }
            },
            {
              label: 'NIN Slip',
              value: 'NIN_SLIP',
              validator: v => {
                return /^[0-9]{11}$/.test(v) || 'Format should be 00000000000'
              }
            },
            {
              label: 'Drivers License',
              value: 'DRIVERS_LICENSE',
              validator: v => {
                return /^[a-zA-Z]{3}([ -]{1})?[A-Z0-9]{6,12}$/i.test(v) || 'Format should be *ABC000000000';
              }
            },
            {
              label: 'Voter ID',
              value: 'VOTER_ID',
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
              label: 'National ID',
              value: 'NATIONAL_ID',
              validator: v => {
                return /^[0-9]{13}$/.test(v) || 'Format should be 0000000000000'
              }
            },
            {
              label: 'National ID, No Photo',
              value: 'NATIONAL_ID_NO_PHOTO',
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
              label: 'National ID, No Photo',
              value: 'NATIONAL_ID_NO_PHOTO',
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
    verification: Object,
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
              label: 'National ID',
              value: 'NATIONAL_ID',
              validator: v => true
            },
            {
              label: 'Drivers License',
              value: 'DRIVERS_LICENSE',
              validator: v => true
            },
            {
              label: 'Passport',
              value: 'PASSPORT',
              validator: v => true
            },
          ]
        }
      })
    },

    idTypesOption() {
      if(!this.form.country) return [];
      return this.countryList.find(c => c.value === this.form.country).id_types;
    },

    idType() {
      if(!this.form.id_type) return null;
      return this.idTypesOption.find(type => type.value === this.form.id_type);
    }
  },

  methods: {
    setForm() {
      const verification = this.verification || {}
      this.form = {
        first_name: verification.first_name || null,
        last_name: verification.last_name || null,
        country: verification.country || null,
        id_type: verification.id_type || null,
        id_number: verification.id_number || null,
        id_image: verification.id_image || null
      }
    },

    submission() {
      if(!this.$refs.form.validate()) return Promise.resolve();
      if(!this.form.id_image) return Promise.reject(new Error("Upload your "+this.form.id_type))
      return new Promise((resolve, reject) => {
          if(!this.form.id_image) throw new Error("Upload your "+this.form.id_type);
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
<template>
    <app-layer ref="app">
        <v-row justify="center">
            <v-col cols="12" md="8">
              <div class="d-flex justify-space-between align-center">
                <div class="d-flex align-center mb-5">
                  <business-image-form
                    :business="currentBusiness"
                    @updated="image => businessUpdated({ image })"
                    title="Update profile image"
                  />
                  <div class="ml-3">
                    <h2>{{ currentBusiness.name }}</h2>
                    <small class="text-capitalize">{{ currentBusiness.address | nullable }}</small>
                    <div class="d-flex align-center mb-5 ">
                      <small>Owner - </small>
                      <div
                          v-if="owner"
                          class="d-flex align-center ml-2">
                        <profile-avatar
                            :profile="owner"
                            :size="20"
                            color="accent"
                        />
                        <div class="ml-1">
                          <small>{{ owner.full_name }}</small>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
                <business-status :business="currentBusiness" />
              </div>
              <slot>
                <business-details flat
                    :business="currentBusiness"
                    @update="version++"
                    @saved="businessUpdate"
                >
                  <template #actions="{ loading, submitting, submit, canSubmit }">
                    <v-card-actions>
                      <v-btn
                          :loading="submitting"
                          :disabled="loading || !canSubmit"
                          color="primary" depressed
                          @click="submit()"
                      >
                        Save Changes
                      </v-btn>
                    </v-card-actions>
                  </template>
                </business-details>
              </slot>
            </v-col>
        </v-row>
    </app-layer>
</template>

<script>
    import AppLayer from '@/AppLayer.vue';
    import current_business from "@/domain/Business/Mixins/current_business";
    import ProfileAvatar from "@/components/ProfileAvatar.vue";
    import BusinessStatus from "@/domain/Business/Components/BusinessStatus.vue";
    import BusinessDetails from "@/domain/Business/Components/BusinessDetailsForm.vue";
    import current_user from "@/domain/User/Mixins/current_user";
    import BusinessImageForm from "@/domain/Business/Components/BusinessImageUpdate.vue";

    export default {
        name: "BusinessProfilePage",
        mixins:[current_user, current_business],
        components: {
          BusinessImageForm,
          BusinessDetails, BusinessStatus, ProfileAvatar, AppLayer
        },
        data() {
          return {
            version: 0,
            loading: false,
            users: []
          }
        },
        computed: {
          owner() {
            return this.currentBusiness?.owner?.user;
          },
        },

        methods: {
          businessUpdate(update) {
            if(update.id === this.currentBusiness?.id) {
              this.businessUpdated(update)
            } else {
              this.SNACKBAR({
                status: true,
                text: 'Business updated successfully',
                color: 'success'
              })
            }
          },
        }
    }
</script>



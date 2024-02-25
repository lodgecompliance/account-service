<template>
    <section>
      <v-dialog
          v-model="createBusinessDialog"
          width="400"
          persistent
      >
        <v-card>
          <v-card-title>Create Business</v-card-title>
          <v-card-text>
            <business-details @saved="b => $emit('business-created', b)">
              <template #actions="{ loading, submitting, submit }">
                <v-card-actions>
                  <v-btn text color="red" @click="createBusinessDialog = false">Cancel</v-btn>
                  <v-spacer></v-spacer>
                  <v-btn
                      :loading="submitting"
                      :disabled="loading"
                      color="primary"
                      @click="submit()"
                  >
                    Create Business
                  </v-btn>
                </v-card-actions>
              </template>
            </business-details>
          </v-card-text>
        </v-card>
      </v-dialog>
      <data-container :loading="loading">
        <section v-if="business">
          <div class="d-flex justify-space-between align-center">
            <div class="d-flex align-center mb-5">
              <profile-avatar
                  :profile="business"
                  :size="80"
                  color="accent"
              >
                <template #icon="{ size }">
                  <v-icon color="primary" :size="size">mdi-briefcase-account</v-icon>
                </template>
              </profile-avatar>
              <div class="ml-3">
                <h2>{{ business.name }}</h2>
                <small class="text-capitalize">{{ business.address | nullable }}</small>
                <div class="d-flex align-center mb-5 ">
                  <small>Owner - </small>
                  <div
                      v-if="admin"
                      class="d-flex align-center ml-2">
                    <profile-avatar
                        :profile="admin"
                        :size="20"
                        color="accent"
                    />
                    <div class="ml-1">
                      <small>{{ admin.full_name }}</small>
                    </div>
                  </div>
                </div>

              </div>
            </div>
            <business-status :business="business" />
          </div>

          <stepper ref="stepper" :steps="stepIndex" non-linear class="box-shadow-unset">

            <template #header="{ steps: steppers }">
              <v-stepper-header class="box-shadow-unset">
                <template v-for="(step, n) in steppers">
                  <v-divider :key="`${step}-step-header-divider-start`"></v-divider>
                  <v-stepper-step
                      :key="`${step}-step-header`"
                      :step="n+1"
                      editable complete
                      :edit-icon="steps[step].icon"
                  >
                    {{ steps[step].title }}
                  </v-stepper-step>
                  <v-divider
                      :key="`${step}-step-header-divider-end`"
                  ></v-divider>
                </template>
              </v-stepper-header>
            </template>

            <template #details="{ previousStep, nextStep, isFirstStep, isLastStep }">
              <div class="text-center my-3">
                <h2>{{ steps.details.title }}</h2>
              </div>

              <business-details
                  :business="business"
                  @update="steps.details.component.version++"
                  v-on="$listeners"
                  @saved="update => $emit('business-updated', update)"
              >
                <template #actions="{ loading, submitting, submit, canSubmit }">
                  <v-card-actions class="mt-5">
                    <v-btn
                        v-if="!isFirstStep"
                        outlined
                        color="black"
                        @click="previousStep"
                    >
                      <v-icon>mdi-arrow-left</v-icon>
                      Back
                    </v-btn>
                    <v-btn
                        v-if="!isLastStep"
                        outlined
                        color="black"
                        @click="nextStep"
                    >
                      <v-icon>mdi-arrow-right</v-icon>
                      Next
                    </v-btn>
                    <v-spacer></v-spacer>
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
            </template>

            <template #users="{ previousStep, nextStep, isFirstStep, isLastStep }">
              <div class="text-center my-3">
                <h2>{{ steps.users.title }}</h2>
              </div>
              <business-users :business="updatedBusiness" />
            </template>
          </stepper>

        </section>
      </data-container>
    </section>
</template>

<script>
import Stepper from "@/components/Stepper";
import BusinessDetails from "@/domain/Business/Components/BusinessDetailsForm";
import ProfileAvatar from "@/components/ProfileAvatar.vue";
import BusinessUsers from "@/domain/Business/Widgets/BusinessUsers.vue";
import BusinessStatus from "@/domain/Business/Components/BusinessStatus.vue";
import business from "@/domain/Business/Mixins/business";
import DataContainer from "@/components/DataContainer.vue";
export default {
  name: "BusinessAccount",
  mixins: [business],
  components: {
    DataContainer, BusinessStatus, BusinessUsers, ProfileAvatar, BusinessDetails, Stepper },
  data(){
    return {
      loading: false,
      createBusinessDialog: false,
      steps: {
        details: {
          title: "Business Details",
          icon: "mdi-briefcase-check",
          component: {
            version: 1
          },
        },
        users: {
          title: "Business Users",
          icon: "mdi-account-group",
          component: {
            version: 1
          },
        }
      },
      users: [],
    }
  },

  props: {
    business: Object
  },

  computed: {
    stepIndex() {
      return ["details", "users"];
    },
    admin() {
      return (this.users || []).find(user => user.id === 'admin')?.user;
    },
    updatedBusiness() {
      return {
        ...this.business,
        users: this.users
      }
    }
  },

  methods: {
    getBusinessUsers() {
      this.loading = true;
      this.getBusinessById(this.business.id, `
        users {
            id
            user {
                id
                first_name
                last_name
                full_name
                email
                phone
                account_type
                status
                image
            }
          }
      `)
      .then(business => {
        this.users = (business?.users || [])
      }).finally(() => this.loading = false)
    }
  },
  mounted() {
    this.createBusinessDialog = this.$route.query.action === 'create-business'
  },
  watch: {
    business: {
      immediate: true,
      handler(business) {
        if(!business) return;
        if(business.users) this.users = business.users;
        else this.getBusinessUsers()
      }
    }
  }
}
</script>



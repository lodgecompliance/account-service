<template>
    <stepper
    :steps="stepIndex"
    @results="onResult"
    v-on="$listeners"
    class="box-shadow-unset"
    >

      <template #personalInfo="{ previousStep,  stepCompleted }">
          <div class="text-center">
          <h2>{{ steps.personalInfo.title }}</h2>
          <p class="grey--text">{{ steps.personalInfo.description }}</p>
          </div>
          <component
              :is="steps.personalInfo.component.name"
              :key="steps.personalInfo.component.version"
              :pendingUser="pendingUser"
              @update="steps.personalInfo.component.version++"
              @completed="stepCompleted"
          >
          <template #actions="{ loading, submitting, submit }">
              <v-card-actions>
              <v-spacer></v-spacer>
  <!--                    <v-btn text @click="cancelOnboarding">-->
  <!--                      Cancel-->
  <!--                    </v-btn>-->
              <v-btn
                  :loading="submitting"
                  :disabled="loading"
                  color="primary"
                  @click="submit()"
              >
                  Continue
              </v-btn>
              </v-card-actions>
          </template>
          </component>
      </template>

      <template #accountType="{ previousStep, nextStep, isFirstStep, isLastStep,  stepCompleted }">
          <div class="text-center">
            <h2>{{ steps.accountType.title }}</h2>
            <p class="grey--text">{{ steps.accountType.description }}</p>
          </div>
          <component
              :is="steps.accountType.component.name"
              :key="steps.accountType.component.version"
              :pendingUser="pendingUser"
              @update="steps.accountType.component.version++"
              @completed="stepCompleted"
          >
          <template #actions="{ loading, submitting, submit }">
              <v-card-actions>
                <v-btn
                    v-if="!isFirstStep"
                    outlined
                    color="black"
                    @click="previousStep"
                >
                  <v-icon>mdi-arrow-left</v-icon>
                  Back
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                  :loading="submitting"
                  :disabled="loading"
                  color="primary"
                  @click="submit()"
              >
                  Continue
              </v-btn>
              </v-card-actions>
          </template>
          </component>
      </template>

      <template #idVerification="{ previousStep, nextStep, isFirstStep, isLastStep,  stepCompleted }">
          <div class="text-center">
              <h2>{{ steps.idVerification.title }}</h2>
              <p class="grey--text">{{ steps.idVerification.description }}</p>
          </div>
          <component
              :is="steps.idVerification.component.name"
              :key="steps.idVerification.component.version"
              @update="steps.idVerification.component.version++"
              @completed="stepCompleted"
          >
              <template #actions="{ loading, submitting, submit }">
              <v-card-actions>
                  <v-btn
                      v-if="!isFirstStep"
                      outlined
                      color="black"
                      @click="previousStep"
                  >
                    <v-icon>mdi-arrow-left</v-icon>
                    Back
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn
                      :loading="submitting"
                      :disabled="loading"
                      color="primary"
                      @click="submit()"
                  >
                  Continue
                  </v-btn>
              </v-card-actions>
              </template>
          </component>
      </template>

      <template #businessInfo="{ previousStep, nextStep, isFirstStep, isLastStep,  stepCompleted }">
          <div class="text-center">
            <h2>{{ steps.businessInfo.title }}</h2>
            <p class="grey--text">{{ steps.businessInfo.description }}</p>
          </div>
          <component
              :is="steps.businessInfo.component.name"
              :key="steps.businessInfo.component.version"
              @update="steps.businessInfo.component.version++"
              @completed="stepCompleted"
          >
            <template #actions="{ loading, submitting, submit }">
              <v-card-actions>
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
                    :disabled="loading"
                    color="primary"
                    @click="submit()"
                >
                  Continue
                </v-btn>
              </v-card-actions>
            </template>
          </component>
      </template>

    </stepper>
</template>

<script>
    import Stepper from "@/components/Stepper";
    import PersonalInfo from "./PersonalInfo";
    import AccountType from "./AccountType";
    import IdVerification from "./IdVerification";
    import BusinessDetails from "./BusinessDetails";

    export default {
        name: 'UserOnBoard',
        components:{
          Stepper, PersonalInfo, AccountType, IdVerification, BusinessDetails
        },
        data(){
            return {
              stepIndex: ["personalInfo", "accountType", "idVerification"],
              steps: {
                personalInfo: {
                  title: "Personal Info",
                  description: "Complete your account setup",
                  component: {
                    name: "personal-info",
                    version: 1
                  },
                },
                accountType: {
                  title: "Account Type",
                  description: "What type of account are you creating? How do you want to interact with Lodge Compliance? Kindly note that once your account is created, we cannot change this information.",
                  component: {
                    name: "account-type",
                    version: 1
                  },
                },
                idVerification: {
                  title: "ID Verification",
                  description: "Kindly verify your identity by using anyone of these",
                  component: {
                    name: "id-verification",
                    version: 1
                  },
                },
                businessInfo: {
                  title: "Business Details",
                  description: "Select document type",
                  component: {
                    name: "business-details",
                    version: 1
                  },
                }
              },
            };
        },

        props: {
            pendingUser: Object
        },

        methods: {
          onResult({ result, lastStep }) {
            if(lastStep) return;
            const businessInfo = "businessInfo"
            const businessStepIndex = this.stepIndex.findIndex(i => i === businessInfo)
            if(result.accountType === "business") {
              if(businessStepIndex < 0) this.stepIndex.push(businessInfo)
            } else {
               if(businessStepIndex >= 0) this.stepIndex.splice(businessStepIndex,1);
            }
          },
        }
    }
</script>
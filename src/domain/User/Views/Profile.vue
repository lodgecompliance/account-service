<template>
  <app-layer ref="app">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <div class="d-flex justify-space-between">
          <div class="d-flex align-center mb-5">
            <user-avatar-update
                :user="profile"
                @updated="a => $emit('avatar-updated', a)"
                title="Update profile image"
            />
            <div class="ml-3">
              <h3>{{ profile.full_name }}</h3>
              <small v-if="profile.email" class="grey--text">{{ profile.email }}</small>
              <small v-else-if="profile.phone" class="grey--text">{{ profile.phone }}</small>
              <div class="d-flex align-center">
                <v-chip label class="text-capitalize" small>{{ profile.account_type }}</v-chip>
              </div>
            </div>
          </div>
          <v-btn
              v-if="profile.account_type === 'business'"
              @click="createBusiness = true" small text color="primary">
            <v-icon>mdi-plus</v-icon> Create Business
          </v-btn>
        </div>
        <slot>
          <personal-info
              flat
              :key="version"
              @update="version++"
              @saved="profileUpdated"
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
          </personal-info>
        </slot>
        <corner-dialog
            v-model="createBusiness"
            width="400"
            persistent
        >
          <business-details @saved="newBusinessCreated">
            <template #header>
              <v-card-title class="d-flex justify-space-between">
                Create Business
                <v-btn icon @click="createBusiness = false">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-card-title>
            </template>
            <template #actions="{ loading, submitting, submit }">
              <v-card-actions>
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
        </corner-dialog>
      </v-col>
    </v-row>
  </app-layer>
</template>

<script>

import PersonalInfo from "@/domain/User/Components/PersonalInfoForm";
import UserAvatarUpdate from "@/domain/User/Components/UserAvatarUpdate";
import current_user from "@/domain/User/Mixins/current_user";
import AppLayer from "@/AppLayer.vue";
import BusinessDetails from "@/domain/Business/Components/BusinessDetailsForm.vue";
import CornerDialog from "@/components/CornerDialog.vue";

export default {
  name: "UserProfilePage",
  mixins: [current_user],
  components: {
    CornerDialog,
    BusinessDetails,
    AppLayer,
    UserAvatarUpdate,
    PersonalInfo,
  },
  data(){
    return {
      version: 0,
      createBusiness: false,
    }
  },
}
</script>



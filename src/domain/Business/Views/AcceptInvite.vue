<template>
  <v-card max-width="800" class="mx-auto mt-16">
    <v-container>
      <v-row dense>
        <v-col cols="12" v-if="loading">
          <div class="text-center">
            <v-progress-circular
                indeterminate
                color="red"
            ></v-progress-circular>
          </div>
        </v-col>
        <v-col cols="12" v-else>
          <div v-if="business">
            <div class="text-left" v-if="currentUserAuth">
              <p>
                <v-icon large color="primary darken-2">
                  mdi-account-multiple-plus-outline
                </v-icon>
                <span class="pl-5">Hello, {{ currentUserAuth.displayName }}</span>
              </p>
            </div>
            <div class="text-left pt-4">
              <p><strong>{{ business.name }}</strong> has invited you to manage <strong class="primary--text" v-if="property">{{ property.name }}</strong> Property</p>
              <p>Kindly click "Accept" button below to accept this invitation or click on "Decline" to decline the request.</p>
            </div>
            <div class="d-flex justify-space-between align-center pt-16">
              <v-btn @click="acceptInvitation" :loading="submitting" class="ma-2" color="primary" dark>
                Accept
                <v-icon dark right>
                  mdi-checkbox-marked-circle
                </v-icon>
              </v-btn>

              <v-btn @click="cancelInvitation" class="ma-2" color="red" dark>
                Decline
                <v-icon dark right>
                  mdi-cancel
                </v-icon>
              </v-btn>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import auth from "@/mixins/auth";
import user from "@/domain/User/Mixins/user";
import business from "@/domain/Business/Mixins/business";

export default {
      name: "AcceptInvitePage",
      mixins: [user, auth, business],
      data() {
        return {
          business: null,
          property: null,
          propertyUser: null,
          loading: true,
          submitting: false,
          error: null,
        }
      },
      computed: {
        businessId() {
          return this.$route.params.businessId;
        },
        propertyId() {
          return this.$route.params.propertyId;
        },
        authUserMatchInvitedUser() {
          if(!this.business) return false;
          const match = Object.values(this.business.users).find(
              (user) => user.email === this.currentUserAuth.email
          );
          return typeof match !== "undefined" && match !== null;
        }
      },
      methods: {
        redirectToAccount() {
          window.location.replace('/profile');
        },
        redirectToBusiness() {
          window.location.replace('/businesses');
        },
        acceptInvitation() {
          this.submitting = true;
          this.updateBusinessUser(this.business.id, this.propertyUser.id, {
            user_id: this.currentUserAuth.uid,
            email: this.propertyUser.email,
            role: this.propertyUser.role,
            properties: this.propertyUser.properties,
          }).then(response => {
            this.submitting = false;
            this.$store.commit("SNACKBAR", {
              status: true,
              text: `Invitation accepted successfully!`,
              color: 'success'
            });
           this.redirectToBusiness();
          });
        },
        cancelInvitation() {
          this.redirectToAccount();
        },
        businessDetails(id) {
          this.loading = true;
          this.getBusinessById(id, `
              id
              name
              status
              users {
                  id
                  role
                  email
                  status
                  user_id
                  permissions
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
                  properties {
                    id
                    enabled
                    permissions
                  }
                }
                properties {
                  id
                  name
                  email
                  phone
                  address
                }
            `)
              .then(business => {
                this.business = business;
                this.loadPropertyDetails();
              })
              .catch(e => { this.error = e })
              .finally(() => {
                if (this.authUserMatchInvitedUser) {
                  this.propertyUser = Object.values(this.business.users).find(
                      (user) => user.email === this.currentUserAuth.email
                  );
                  if (this.propertyUser.user_id && this.propertyUser.user_id.length > 0) {
                    this.redirectToBusiness();
                  } else {
                    this.loading = false;
                  }

                } else {
                  this.redirectToAccount();
                }
              });
        },

        loadPropertyDetails() {
          if (this.business) {
            const businessProperty = Object.values(this.business.properties).find(
                (property) => property.id === this.propertyId
            );
            if (businessProperty) {
              this.property = businessProperty;
            }
          }
        }
      },

      watch: {
        businessId: {
          immediate: true,
          handler(id) {
            if(id) this.businessDetails(id);
          }
        }
      }
    }
</script>



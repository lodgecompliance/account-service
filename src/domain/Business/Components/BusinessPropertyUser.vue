<template>
  <v-container>
    <v-dialog
        v-model="dialog"
        width="600"
        scrollable
        persistent
    >
      <v-card :loading="loading">
        <v-card-title class="justify-space-between">
          <h4 class="headline">
            <v-icon class="mr-2" v-text="isEdit ? 'mdi-account' : 'mdi-account-plus'"></v-icon>
            <span>{{ !isEdit ? 'Add User' : 'Property User' }}</span>
          </h4>
          <div v-if="isEdit">
            <v-btn
                icon
                title="Remove user"
                color="red"
                small
                @click="$refs.removalConfirmation.open()">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </div>

        </v-card-title>
        <v-divider></v-divider>
        <v-card-text >
          <div v-if="inviteUrl && !confirmed" class="my-3">
            <clip-board  v-model="inviteUrl" />
            <p class="gray--text">Invitation URL</p>
          </div>
          <v-form ref="form" class="pt-5" @submit.prevent>

            <v-text-field
                v-if="!user || !user.confirmed_at"
                outlined dense
                label="Email"
                :rules="[rules.required, rules.email]"
                type="email"
                v-model="form.email"
            ></v-text-field>
            <v-list-item v-else class="mb-3">
              <v-list-item-avatar>
                <v-avatar color="primary" size="40" class="mr-2">
                  <span class="white--text headline">{{avatarText}}</span>
                </v-avatar>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ userName }}</v-list-item-title>
                <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-text-field
                outlined dense
                label="Role"
                :rules="[rules.required]"
                type="text"
                v-model="form.role"
            ></v-text-field>

            <v-switch
                v-model="form.active"
                inset dense
                :label="`Active`"
            >
            </v-switch>
            <data-container :loading="loadingPermissions">
              <h4>Permissions to Property</h4>
              <v-list-item-group
                  v-if="propertyPermissions.length"
                  v-model="form.propertyPermissions"
                  multiple
                  active-class=""
              >
                <v-list-item v-for="permission in propertyPermissions" :key="permission.id">
                  <template v-slot:default="{ active }">
                    <v-list-item-action>
                      <v-checkbox :input-value="active"></v-checkbox>
                    </v-list-item-action>

                    <v-list-item-content>
                      <v-list-item-title>{{ permission.label }}</v-list-item-title>
                      <v-list-item-subtitle>{{ permission.description }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </template>
                </v-list-item>
              </v-list-item-group>
              <div v-else class="pa-5 text-center">
                No reservation permission
              </div>

              <h4>Permissions to Reservation</h4>
              <v-list-item-group
                  v-if="reservationPermissions.length"
                  v-model="form.reservationPermissions"
                  multiple
                  active-class=""
              >
                <v-list-item v-for="permission in reservationPermissions" :key="permission.id">
                  <template v-slot:default="{ active }">
                    <v-list-item-action>
                      <v-checkbox :input-value="active"></v-checkbox>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>{{ permission.label }}</v-list-item-title>
                      <v-list-item-subtitle>{{ permission.description }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </template>
                </v-list-item>
              </v-list-item-group>
              <div v-else class="pa-5 text-center">
                No reservation permission
              </div>
            </data-container>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" @click="dialog = false" text>Cancel</v-btn>
          <v-btn @click="submit"
                 color="primary"
                 :loading="loading"
                 :disabled="loadingPermissions"
          >{{ isEdit ? 'Update' : 'Add' }}  user</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <confirmation v-if="isEdit" ref="removalConfirmation" @confirmed="removeUser">
      <p class="text-center">
        Are you sure you want to remove {{ userName }} from {{ property.name }}
      </p>
    </confirmation>
  </v-container>
</template>

<script>
import DataContainer from '../../../components/DataContainer.vue';
import ClipBoard from '../../../components/Utilities/ClipBoard.vue';
import Confirmation from '../../../components/Utilities/ConfirmationDialog.vue'

import GET_PROPERTY_PERMISSIONS from '../Queries/getPropertyPermissions';
import CREATE_PROPERTY_USER from '../Mutations/createPropertyUser';
import UPDATE_PROPERTY_USER from '../Mutations/updatePropertyUser';
import REMOVE_PROPERTY_USER from '../Mutations/removePropertyUser';
import formValidations from '../../../helper/formValidation'

export default {
  name: "PropertyUserForm",
  components: {
    DataContainer, ClipBoard, Confirmation,
  },
  props: {
    property: Object,
    user: Object,
  },
  data(){
    return {
      dialog: false,
      loading: false,
      rules: formValidations.rules,
      form: {
        email: null,
        role: null,
        propertyPermissions: [],
        reservationPermissions:[]
      },
      permissions: null,
      loadingPermissions: false,
    }
  },
  computed: {
    propertyPermissions() {
      return this.permissions && this.permissions.property ? this.permissions.property : []
    },

    reservationPermissions() {
      return this.permissions && this.permissions.reservation ? this.permissions.reservation : []
    },

    isEdit() {
      return !!this.user;
    },

    inviteUrl() {
      if(!this.user) return null;
      return this.url(this.$router.resolve({ name: 'property.user.invite',
        params: {
          propertyId: this.property.id,
          inviteId: this.user.id,
        }
      }).href);
    },

    userName() {
      if(!this.user) return null;
      if (this.user.user && this.user.user.name) {
        return [this.user.user.name.first_name, this.user.user.name.last_name].join(' ');
      }
      return this.user.email
    },
    avatarText() {
      if(!this.userName) return '';
      return this.userName.substring(0,1);
    },
    confirmed() {
      return this.user && this.user.confirmed_at ? true : false;
    }


  },

  methods: {
    open() {
      this.dialog = true;
    },
    close() {
      this.dialog = false;
    },

    submit() {
      if(!this.$refs.form.validate()) {
        this.$store.commit("SNACKBAR", {
          status: true,
          text: "Incomplete information",
          color: "error"
        });
        return;
      }

      const data = {
        email: this.form.email,
        role: this.form.role,
        active: this.form.active,
        permissions: this.form.propertyPermissions.map(p => this.propertyPermissions[p])
            .concat(this.form.reservationPermissions.map(p => this.reservationPermissions[p]))
            .map(p => p.id),
      }

      this.loading = true;

      if(this.isEdit) {
        this.$store.dispatch('mutate', {
          mutation: UPDATE_PROPERTY_USER,
          variables: {
            property_id: this.property.id,
            invite_id: this.user.id,
            data,
          }
        })
            .then(response => {
              this.$store.commit("SNACKBAR", {
                status: true,
                text: "Property user updated.",
                color: "success"
              });
              this.$emit('updated', response.data.updatePropertyUser);
            })
            .catch(e => {
              this.$store.commit('TOAST_ERROR', {
                show: true,
                retry: () => this.addUser(),
                message: 'Could not update user.',
                exception: e
              })
            })
            .finally(() => {
              this.loading = false;
            });
      } else {
        this.$store.dispatch('mutate', {
          mutation: CREATE_PROPERTY_USER,
          variables: {
            property_id: this.property.id,
            data,
          }
        })
            .then(response => {
              this.$store.commit("SNACKBAR", {
                status: true,
                text: "Property user added",
                color: "success"
              });
              this.$emit('created', response.data.createPropertyUser);
            })
            .catch(e => {
              this.$store.commit('TOAST_ERROR', {
                show: true,
                retry: () => this.addUser(),
                message: 'Could not add user.',
                exception: e
              })
            })
            .finally(() => {
              this.loading = false;
            });
      }
    },

    getPermissions() {
      this.loadingPermissions = true;

      this.$store.dispatch('query', {
        query: GET_PROPERTY_PERMISSIONS
      })
          .then(response => {
            this.permissions = response.data.getPropertyPermissions;
            if(this.user) {
              this.form = {
                ...this.form,
                propertyPermissions: this.user.permissions.map(p => this.propertyPermissions.findIndex(x => x.id === p)).filter(p => p >= 0 ),
                reservationPermissions: this.user.permissions.map(p => this.reservationPermissions.findIndex(x => x.id === p)).filter(p => p >= 0 )
              }
            }
          })
          .catch(e => {
            this.$store.commit('TOAST_ERROR', {
              show: true,
              retry: () => this.getPermissions(),
              message: 'Could not get property permissions',
              exception: e
            })
          })
          .finally(() => {
            this.loadingPermissions = false;
          })
    },

    removeUser() {
      this.loading = true;

      this.$store.dispatch('mutate', {
        mutation: REMOVE_PROPERTY_USER,
        variables: {
          property_id: this.property.id,
          invite_id: this.user.id,
        }
      })
          .then(response => {
            if(response.data.removePropertyUser) {
              this.$store.commit("SNACKBAR", {
                status: true,
                text: `${this.userName} removed from ${this.property.name}`,
                color: "success"
              });
              this.$emit('removed', this.user);
            }
          })
          .catch(e => {
            this.$store.commit('TOAST_ERROR', {
              show: true,
              retry: () => this.removeUser(),
              message: 'Could not remove user.',
              exception: e
            })
          })
          .finally(() => {
            this.loading = false;
          });
    },
  },

  watch: {
    user: {
      immediate: true,
      handler(user){
        if(user) {
          this.form = {
            email: user.email,
            role: user.role,
            active: user.active
          }
        }
        this.getPermissions();
      }
    }
  }
}
</script>
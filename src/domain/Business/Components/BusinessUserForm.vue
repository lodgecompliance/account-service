<template>
  <v-card :loading="loading" :disabled="loading">
    <slot name="header">
      <v-card-title class="d-flex justify-space-between">
        <span v-if="!businessUser">Add User</span>
        <span v-else>Business User</span>
        <v-btn icon @click="cancel">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
    </slot>
    <v-card-text class="pt-4">
      <v-form ref="form">

        <div v-if="user" class="d-flex justify-space-between mb-5">
          <div class="d-flex align-center">
            <profile-avatar
                :profile="user"
                color="accent"
            >
              <template #icon="{ size }">
                <v-icon color="primary" :size="size">mdi-domain</v-icon>
              </template>
            </profile-avatar>
            <div class="ml-2">
              <div>{{ user.full_name }}</div>
              <small class="grey--text">{{ user.email }}</small>
            </div>
          </div>
          <v-switch
              v-model="form.status"
              inset dense
              label="Enable"
              false-value="disabled"
              true-value="enabled"
              class="ml-2"
          >
          </v-switch>
        </div>

        <v-text-field
            v-model="form.role"
            dense
            outlined
            label="Role*"
            placeholder="Enter user role"
            :rules="[rules.required]"
        ></v-text-field>

        <v-text-field
            v-model="form.email"
            dense
            outlined
            label="Email*"
            placeholder="Enter email"
            :rules="[rules.required]"
        ></v-text-field>

        <h4 class="headline">Property Accesses</h4>
        <v-expansion-panels v-if="form.properties.length" focusable v-model="propertiesPanel">
          <v-expansion-panel
              v-for="(property, i) in form.properties"
              :key="property.id"
          >
            <v-expansion-panel-header>
              {{ property.id ? ((business.properties || []).find(p => p.id === property.id) || {}).name : 'Select Property' }}
            </v-expansion-panel-header>
            <v-expansion-panel-content class="pt-3">
              <business-user-property-form
                  :property="property"
                  :properties="business.properties"
                  :excluded-properties="form.properties.map(p => p.id)"
                  v-model="form.properties[i]"
                  @unassign="removeProperty(i)"
              />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <div v-else class="text-center grey--text py-5">No access to any property</div>
        <div class="d-flex mt-3">
          <v-btn @click="addProperty" color="primary" small text>Assign Property</v-btn>
        </div>
        <error-handler :error="formError" />

      </v-form>
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
          {{ businessUser ? 'Update User' : 'Add User' }}
        </v-btn>
      </v-card-actions>
    </slot>
  </v-card>
</template>

<script>
import form from "@/mixins/form";
import ErrorHandler from "@/components/ErrorHandler";
import { mapMutations } from "vuex";
import ProfileAvatar from "@/components/ProfileAvatar";
import business from "@/domain/Business/Mixins/business";
import BusinessUserPropertyForm from "@/domain/Business/Components/BusinessUserPropertyForm.vue";

export default {
  name: "BusinessUserForm",
  mixins:[form, business],
  components: {
    BusinessUserPropertyForm,
    ProfileAvatar,
    ErrorHandler
  },
  data() {
    return {
      loading: false,
      propertiesPanel: null,
    }
  },

  props: {
    business: Object,
    businessUser: Object,
  },

  computed: {
    user() {
      return this.businessUser?.user
    }
  },

  methods: {
    ...mapMutations(['SNACKBAR']),
    cancel() {
      this.$refs.form.reset();
      this.$emit("cancel")
    },

    setForm() {
      const bu = this.businessUser || {}
      this.form = {
        role: bu.role || null,
        email: bu.email || null,
        status: bu.status || 'disabled',
        properties: bu.properties || []
      }
    },
    addProperty() {
      this.form.properties.unshift({});
      this.propertiesPanel = this.form.properties.length - 1;
    },
    removeProperty(i) {
      this.form.properties.splice(i, 1)
    },
    submission() {
      this.form.properties = this.form.properties.filter(p => !!p.id);
      if(!this.$refs.form.validate()) return Promise.resolve();
      return new Promise((resolve, reject) => {
        (
            this.businessUser
            ? this.updateBusinessUser(this.business.id, this.businessUser.id, this.form)
            : this.createBusinessUser(this.business.id, this.form)
        )
        .then(bu => {
          this.$refs.form.reset()
          this.SNACKBAR({
            status: true,
            text: this.businessUser ? 'User updated' : 'User created',
            color: 'success'
          })
          this.$emit(this.businessUser ? "user-updated" : "user-created", bu);
          resolve(bu);
        }).catch(e => reject(e))
      })
    },
  },
  watch: {
    businessUser: {
      immediate: true,
      handler() {
        this.setForm()
      }
    }
  }
}
</script>
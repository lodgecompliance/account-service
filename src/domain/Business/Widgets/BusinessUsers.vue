<template>
  <section>
    <v-data-table
      :headers="headers"
      :items="users"
      :search="search"
      fixed-header
      height="500"
      :loading="loading"
      v-bind="$attrs"
    >

      <template #no-data>
        <error-handler :error="error" :can-retry="true" @retry="loadUsers" />
      </template>

      <template v-slot:item.user.full_name="{ item }">
        <div v-if="item.user" class="d-flex align-center">
          <profile-avatar
              :profile="item.user"
              color="accent"
              size="40"
          >
            <template #icon="{ size }">
              <v-icon color="primary" :size="size">mdi-account</v-icon>
            </template>
          </profile-avatar>
          <div class="ml-2">
            {{ item.user.full_name }}
          </div>
        </div>
      </template>

      <template v-slot:item.status="{ item }">
        <item-status :status="item.status" />
      </template>

      <template v-slot:item.user.email="{ item }">
        <span>{{ item.user ? item.user.email : item.email }}</span>
      </template>

      <template v-slot:item.action="{ item }">
        <v-btn icon @click="user = item">
          <v-icon>mdi-eye</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <business-user-dialog
        :business="business"
        :business-user="user"
        :has-activator="false"
        @cancel="user = null"
        @user-updated="userUpdated"
    />

  </section>
</template>

<script>
import ProfileAvatar from "@/components/ProfileAvatar.vue";
import ErrorHandler from "@/components/ErrorHandler.vue";
import business from "@/domain/Business/Mixins/business";
import BusinessUserDialog from "@/domain/Business/Widgets/UserDialog.vue";
import ItemStatus from "@/components/ItemStatus.vue";
export default {
  name: 'BusinessUsers',
  mixins: [ business ],
  components:{ItemStatus, BusinessUserDialog, ErrorHandler, ProfileAvatar },
  data(){
    return {
      loading: false,
      users: [],
      user: null,
      error: null,
      headers: [
        { text: 'Name', value: 'user.full_name' },
        { text: 'Role', value: 'role' },
        { text: 'Email', value: 'user.email'},
        { text: 'Account', value: 'user.account_type', sortable: false },
        { text: 'Status', value: 'status', sortable: false },
        { text: 'Actions', value: 'action', sortable: false },
      ]
    };
  },

  props: {
    search: String,
    business: Object
  },

  methods: {

    userCreated(user) {
      this.users.push(user);
    },

    userUpdated(user) {
      this.users = this.updateItemInArray(user, 'id', this.users);
      this.user = null;
    },

    loadUsers() {
      this.loading = true;
      this.getBusinessById(this.business.id, `
          users {
              id
              role
              email
              status
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
        `)
      .then(business => {
        this.users = (business?.users || [])
      })
      .catch(e => { this.error = e })
      .finally(() => this.loading = false)
    }

  },

  watch: {
    business: {
      immediate: true,
      handler(business) {
        if(business) this.loadUsers()
      }
    }
  }
}
</script>

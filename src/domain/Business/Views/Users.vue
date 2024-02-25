<template>

  <business-profile-page>
    <v-row
        justify="space-between"
        class="mb-3"
    >
      <v-col cols="8">
        <search-field v-model="search" />
      </v-col>
      <v-col cols="4" class="text-right">
        <business-user-dialog
            :business="currentBusiness"
            :activator="{ color: 'primary', depressed: true }"
            @user-created="userCreated"
        >
          <v-icon>mdi-plus</v-icon> <span v-show="$vuetify.breakpoint.smAndUp">Add New</span>
        </business-user-dialog>
      </v-col>
    </v-row>
    <business-users
        ref="users"
        :search="search"
        :business="currentBusiness"
    />
  </business-profile-page>

</template>

<script>
    import current_business from "@/domain/Business/Mixins/current_business";
    import BusinessUsers from "@/domain/Business/Widgets/BusinessUsers.vue";
    import BusinessProfilePage from "@/domain/Business/Views/Profile.vue";
    import SearchField from "@/components/Search.vue";
    import BusinessPropertyDialog from "@/domain/Business/Widgets/PropertyDialog.vue";
    import BusinessUserDialog from "@/domain/Business/Widgets/UserDialog.vue";
    export default {
      name: "BusinessUsersPage",
      mixins:[current_business],
      components: {
        BusinessUserDialog,
        SearchField,
        BusinessProfilePage,
        BusinessUsers,
      },
      data() {
        return {
          version: 0,
          search: null,
        }
      },
      methods: {
        userCreated(user) {
          this.$refs.users.userCreated(user);
        }
      },
    }
</script>



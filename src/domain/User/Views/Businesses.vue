<template>
  <user-profile-page>
    <user-businesses
      :user="profile"
      @business-updated="businessUpdate"
    />
  </user-profile-page>
</template>

<script>
import current_user from "@/domain/User/Mixins/current_user";
import UserBusinesses from "@/domain/User/Widgets/UserBusinesses.vue";
import current_business from "@/domain/Business/Mixins/current_business";
import UserProfilePage from "@/domain/User/Views/Profile.vue";

export default {
  name: "UserBusinessesPage",
  mixins:[ current_user, current_business ],
  components: { UserProfilePage, UserBusinesses },
  data() {
    return {
      version: 0,
      createBusiness: false
    }
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
    }
  }
}
</script>



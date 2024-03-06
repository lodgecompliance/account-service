<template>
  <user-profile-page>
    <user-notifications  />
  </user-profile-page>
</template>

<script>
import UserNotifications from '../Widgets/UserNotifications.vue';
import UserProfilePage from "@/domain/User/Views/Profile.vue";
export default {
    name: 'UserNotificationsPage',
    components: {
      UserProfilePage,
      UserNotifications
    }, 
    
    data(){
      return {}
    },
}
</script>

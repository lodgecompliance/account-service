<template>
  <v-card rounded="lg" flat v-bind="$attrs">
    <v-img>
      <section class="px-5 py-3">
        <div class="d-flex align-center">
          <profile-avatar
              :profile="user"
              :size="40"
              color="accent"
          />
          <div class="ml-3">
            <h4>{{ user.full_name }}</h4>
            <small class="grey--text">{{ user.email | nullable }}</small>
          </div>
        </div>
        <slot name="header" />
      </section>
    </v-img>
    <slot />
  </v-card>
</template>

<script>
import ProfileAvatar from "@/components/ProfileAvatar";
export default {
  name: 'UserCard',
  components: {ProfileAvatar},
  data(){
    return {}
  },
  props: {
    user: Object
  }
}
</script>

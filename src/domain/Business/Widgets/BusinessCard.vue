<template>
  <v-card rounded="lg" flat v-bind="$attrs">
    <v-img>
      <section class="pa-5">
        <div class="d-flex align-center">
          <profile-avatar
              :profile="business"
              :size="40"
              color="accent"
          />
          <div class="ml-3">
            <h4>{{ business.name }}</h4>
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
  name: 'BusinessCard',
  components: {ProfileAvatar},
  data(){
    return {}
  },
  props: {
    business: Object
  }
}
</script>

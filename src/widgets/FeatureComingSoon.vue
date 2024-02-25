<template>
  <section>
    <div class="text-center">
      <h3>Feature Coming Soon!</h3>
      <small class="grey--text">We are currently working on this feature. Complete this form to help us address your message.</small>
    </div>
    <v-img
        src="@/assets/img/envelope.png"
         width="100"
        class="mx-auto mt-3"
    ></v-img>
    <contact-form class="mt-10" />
  </section>
</template>

<script>
import ContactForm from "@/widgets/ContactForm";
export default {
  name: "FeatureComingSoon",
  components: {ContactForm}
}
</script>
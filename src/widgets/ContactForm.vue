<template>
  <v-form ref="form">

    <v-autocomplete
        v-model="form.category"
        :items="categories"
        dense
        outlined
        label="Question/Complaint Category"
        placeholder="Select category"
        :rules="[rules.required]"
    >
    </v-autocomplete>

    <v-text-field
        v-model="form.subject"
        dense
        outlined
        label="Subject"
        placeholder="Enter subject"
        :rules="[rules.required]"
    ></v-text-field>

    <v-textarea
        v-model="form.description"
        dense
        outlined
        label="Description"
        placeholder="Type detailed description"
        :rules="[rules.required]"
    >
    </v-textarea>

    <error-handler :error="formError" :can-retry="false" @retry="submit" />

    <v-btn
    color="primary"
    depressed block
    :loading="submitting"
    @click="submit"
    >Submit</v-btn>

  </v-form>
</template>

<script>
import form from "@/mixins/form";
import ErrorHandler from "@/components/ErrorHandler";

export default {
  name: "ContactForm",
  components: {ErrorHandler},
  mixins: [form],
  data() {
    return {
      categories: [
        "Funds Withdrawal"
      ]
    }
  },
  methods: {
    submission() {
      return new Promise((resolve, reject) => {
        if(!this.$refs.form.validate()) return reject({ message: "Some fields are not filled correctly" })
        setTimeout(() => {
          return reject({ message: "Oops! Can't deliver your message at the moment" })
        }, 3000)
      })
    }
  }
}
</script>
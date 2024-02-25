<template>
  <v-row justify="center">
    <v-dialog
      transition="dialog-bottom-transition"
      v-model="dialog"
      persistent
      :max-width="maxWidth"
    >
      <v-card>
        <slot name="header" v-bind="{ close, confirm }">
          <v-card-title class="justify-center">
            <slot name="title">Confirm</slot>
          </v-card-title>
        </slot>
        <v-card-text>
            <slot />
        </v-card-text>
        <slot name="footer" v-bind="{ close, confirm }">
          <v-card-actions class="justify-center">
            <v-btn
                color="primary"
                outlined
                @click="close"
            >
              Cancel
            </v-btn>
            <slot name="confirm" v-bind="{ confirm }">
              <v-btn
                  depressed
                  color="primary"
                  @click="confirm"
              > Confirm
              </v-btn>
            </slot>
          </v-card-actions>
        </slot>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
  export default {
    name: "ConfirmationDialog",
    data () {
      return {
        dialog: false,
      }
    },
    props: {
      maxWidth: {
        default: 300
      }
    },
    methods:{
        open(){
            this.dialog = true;
        },

        close(){
            this.dialog = false;
        },

        confirm(){
            this.$emit('confirmed');
            this.close();
        }
    }
  }
</script>
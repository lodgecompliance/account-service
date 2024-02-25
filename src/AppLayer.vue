<template>
    <div style="min-height:80%">
        <v-snackbar v-model="snackbar.status" 
            :timeout="snackbar.timeout ? snackbar.timeout : 5000"
            :color="snackbar.color"
            top rounded transition="fade-transition"
            >
            <v-row justify="space-around" align="start">
                <v-col cols="11" class="my-0 py-0">
                  {{ snackbar.text ? snackbar.text.replace('GraphQL error:', '').trim() : "" }}
                </v-col>
                <v-col cols="1" class="my-0 py-0">
                    <v-btn icon x-small dark text @click="closeAlert" >
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-col>
            </v-row>
        </v-snackbar>

        <div :class="`px-1 px-sm-2`">
            <slot/>
        </div>
        
    </div>
</template>

<script>
    import { mapMutations, mapGetters } from 'vuex';

    export default {
      name: "AppLayer",
      components: {},
      data(){
          return { }
      },
      computed:{
          ...mapGetters([
              'app_ready',
              'error',
              'current_user',
              'snackbar'
          ]),
      },
      methods: {
          ...mapMutations([
              'SET_APP_STATE',
              'SET_APP_PROCESS',
              'SNACKBAR'
          ]),

          setState(ready, process = ''){
              this.SET_APP_STATE(ready);
              this.SET_APP_PROCESS(process);
          },

          closeAlert(){
              this.SNACKBAR({
                  status: false,
                  color: this.$store.getters.snackbar.color
              })
          }
      },
    }
</script>
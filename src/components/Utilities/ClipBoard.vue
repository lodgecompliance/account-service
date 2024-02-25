<template>
    <div class="d-flex align-center">
      <input type="text" class="flex-grow-1 rounded pa-1 clipboard-input" :id="id" v-model="text" readonly
      />
      <v-btn class="mx-2" v-if="text" @click="copy" color="primary" icon small><v-icon small>mdi-content-copy</v-icon></v-btn>
      <slot name="after-icon" />
    </div>
</template>

<script>
export default {
    name: "ClipBoard",
    data(){
        return {
            text: ''
        }
    },

    computed: {
        id() {
            return `clipboard-input-${this._uid}`
        }
    },

    props: {
        value: String,
        showInput: { default: () => true }
    },

    methods: {
        copy() {
            const input = document.getElementById(this.id);
            input.select();
            if(document.execCommand('copy')){
                this.$store.commit("SNACKBAR", {
                    status: true,
                    text: "Copied to clipboard",
                    color: "success"
                });
            }else{
                this.$store.commit("SNACKBAR", {
                    status: true,
                    text: "Could not copy key to clipboard",
                    color: "error"
                });
            }
        }
    },

    watch: {
        value: {
            immediate: true,
            handler(v){
                if(v){
                    this.text = v;
                }
            }
        }
    }
}
</script>

<style scoped>
    /*.clipboard-input{*/
    /*    padding: 10px;*/
    /*    ;*/
    /*    */
    /*}*/
    .clipboard-input {
      width: 100%;
      outline: none;
      background-color: #f7f7f7;
      border: 2px dashed #eee
    }
</style>
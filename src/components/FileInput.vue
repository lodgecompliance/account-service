<template>
  <div class="form-group">
    <label :for="$attrs.id" v-if="$attrs.label">{{ $attrs.label }}</label>
    <div :for="`file-input-${_uid}`">
      <div ref="dropzone" @click="selectNewFile" >
        <div class="text-center rounded-md p-10 border-primary-300 border-2 border-dashed p-3" :class="{'bg-primary-100 text-primary-900': fileOnDropzone }">

          <div v-if="fileOnDropzone" class="text-primary-900 my-2 bg-primary-100 text-center text-xl">You can drop the file now</div>

          <div v-else>
            <slot>
              <div class="text-center text-xl uppercase mb-2">
                <i class="fe fe-upload-cloud"></i> Upload File
              </div>
            </slot>
            <div v-if="dragAndDrop && dragAndDropCapable" class="text-gray-500 text-lg">
              or drag and drop here
            </div>
          </div>

          <div v-for="(file, f) in resolvedFiles" :key="f" class="space-y-2">
            <slot name="selected" v-bind="file">
              <div class="text-center" v-if="file.raw && file.file">
                <img v-if="file.file.type == 'image'"  :src="file.raw" :alt="file.file.name" style="max-width: 100%">
                <i v-else class="fe fe-file text-3xl">File icon</i>
                <h2 class="text-gray-500">{{ file.name }}</h2>
              </div>
            </slot>
          </div>

        </div>
      </div>
      <a v-if="resolvedFiles.length" href="#" @click.prevent="clearFiles" class="text-red-500"><i class="fe fe-x"></i> Remove</a>
      <input :id="`file-input-${_uid}`" ref="filePicker" type="file" style="visibility: hidden; margin-top: -30px" @change="onFileChange" :accept="$attrs.accept">
    </div>
  </div>
</template>

<script>
export default {
  name: "InputFile",
  props: {
    value: {},
    dragAndDrop: {
      type: Boolean,
      default: () => true
    },
  },
  data() {
    return {
      files: [],
      dragAndDropCapable: false,
      fileOnDropzone: false,
      resolvedFiles: []
    };
  },
  methods: {
    selectNewFile() {
      this.$refs.filePicker.click();
    },

    onFileChange(e) {
      const files = e.target.files || e.dataTransfer.files;
      this.files = [];
      for( let i = 0; i < files.length; i++ ){
        this.files.push( files[i] );
      }
      this.emitFiles();
    },

    readFile(file) {

      return new Promise((resolve, reject) => {
        if(file instanceof File){
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve({
              file: {
                name: file.name,
                type: file.type.substring(0, file.type.indexOf('/')),
              },
              raw: e.target.result
            });
          };
          reader.onerror = (e) => {
            reject(e)
          }
          reader.readAsDataURL(file);
        }else{
          resolve({
            file: {
              name: this.$attrs.label,
              type: ['.png', '.gif', '.jpg', '.svg', 'jpeg'].includes(file.substr(-4)) ? 'image' : null,
            },
            raw: file
          })
        }
      });

    },

    determineDragAndDropCapable(){
      var div = document.createElement('div');

      return ( ( 'draggable' in div )
              || ( 'ondragstart' in div && 'ondrop' in div ) )
          && 'FormData' in window
          && 'FileReader' in window;
    },

    clearFiles(){
      this.files = [];
      this.emitFiles();
    },

    async resolveFiles(){
      this.resolvedFiles = await Promise.all(this.files.map(async (file) => await this.readFile(file)))
    },

    emitFiles(){
      this.resolveFiles();
      if(this.$attrs.multiple){
        this.$emit('change', this.files);
      }else{
        this.$emit('change', this.files.pop());
      }
    }

  },

  mounted(){
    this.dragAndDropCapable = this.determineDragAndDropCapable();

    if(this.dragAndDrop && this.dragAndDropCapable && this.$refs.dropzone ){

      ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach( function( evt ) {

        this.$refs.dropzone.addEventListener(evt, function(e){
          this.fileOnDropzone = evt === 'dragover'
          e.preventDefault();
          e.stopPropagation();
        }.bind(this), false);
      }.bind(this));

      this.$refs.dropzone.addEventListener('drop', function(e){
        this.files = [];
        for( let i = 0; i < e.dataTransfer.files.length; i++ ){
          this.files.push( e.dataTransfer.files[i] );
        }
        this.emitFiles();

      }.bind(this));
    }

  },

  watch: {
    value:{
      immediate: true,
      handler(url) {
        if (!url) return;
        this.files = url instanceof Array ? url : [url];
        this.resolveFiles();
      },
    },
  },
}
</script>

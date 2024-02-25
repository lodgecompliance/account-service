<template>
  <section>
    <v-row>
      <v-col
          v-for="(image, i) in imagesData"
          :key="i"
          :cols="12/grid"
          class="pa-0"
      >
        <v-img
            :src="image"
            :height="itemHeight"
            gradient="to bottom, rgba(0,0,0,.5), rgba(0,0,0,.1)"
        >
          <slot v-bind="{ image, index: i, view, remove }">
            <div class="d-flex justify-end pa-2">
              <v-btn dark icon @click="view(image)">
                <v-icon>mdi-arrow-expand-all</v-icon>
              </v-btn>
              <v-btn v-if="allowRemove" dark icon @click="remove(i)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>
          </slot>
        </v-img>
      </v-col>
    </v-row>

    <v-dialog
        v-model="dialog"
        persistent
        scrollable
        width="800"
        fullscreen
    >
      <v-card>
        <slot name="header" v-bind="{ closeDialog }">
          <v-card-title class="d-flex justify-space-between">
            <span>Image Preview</span>
            <v-btn icon @click="closeDialog">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
        </slot>
        <v-carousel v-model="carousel" height="100%">
          <v-carousel-item
              v-for="(image, i) in imagesData"
              :key="`image-${i}`"
          >
            <v-img
                :src="image"
                height="100%"
                contain
            ></v-img>
          </v-carousel-item>
        </v-carousel>
        <slot name="footer" v-bind="{ remove }"></slot>
      </v-card>
    </v-dialog>
  </section>
</template>

<script>
export default {
    name: "ImagesPreview",
    data() {
      return {
        imagesData: [],
        carousel: null,
        dialog: false
      }
    },
    props: {
        value: {
          type: Array,
          default: () => []
        },
      grid: {
          type: Number,
          default: () => 2
      },
      itemHeight: {
        type: Number,
        default: () => 100
      },
      allowRemove: {
        type: Boolean,
        default: () => true
      }
    },
  methods: {
    view(file) {
      this.carousel = this.imagesData.findIndex(image => image === file);
      this.dialog = true
    },
    remove(index){
      this.imagesData.splice(index, 1)
    },
    closeDialog() {
      this.dialog = false
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(images) {
        this.imagesData = images
      }
    },
    imagesData: {
      immediate: true,
      handler(images) {
        this.$emit("input", images)
      }
    }
  }
}
</script>
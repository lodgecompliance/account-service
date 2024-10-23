<template>
  <data-container
      :loading="loading"
      :error="error"
      :can-retry="true"
      @retry="loadPermissions">

      <div class="text-right mb-4">
        <v-btn text color="primary" v-if="selected.length && selected" @click="unSelectAllItems" small>
          <span >
            <v-icon small>mdi-checkbox-blank</v-icon> unselect all
          </span>
        </v-btn>

        <v-btn v-else text color="primary" @click="selectAllItems" small>
          <span>
            <v-icon  small>mdi-checkbox-blank-outline</v-icon> select all
          </span>
        </v-btn>
      </div>
      

    <v-list-item-group
        v-model="selected"
        @change="emitSelected"
        multiple
        active-class="accent"
    >
      <v-list-item v-for="permission in allPermssions" :key="permission.id" dense>
        <template v-slot:default="{ active }">
          <v-list-item-action>
            <v-checkbox :input-value="active"></v-checkbox>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ permission.label }}</v-list-item-title>
            <v-list-item-subtitle>{{ permission.description }}</v-list-item-subtitle>
          </v-list-item-content>
        </template>
      </v-list-item>
    </v-list-item-group>

  </data-container>
</template>

<script>
import DataContainer from "@/components/DataContainer";
import property from "@/domain/Business/Mixins/property";
export default {
  name: "PropertyPermissionsSelect",
  components: {DataContainer},
  mixins: [property],
  data() {
    return {
      loading: false,
      error: null,
      permissions: {},
      selected: [],
    }
  },
  props: {
    value: { default: () => [] }
  },
  computed: {
    selectedValues() {
      return this.selected
          .map(index => this.allPermssions[index].id)
    },
    reservationPermissions() {
      return this.permissions?.reservation || [];
    },
   propertyPermissions() {
      return this.permissions?.property || [];
   },
   allPermssions() {
      return this.propertyPermissions
          .concat(this.reservationPermissions)
    }
  },
  methods: {
    loadPermissions() {
      this.loading = true
      this.getPropertyPermissions().then(permissions => {
        this.permissions = permissions
        this.setSelected()
      }).catch(e => {
        this.error = e
      }).finally(() => {
        this.loading = false
      })
    },
    setSelected() {
      this.selected = this.value
          .map(p => this.allPermssions.findIndex(pe => pe.id === p))
          .filter(index => index >= 0)
    },
    selectAllItems() {
      if (this.allPermssions.length > 0) {
          this.allPermssions.forEach((item, index) => {
            this.selected.push(index);
            this.emitSelected();
          });
      }
    },

    unSelectAllItems() {
      this.selected = [];
      this.emitSelected();
    },

    emitSelected() {
      this.$emit('input', this.selectedValues)
    }
  },
  mounted() {
    this.loadPermissions()
  },
  watch: {
    value: {
      handler() {
        this.setSelected()
      }
    }
  }
}
</script>
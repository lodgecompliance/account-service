<template>
  <section>
    <v-data-table
        :headers="headers"
        :items="properties"
        :search="search"
        :loading="loading"
        v-bind="$attrs"
        fixed-header
        height="500"
    >
      <template #no-data>
        <error-handler :error="error" :can-retry="true" @retry="loadProperties" />
      </template>

      <template v-slot:item.name="{ item }">
        <div class="d-flex align-center">
          <profile-avatar
              :profile="item"
              color="accent"
          >
            <template #icon="{ size }">
              <v-icon color="primary" :size="size">mdi-domain</v-icon>
            </template>
          </profile-avatar>
          <div class="ml-2">
            <div>{{ item.name }}</div>
            <small class="grey--text">{{ item.address }}</small>
          </div>
        </div>
      </template>

      <template v-slot:item.contact="{ item }">
        <small>{{ item.phone }}</small> <br>
        <small>{{ item.email }}</small>
      </template>

      <template v-slot:item.status="{ item }">
        <item-status :status="item.status" />
      </template>

      <template v-slot:item.action="{ item }">
        <v-btn icon @click="property = item">
          <v-icon small>mdi-eye</v-icon>
        </v-btn>
        <v-btn :href="`${$store.getters.domains.host}/${item.id}`" icon>
          <v-icon small>mdi-open-in-new</v-icon>
        </v-btn>
      </template>

    </v-data-table>
    <business-property-dialog
        :property="property"
        :business="business"
        :has-activator="false"
        @close="property = null"
        @property-updated="propertyUpdated"
    />
  </section>
</template>

<script>
import ProfileAvatar from "@/components/ProfileAvatar.vue";
import ItemStatus from "@/components/ItemStatus.vue";
import ErrorHandler from "@/components/ErrorHandler.vue";
import BusinessPropertyDialog from "@/domain/Business/Widgets/PropertyDialog.vue";
import business from "@/domain/Business/Mixins/business";
import config from "@/config";
import {mapActions} from "vuex";
export default {
  name: 'BusinessProperties',
  mixins:[business],
  components:{BusinessPropertyDialog, ErrorHandler, ItemStatus, ProfileAvatar },
  data(){
    return {
      loading: false,
      property: null,
      properties: [],
      error: null,
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Contact', value: 'contact', sortable: false},
        { text: 'Status', value: 'status', sortable: false },
        { text: 'Actions', value: 'action', sortable: false },
      ]
    };
  },
  props: {
    search: String,
    business: Object
  },
  methods: {
    propertyCreated(property) {
      this.properties.unshift(property);
    },
    propertyUpdated(property) {
      this.properties.splice(this.properties.findIndex(p => p.id === property.id), 1, property);
      this.property = null;
    },
    loadProperties() {
      this.loading = true;
      this.error = null;
      this.getBusinessById(this.business.id, `
              properties {
                  id
                  name
                  email
                  phone
                  address
                  rules
                  currency
                  term_url
                  status
                  image
                  cover_image
                  integrations {
                    key
                    value
                  }
                  metadata {
                    key
                    value
                  }
                  timestamp {
                    created_at
                    updated_at
                  }
                }
            `)
          .then(business => {
            this.properties = (business?.properties || [])
          })
          .catch(e => { this.error = e })
          .finally(() => this.loading = false)
    }
  },
  watch: {
    business: {
      immediate: true,
      handler(business) {
        if(business) this.loadProperties()
      }
    }
  }
}
</script>

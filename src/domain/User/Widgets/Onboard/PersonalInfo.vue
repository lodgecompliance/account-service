<template>
    <personal-info-form
        v-bind="$attrs" flat
        @saved="(data) => $emit('completed', data)"
        :key="version" @update="version++"
    >
      <template #actions="{ loading, submitting, submit }">
        <slot name="actions" v-bind="{ loading, submitting, submit }"></slot>
      </template>
    </personal-info-form>
</template>

<script>
    import PersonalInfoForm from "@/domain/User/Components/PersonalInfoForm";
    export default {
        name: 'PersonalInfo',
        components:{PersonalInfoForm},
        data(){
            return {
              version: 1
            };
        },

        methods: {
        }
    }
</script>
<style>

</style>

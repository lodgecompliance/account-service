export default {
    props: {
        items: {
            type: Array,
            default: () => []
        },
        selectFirstAsDefault: {
            default: () => false
        },
        exclude: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        itemsToRender() {
            return (this.currentValue ? [this.currentValue] : [])
                .concat(this.items.filter(item => !this.exclude.includes(item.id)))
        },
        currentValue() {
            if(typeof this.value !== 'object') {
                return this.items.find(item => item.id === this.value)
            }
            return this.value;
        },
        value() {
            return this.$attrs.value
        }
    },
    methods: {
        emitValue() {
            if(typeof this.value !== 'object' && typeof this.$attrs['return-object'] !== "undefined") {
                this.$emit("input", this.items.find(item => item.id === this.value))
            }
        }
    },
    mounted() {
        if(this.selectFirstAsDefault && this.items.length) {
            this.$emit("input", this.items[0])
        }
    },
    watch: {
        value: {
            immediate: true,
            handler() {
                this.emitValue()
            }
        },
        items: {
            immediate: true,
            handler() {
                this.emitValue()
            }
        }
    }
}
import moment from "moment";

export default {
    install(Vue) {
        Vue.filter('nullable', (value, defaultValue = '--') => {
            return value && value != '' ? value : defaultValue;
        })

        Vue.filter('money_value', (amount, currency = 'USD', divisor = 100) => {
            return isNaN(amount) ? '--' : `${currency?.toUpperCase()}${(amount/divisor).toLocaleString()}`;
        })

        Vue.filter('money', (amount, currency = '') => {
            return isNaN(amount) ? '--' : `${currency ? currency.toUpperCase() : ''}${amount.toLocaleString()}`;
        })

        Vue.filter('replace_underscore', (string, replacement = ' ') => {
            if(!string) return '';
            return string.replace(/_/g, replacement);
        })

        Vue.filter('ucfirst', (string = '') => {
            if(!string) return '';
            return string.charAt(0).toUpperCase()+string.slice(1);
        })

        Vue.filter('ucfirstword', (words = '') => {
            if(!words) return '';
            return words.split(" ").map(word => word.charAt(0).toUpperCase()+word.slice(1)).join(" ")
        })

        Vue.filter('timestamp', (timestamp, format = "YYYY-MM-DD hh:mm a") => {
            return moment.unix(timestamp).format(format)
        })

        Vue.filter('striped_phone', (phone = "") => {
            return phone.replace(/[-\s]+/g, "");
        })
    }
  };
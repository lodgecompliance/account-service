/* eslint-disable */
const formValidation = {
        rules: {
            required: value => (value !== '' && value !== null && value !== undefined) || 'Field required.',
            optional: value => !value,
            number: value => (!!value && /\d/.test(value)) || 'Invalid number',
            email: value => {
                const regx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return regx.test(value) || 'Invalid email address'; 
            },
            url: value => {
                const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
                    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
                    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
                    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
                    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
                    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator

                    return pattern.test(value) || "Invalid URL"
            },
            max: (value, max) => (!!value && value <= max) || `Maximum allowed is ${max}`,
            min: (value, min) => (!!value &&nvalue >= min) || `Minimum allowed is ${min}`,
            nonNegative: value =>  (!!value && value >= 0) || `Negative value is not allowed`,
            maxLength: (value, max) => (!!value && value.length <= max) || `Maximum character is ${max}`,
            minLength: (value, max) => (!!value && value.length <= max) || `Minimum character is ${max}`,
        }
};

export default formValidation;
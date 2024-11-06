export function loadGoogleMapsAPI(apiKey, callback) {
    return new Promise(function(resolve, reject) {
        if (typeof window.google !== "undefined" && window.google.maps) {
            // Google maps already loaded
            if (callback) callback();
            resolve();
        } else {
            // Create a script element to load the google maps api
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
            script.async = true;
            script.defer = true;
            script.onload = () => {
                if (callback) callback();
                resolve();
            };
            script.onerror = (error) => {
                reject(error);
            };
            document.head.appendChild(script);
        }
    });
}
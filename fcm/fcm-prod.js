importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js');
firebase.initializeApp({
    apiKey: "AIzaSyA-AjInpJroxpUzOwlnphkf1uFqL5iadrk",
    authDomain: "lodge-compliance-59f61.firebaseapp.com",
    projectId: "lodge-compliance-59f61",
    storageBucket: "lodge-compliance-59f61.appspot.com",
    messagingSenderId: "747424469308",
    appId: "1:747424469308:web:e531fa274b976b9ae20e39",
    measurementId: "G-Y308XWM97N"
});
firebase.messaging()
    .onBackgroundMessage(function(payload) {
        self.registration.showNotification(payload.notification.title, {
            body: payload.notification.body,
            icon: payload.notification.icon,
            click_action: payload.notification.click_action
        });
    });
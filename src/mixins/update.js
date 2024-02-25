import helper from '../helper';

export default {
  data() {
    return {
      // refresh variables
      refreshing: false,
      registration: null,
      updateExists: false,
    }
  },

  computed: {
    lastUpdate() {
      const time = Number(window.localStorage.getItem('last-update'))
      return  time ? time : 0;
    }
  },

  created() {
    
    // Listen for our custom event from the SW registration
    document.addEventListener('swUpdated', this.updateAvailable, { once: true })
    document.addEventListener('swCriticalUpdate', this.criticalUpdateAvailable, { once: true })

    // Prevent multiple refreshes
    navigator.serviceWorker.addEventListener('controllerchange', this.refreshApplication)
  },

  methods: {
    // Store the SW registration so we can send it a message
    // We use `updateExists` to control whatever alert, toast, dialog, etc we want to use
    // To alert the user there is an update they need to refresh for
    updateAvailable(event) {
      this.registration = event.detail
      this.updateExists = true //if want to get user consent for updating
    },

    criticalUpdateAvailable(event) {
      if ('Notification' in window) {
        if(Notification.permission === "granted"){
          new Notification("The app is being updated");
        }
      }
      const sw = event.detail;
      this.registration = sw;
      if (!sw || !sw.waiting) this.refreshApplication(); //service worker is not waiting, just force app reload
      else this.refreshApp(); //service worker is already waiting, trigger user acceptance of update
    },

    // Called when the user accepts the update
    refreshApp() {
      this.updateExists = false;
      // Make sure we only send a 'skip waiting' message if the SW is waiting
      if (!this.registration || !this.registration.waiting) return
      // send message to SW to skip the waiting and activate the new SW
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    },

    
    reloadApp() {
        window.location.reload()
    },

    refreshApplication() {
      if (this.refreshing) return;
      this.refreshing = true;
      this.updateLastUpdate();
      this.reloadApp();
    },

    updateLastUpdate() {
      window.localStorage.setItem('last-update', helper.nowTimestamp())
    }
  },

}
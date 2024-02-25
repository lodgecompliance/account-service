import Vue from 'vue';
import VueRouter from 'vue-router';
import middleware from './middleware';
import multiguard from 'vue-router-multiguard';
import Home from "@/views/Home.vue";
import Auth from "@/Auth.vue"
import Onboard from "@/domain/User/Views/Onboard.vue";
import Signin from "@/domain/Auth/Views/Signin.vue";
import EmailVerification from "@/domain/Auth/Views/EmailVerification.vue";
import IdVerification from "@/domain/User/Views/IdVerification.vue";
import UserProfile from "@/domain/User/Views/Profile.vue";
import BusinessProfile from "@/domain/Business/Views/Profile.vue";
import UserBusinesses from "@/domain/User/Views/Businesses.vue";
import UserWallets from "@/domain/User/Views/Wallets.vue";
import BusinessUsers from "@/domain/Business/Views/Users.vue";
import BusinessIntegrations from "@/domain/Business/Views/Integrations.vue";
import BusinessStripeConnect from "@/domain/Business/Views/StripeConnect.vue";
import BusinessProperties from "@/domain/Business/Views/Properties.vue";
import BusinessWallets from "@/domain/Business/Views/Wallets.vue";
import BusinessCreditCards from "@/domain/Business/Views/CreditCards.vue";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    alias: 'index.html',
    component: Home,
    beforeEnter: multiguard([middleware.auth])
  },
  {
    path: '/auth',
    name: 'auth',
    component: Auth,
  },
  {
    path: '/signin',
    name: 'signin',
    component: Signin,
    beforeEnter: multiguard([middleware.guest])
  },
  {
    path: '/verify-email',
    name: 'email.verification',
    component: EmailVerification,
  },
  {
    path: '/onboard/:pendingUserId?',
    name: 'onboard',
    component: Onboard,
    meta: {
      title: "Onboard"
    },
    beforeEnter: multiguard([middleware.auth])
  },
  {
    path: '/profile',
    name: 'user.profile',
    component: UserProfile,
    meta: {
      title: "Profile"
    },
    beforeEnter: multiguard([middleware.auth])
  },
  {
    path: '/id-verification',
    name: 'user.id.verification',
    component: IdVerification,
    meta: {
      title: "ID Verification"
    },
    beforeEnter: multiguard([middleware.auth])
  },
  {
    path: '/businesses',
    name: 'user.businesses',
    component: UserBusinesses,
    meta: {
      title: "Businesses"
    },
    beforeEnter: multiguard([middleware.auth])
  },
  {
    path: '/wallets',
    name: 'user.wallets',
    component: UserWallets,
    meta: {
      title: "Wallets"
    },
    beforeEnter: multiguard([middleware.auth])
  },
  {
    path: '/:business',
    name: 'business.profile',
    component: BusinessProfile,
    meta: {
      title: "Business Profile"
    },
    beforeEnter: multiguard([middleware.auth])
  },
  {
    path: '/:business/users',
    name: 'business.users',
    component: BusinessUsers,
    meta: {
      title: "Business Users"
    },
    beforeEnter: multiguard([middleware.auth])
  },
  {
    path: '/:business/integrations',
    name: 'business.integrations',
    component: BusinessIntegrations,
    meta: {
      title: "Business Integrations"
    },
    beforeEnter: multiguard([middleware.auth])
  },
  {
    path: '/:business/properties',
    name: 'business.properties',
    component: BusinessProperties,
    meta: {
      title: "Business Properties"
    },
    beforeEnter: multiguard([middleware.auth])
  },
  {
    path: '/:business/wallets',
    name: 'business.wallets',
    component: BusinessWallets,
    meta: {
      title: "Business Wallets"
    },
    beforeEnter: multiguard([middleware.auth])
  },
  {
    path: '/:business/credit-cards',
    name: 'business.credit.cards',
    component: BusinessCreditCards,
    meta: {
      title: "Business Credit Cards"
    },
    beforeEnter: multiguard([middleware.auth])
  },
  {
    path: '/callback/stripe-connect',
    name: 'business.stripe.connect.callback',
    component: BusinessStripeConnect,
    meta: {
      title: "Stripe Connect"
    },
    beforeEnter: multiguard([middleware.auth])
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 };
  }
})

router.beforeEach((to, from, next) => {
  const currentUser = router.app.$store.getters.current_user;
  /**
   * TODO: Implement route middleware here
   */
  next();
})


export default router;

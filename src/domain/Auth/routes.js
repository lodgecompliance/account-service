import middleware from '../../router/middleware';
import multiguard from 'vue-router-multiguard';

import Signin from './Views/Signin';
import EmailVerification from './Views/EmailVerification';

export default [
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

];
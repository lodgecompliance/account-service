import { auth } from '@/firebase';

export default () => {
    return new Promise(resolve => {
        auth.onAuthStateChanged(user => {
            resolve(user);
        });
    })
};
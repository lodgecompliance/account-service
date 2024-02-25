import { storage } from '@/firebase';

const fileHelper = {
    /**
     * upload file to firestore storage
     */
    uploadFile: (file, path) => {
        const storageRef = storage.ref();
       return  storageRef.child(path).put(file)
    }
};

export default fileHelper;
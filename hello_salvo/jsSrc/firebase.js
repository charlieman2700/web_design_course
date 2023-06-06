// @ts-check
// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyBvmnMkFLvLblR5PG_9-MZowokyCGJf8pA',
    authDomain: 'blog-eddf7.firebaseapp.com',
    projectId: 'blog-eddf7',
    storageBucket: 'blog-eddf7.appspot.com',
    messagingSenderId: '1084792124180',
    appId: '1:1084792124180:web:54cc3f82d0f493e12cc801',
    measurementId: 'G-6TPHL2Y356',
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
console.log(app);
const analytics = getAnalytics(app);
//# sourceMappingURL=firebase.js.map

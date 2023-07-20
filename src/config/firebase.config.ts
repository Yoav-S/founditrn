import * as dotenv from 'dotenv'
dotenv.config();


export default {
    firebaseConfig: {
        apiKey: process.env.API_KEY,
        authDomain: process.env.AUTH_DOMAIN,
        projectId: process.env.PROJECT_ID,
        storageBucket: process.env.FIRESTORE_DB_URL,
        messagingSenderId: process.env.STORAGE_BUCKET,
        appId: process.env.MESSAGING_SENDER_ID,
        measurementId: process.env.MEASUREMENT_ID,
    }
}
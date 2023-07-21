import * as dotenv from 'dotenv'
dotenv.config();


export default {
    firebaseConfig: {
        apiKey: process.env.API_KEY,
        authDomain: process.env.AUTH_DOMAIN,
        projectId: process.env.PROJECT_ID,
        storageBucket: process.env.STORAGE_BUCKET, // Corrected variable name
        messagingSenderId: process.env.MESSAGING_SENDER_ID,
        appId: process.env.APP_ID, // Use APP_ID instead of MESSAGING_SENDER_ID
        measurementId: process.env.MEASUREMENT_ID,
    }
}
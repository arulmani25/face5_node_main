const admin = require('firebase-admin');
const Dotenv = require('dotenv');
Dotenv.config({ path: 'Source/.env.production' });
const environment = process.env;

// Your service account credentials
const serviceAccount = {
  type: environment.TYPE,
  project_id: environment.PROJECT_ID,
  private_key_id: environment.PRIVATE_KEY_ID,
  private_key: environment.PRIVATE_KEY,
  client_email: environment.CLIENT_EMAIL,
  client_id: environment.CLIENT_ID,
  auth_uri: environment.AUTH_URL,
  token_uri: environment.TOKEN_URL,
  auth_provider_x509_cert_url: environment.AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: environment.CLIENT_CERT_URL,
  universe_domain: environment.UNIVERSE_DOMAIN
};
/**
 * Send a notification to a specific FCM token.
 * @param {string} fcmToken - The FCM token of the device to receive the notification.
 * @param {Object} Message - The message object containing notification details.
 */
const sendNotification = {
    /**
     * PushNotification 
     * @param {*} activityId 
     */
    PushNotification : async (activityId) => {
        
        try {
            const Message = {
                message: "This is a test notification message"
              };
            // Initialize Firebase Admin SDK
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });

            const payload = {
                notification: {
                  title: 'Face5',
                  body: Message?.message
                },
                token: environment.ANDROIDFCMTOCKEN,
                data: {
                  id: activityId.toString()
                }
            };
            // Send notification
            const response = await admin.messaging().send(payload);
            console.log('Notification sent successfully:', response);
            return response;
        } catch (error) {
            console.error('Error sending notification:', error);
            return error;
        }
    }
}
// sendNotification.PushNotification("123456")
module.exports = sendNotification;
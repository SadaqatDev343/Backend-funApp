// module imports
const admin = require('firebase-admin');
const serviceAccount = require('../../service-account.json');

const connection = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

class FirebaseManager {
  constructor() {
    this.connection = connection;
  }

  async sendNotificationToSingle(params) {
    let { fcm, title, body, data } = params;
    data = data || {};
    try {
      const payload = [
        {
          token: fcm,
          notification: {
            title,
            body,
          },
          data,
          apns: {
            headers: {
              'apns-priority': '10',
            },
            payload: {
              aps: {
                sound: 'default',
              },
            },
          },
        },
      ];

      const response = await connection.messaging().sendEach(payload);
      console.log('res => ', JSON.stringify(response, null, 2));

      // Construct response with body, title, and success message
      const successResponse = {
        success: true,
        title,
        body,
        message: 'Notification sent successfully',
      };
      return successResponse;
    } catch (error) {
      console.log('sendNotificationToSingle_error', error);
      // Send error message as response
      return { success: false, message: 'Failed to send notification' };
    }
  }
}

module.exports = FirebaseManager;

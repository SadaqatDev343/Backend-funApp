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
    } catch (error) {
      console.log('sendNotificationToSingle_error', error);
    }
  }
}

module.exports = FirebaseManager;

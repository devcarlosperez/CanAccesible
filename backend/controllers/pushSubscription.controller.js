const db = require("../models");
const PushSubscription = db.pushSubscription;
const webpush = require("../config/webpush");

// Subscribe a user to push notifications
exports.subscribe = async (req, res) => {
  try {
    const userId = req.user.id;
    const subscription = req.body;

    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({ message: "Invalid subscription object." });
    }

    // Check if subscription already exists to avoid duplicates
    const existingSubscription = await PushSubscription.findOne({
      where: {
        userId: userId,
        endpoint: subscription.endpoint,
      },
    });

    if (existingSubscription) {
      return res.status(200).json({ message: "Subscription already exists." });
    }

    // Save subscription to database
    await PushSubscription.create({
      userId: userId,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
    });

    res.status(201).json({ message: "Subscription saved successfully." });
  } catch (err) {
    console.error("Error saving subscription:", err);
    res.status(500).json({ message: "Error saving subscription." });
  }
};

// Unsubscribe a user
exports.unsubscribe = async (req, res) => {
  try {
    const userId = req.user.id;
    const { endpoint } = req.body;

    if (!endpoint) {
      return res.status(400).json({ message: "Endpoint is required." });
    }

    await PushSubscription.destroy({
      where: {
        userId: userId,
        endpoint: endpoint,
      },
    });

    res.status(200).json({ message: "Unsubscribed successfully." });
  } catch (err) {
    console.error("Error unsubscribing:", err);
    res.status(500).json({ message: "Error unsubscribing." });
  }
};

// Helper function to send notification to a specific user
exports.sendNotificationToUser = async (userId, payload) => {
  console.log(`[PUSH] sendNotificationToUser called for userId=${userId}`);
  try {
    const subscriptions = await PushSubscription.findAll({
      where: { userId: userId },
    });

    console.log(`[PUSH] Found ${subscriptions?.length || 0} subscription(s) for user ${userId}`);
    
    if (!subscriptions || subscriptions.length === 0) {
      console.log(`[PUSH] No subscriptions found for user ${userId}, skipping`);
      return;
    }

    const notifications = subscriptions.map((sub) => {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth,
        },
      };

      return webpush
        .sendNotification(pushSubscription, JSON.stringify(payload))
        .catch((err) => {
          if (err.statusCode === 410 || err.statusCode === 404) {
            // Subscription has expired or is no longer valid
            console.log("Subscription expired, deleting from DB:", sub.id);
            return PushSubscription.destroy({ where: { id: sub.id } });
          }
          console.error("Error sending notification:", err);
        });
    });

    await Promise.all(notifications);
  } catch (err) {
    console.error("Error in sendNotificationToUser:", err);
  }
};

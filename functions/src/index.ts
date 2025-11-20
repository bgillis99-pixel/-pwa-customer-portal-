import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

/**
 * Webhook receiver from Cloudflare Workers
 * Receives webhook events and stores them in Firestore for processing
 */
export const receiveWebhook = functions.https.onRequest(async (req, res) => {
  // Verify request is from your Cloudflare Worker
  const authHeader = req.headers.authorization;
  const expectedSecret = functions.config().cloudflare?.secret;

  if (!authHeader || authHeader !== `Bearer ${expectedSecret}`) {
    res.status(401).json({error: "Unauthorized"});
    return;
  }

  try {
    const {source, data, webhookId} = req.body;

    if (!source || !data || !webhookId) {
      res.status(400).json({error: "Missing required fields"});
      return;
    }

    // Store webhook in Firestore
    await admin.firestore().collection("webhooks").doc(webhookId).set({
      source,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      payload: data,
      status: "received",
      retryCount: 0,
    });

    // Process based on source
    switch (source) {
    case "paypal":
      await processPayPalWebhook(data, webhookId);
      break;
    case "sms":
    case "twilio":
      await processSMSLead(data, webhookId);
      break;
    case "calendar":
      await processCalendarEvent(data, webhookId);
      break;
    case "ads":
      await processAdsLead(data, webhookId);
      break;
    default:
      console.log(`Unknown webhook source: ${source}`);
    }

    res.json({success: true, webhookId});
  } catch (error) {
    console.error("Webhook processing error:", error);
    res.status(500).json({error: "Processing failed"});
  }
});

/**
 * Process PayPal payment webhooks
 */
async function processPayPalWebhook(data: any, webhookId: string) {
  try {
    const transactionId = data.txn_id || data.id;
    const amount = parseFloat(data.mc_gross || data.amount?.value || "0");
    const email = data.payer_email || data.payer?.email_address;

    // Find job by transaction ID or customer email
    const jobsSnapshot = await admin.firestore()
      .collection("jobs")
      .where("paymentStatus", "==", "pending")
      .limit(1)
      .get();

    if (!jobsSnapshot.empty) {
      const jobDoc = jobsSnapshot.docs[0];
      await jobDoc.ref.update({
        paymentStatus: "paid",
        paymentMethod: "paypal",
        paypalTransactionId: transactionId,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Update customer total revenue
      const job = jobDoc.data();
      const customerRef = admin.firestore()
        .collection("customers")
        .doc(job.customerId);
      await customerRef.update({
        totalRevenue: admin.firestore.FieldValue.increment(amount),
        lastServiceDate: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Send payment confirmation
      await sendPaymentConfirmation(email, amount, transactionId);
    }

    // Update webhook status
    await admin.firestore().collection("webhooks").doc(webhookId).update({
      status: "completed",
      processedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error("PayPal webhook processing error:", error);
    await admin.firestore().collection("webhooks").doc(webhookId).update({
      status: "failed",
      error: error instanceof Error ? error.message : "Unknown error",
      processedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
}

/**
 * Process SMS lead webhooks
 */
async function processSMSLead(data: any, webhookId: string) {
  try {
    const {phone, message, timestamp} = data;

    // Create new lead in Firestore
    const leadRef = await admin.firestore().collection("leads").add({
      source: "sms",
      phone,
      message,
      status: "new",
      assignedTo: null,
      createdAt: timestamp ?
        admin.firestore.Timestamp.fromDate(new Date(timestamp)) :
        admin.firestore.FieldValue.serverTimestamp(),
      webhookId,
    });

    // Trigger notification to sales team
    await sendLeadNotification(leadRef.id, phone, message);

    // Update webhook status
    await admin.firestore().collection("webhooks").doc(webhookId).update({
      status: "completed",
      processedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error("SMS lead processing error:", error);
    await admin.firestore().collection("webhooks").doc(webhookId).update({
      status: "failed",
      error: error instanceof Error ? error.message : "Unknown error",
      processedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
}

/**
 * Process calendar event webhooks
 */
async function processCalendarEvent(data: any, webhookId: string) {
  try {
    const {eventId, summary, start} = data;

    // Create or update job from calendar event
    const jobRef = admin.firestore().collection("jobs").doc(eventId);

    await jobRef.set({
      status: "scheduled",
      scheduledDate: admin.firestore.Timestamp
        .fromDate(new Date(start.dateTime)),
      customerName: summary,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, {merge: true});

    // Update webhook status
    await admin.firestore().collection("webhooks").doc(webhookId).update({
      status: "completed",
      processedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error("Calendar event processing error:", error);
    await admin.firestore().collection("webhooks").doc(webhookId).update({
      status: "failed",
      error: error instanceof Error ? error.message : "Unknown error",
      processedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
}

/**
 * Process Google Ads lead webhooks
 */
async function processAdsLead(data: any, webhookId: string) {
  try {
    const {name, email, phone, message, metadata} = data;

    // Create new lead in Firestore
    const leadRef = await admin.firestore().collection("leads").add({
      source: "google_ads",
      phone,
      email,
      message: message || `New lead from ${name}`,
      status: "new",
      assignedTo: null,
      metadata: metadata || {},
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      webhookId,
    });

    // Trigger notification to sales team
    await sendLeadNotification(leadRef.id, phone, message);

    // Update webhook status
    await admin.firestore().collection("webhooks").doc(webhookId).update({
      status: "completed",
      processedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error("Ads lead processing error:", error);
    await admin.firestore().collection("webhooks").doc(webhookId).update({
      status: "failed",
      error: error instanceof Error ? error.message : "Unknown error",
      processedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
}

/**
 * Helper: Send payment confirmation
 */
async function sendPaymentConfirmation(
  email: string,
  amount: number,
  transactionId: string
) {
  // TODO: Integrate with SendGrid, Mailgun, or Firebase Extensions
  console.log(
    `Sending payment confirmation to ${email} for $${amount} (${transactionId})`
  );
}

/**
 * Helper: Send lead notification
 */
async function sendLeadNotification(
  leadId: string,
  phone: string,
  message: string
) {
  // TODO: Send SMS or push notification to sales team
  console.log(`New lead ${leadId} from ${phone}: ${message}`);
}

/**
 * Helper: Notify job completion
 */
async function notifyJobCompletion(jobId: string, jobData: any) {
  // TODO: Send SMS/email to customer
  console.log(`Job ${jobId} completed for ${jobData.customerName}`);
}

/**
 * Triggered when job status changes
 */
export const onJobStatusChange = functions.firestore
  .document("jobs/{jobId}")
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    if (before.status !== after.status) {
      console.log(
        `Job ${context.params.jobId} status changed: ${before.status} → ${after.status}`
      );

      // Send notification to customer
      if (after.status === "completed") {
        await notifyJobCompletion(context.params.jobId, after);
      }

      // Update Analytics
      const analyticsRef = admin.firestore().collection("analytics").doc("jobs");
      const analyticsDoc = await analyticsRef.get();

      if (analyticsDoc.exists) {
        await analyticsRef.update({
          [`statusCounts.${after.status}`]: admin.firestore.FieldValue.increment(1),
          [`statusCounts.${before.status}`]: admin.firestore.FieldValue.increment(-1),
        });
      } else {
        // Initialize analytics document if it doesn't exist
        await analyticsRef.set({
          statusCounts: {
            scheduled: after.status === "scheduled" ? 1 : 0,
            in_progress: after.status === "in_progress" ? 1 : 0,
            completed: after.status === "completed" ? 1 : 0,
            cancelled: after.status === "cancelled" ? 1 : 0,
          },
        });
      }
    }
  });

/**
 * Scheduled function: Daily revenue report
 * Runs at 6 PM Pacific Time daily
 */
export const dailyRevenueReport = functions.pubsub
  .schedule("0 18 * * *")
  .timeZone("America/Los_Angeles")
  .onRun(async (context) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const jobsSnapshot = await admin.firestore()
      .collection("jobs")
      .where("completedDate", ">=", admin.firestore.Timestamp.fromDate(today))
      .where("paymentStatus", "==", "paid")
      .get();

    let totalRevenue = 0;
    let jobCount = 0;

    jobsSnapshot.forEach((doc) => {
      const job = doc.data();
      totalRevenue += job.pricing?.total || 0;
      jobCount++;
    });

    console.log(
      `Daily Report: ${jobCount} jobs, $${totalRevenue.toFixed(2)} revenue`
    );

    // Store in analytics collection
    await admin.firestore()
      .collection("analytics")
      .doc("daily")
      .collection("reports")
      .add({
        date: admin.firestore.Timestamp.fromDate(today),
        jobCount,
        totalRevenue,
        averageJobValue: jobCount > 0 ? totalRevenue / jobCount : 0,
      });

    // TODO: Send report email to Bryan
  });

/**
 * Process log entries using Genkit flow
 * This function is called when a new log is added to trigger parsing
 */
export const processLogEntry = functions.firestore
  .document("logs/{logId}")
  .onCreate(async (snap, context) => {
    const logData = snap.data();

    // Only process if not already parsed and has raw text
    if (logData.parsed || !logData.raw) {
      return;
    }

    try {
      // TODO: Call the logEntryFlow from Genkit
      // For now, just mark it as processed
      console.log(`Processing log ${context.params.logId}: ${logData.raw}`);

      // This would call your Genkit flow:
      // const parsed = await logEntryFlow(logData.raw);
      // await snap.ref.update({ parsed });
    } catch (error) {
      console.error("Error processing log entry:", error);
    }
  });

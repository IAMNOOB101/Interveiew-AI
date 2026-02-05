import Subscription from "../models/Subscription.model.js";

const getRazorpayInstance = async () => {
  try {
    const { default: Razorpay } = await import("razorpay");
    return new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_key",
      key_secret: process.env.RAZORPAY_KEY_SECRET || "rzp_test_secret",
    });
  } catch (err) {
    // If the package isn't installed, return a stub that throws informative errors when used
    return {
      orders: {
        create: async () => {
          throw new Error("Razorpay SDK not installed. Install 'razorpay' or set RAZORPAY env vars to enable payments.");
        },
      },
    };
  }
};

export const createOrder = async (req, res, next) => {
  try {
    const { amount, currency = "INR", receipt } = req.body;
    if (!amount) return res.status(400).json({ message: "Amount required" });

    const razorpay = await getRazorpayInstance();

    const options = {
      amount: Math.round(amount * 100), // rupees to paise
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({ order });
  } catch (err) {
    next(err);
  }
};

// Webhook verification (Razorpay sends signature)
export const verifyWebhook = async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET || "webhook_secret";
  const crypto = await import("crypto");

  const body = JSON.stringify(req.body);
  const expectedSignature = crypto.createHmac("sha256", secret).update(body).digest("hex");

  const signature = req.headers["x-razorpay-signature"];
  if (signature !== expectedSignature) {
    return res.status(400).json({ message: "Invalid signature" });
  }

  // Handle payment captured events
  const event = req.body.event;
  if (event === "payment.captured") {
    const payload = req.body.payload.payment.entity;
    // Create subscription record (stub)
    await Subscription.create({
      userId: null,
      institutionId: null,
      plan: payload.description || "one-time",
      providerId: payload.id,
      status: "ACTIVE",
      validTill: null,
    });
  }

  res.json({ ok: true });
};

export default { createOrder, verifyWebhook };

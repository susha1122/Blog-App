import User from '../models/user.model.js';
import { Webhook } from 'svix';

export const clerkWebHook = async (req, res) => {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        throw new Error("Webhook secret needed!");
    }

    const payload = req.body.toString("utf8");
    const headers = req.headers;

    const wh = new Webhook(WEBHOOK_SECRET);
    let evt;

    try {
        evt = wh.verify(payload, headers);
    } catch (error) {
        console.log("Webhook verification failed:", error);
        return res.status(400).json({ message: "Webhook verification failed!" });
    }

    console.log("Webhook event:", evt.type);

    if (evt.type === "user.created") {

        const existing = await User.findOne({ clerkUserId: evt.data.id });
        if (existing) {
            return res.status(200).json({ message: "User already exists" });
        }

        const newUser = new User({
            clerkUserId: evt.data.id,
            username:
                evt.data.username ||
                evt.data.email_addresses?.[0]?.email_address ||
                "anonymous",

            email: evt.data.email_addresses?.[0]?.email_address,

            // 🔥 FIXED FIELD
            img: evt.data.profile_image_url || evt.data.image_url || null,
        });

        await newUser.save();
        console.log("✅ User saved to DB:", newUser);
    }

    return res.status(200).json({
        message: "Webhook received successfully!",
    });
};

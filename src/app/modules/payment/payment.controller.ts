import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { PaymentService } from "./payment.service";
import config from "../../../config";
import { stripe } from "../../helper/stripe";

const handleStripeWebhook = catchAsync(async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;
  const webhookSecret = config.webhook_secret as string;
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.log("Webhook Error: ", err.message);
    res.status(400).send({ success: false, message: err.message });
  }
  const result = await PaymentService.handleStripeWebhook(event);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Webhook request sent successfully",
    data: result,
  });
});

export const PaymentController = {
  handleStripeWebhook,
};

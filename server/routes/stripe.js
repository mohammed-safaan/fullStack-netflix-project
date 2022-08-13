const router = require("express").Router();
const dotenv = require("dotenv");
dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const express = require("express");
const handleSubscription = require("../helpers/helpers");

// console.log(process.env)

const YOUR_DOMAIN = "http://localhost:3000/subscription";

router.post("/create-checkout-session", async (req, res) => {
  const customer = await stripe.customers.create({
    metadata: {
      userId: req.body.userId,
    },
  });
  console.log(req.body.userId, "req.body.userId");
  const prices = await stripe.prices.list({
    lookup_keys: [req.body.lookup_key],
    expand: ["data.product"],
  });
  const session = await stripe.checkout.sessions.create({
    billing_address_collection: "auto",
    customer: customer.id,
    line_items: [
      {
        price: prices.data[0].id,
        // For metered billing, do not pass quantity
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${YOUR_DOMAIN}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${YOUR_DOMAIN}?canceled=true`,
    subscription_data: {
      trial_period_days: 7,
    },
  });

  res.redirect(303, session.url);
});

router.post("/create-portal-session", async (req, res) => {
  // For demonstration purposes, we're using the Checkout session to retrieve the customer ID.
  // Typically this is stored alongside the authenticated user in your database.
  const { session_id } = req.body;
  const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);

  // This is the url to which the customer will be redirected when they are done
  // managing their billing with the portal.
  const returnUrl = YOUR_DOMAIN;

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: checkoutSession.customer,
    return_url: returnUrl,
  });
  res.redirect(303, portalSession.url);
});

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (request, response) => {
    let event = request.body;
    // Replace this endpoint secret with your endpoint's unique secret
    // If you are testing with the CLI, find the secret by running 'stripe listen'
    // If you are using an endpoint defined with the API or dashboard, look in your webhook settings
    // at https://dashboard.stripe.com/webhooks
    const endpointSecret = process.env.STRIPE_WEBHOOK;
    // Only verify the event if you have an endpoint secret defined.
    // Otherwise use the basic event deserialized with JSON.parse
    if (endpointSecret) {
      // Get the signature sent by Stripe
      const signature = request.headers["stripe-signature"];
      try {
        event = stripe.webhooks.constructEvent(
          request.body,
          signature,
          endpointSecret
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return response.sendStatus(400);
      }
    }
    let subscription;
    let status;

    // Handle the event
    switch (event.type) {
      case "customer.subscription.trial_will_end":
        subscription = event.data.object;
        status = subscription.status;
        console.log(
          `customer.subscription.trial_will_end Subscription status is ${status}.`
        );
        stripe.customers
          .retrieve(subscription.customer)
          .then((customer) => {
            console.log(customer.email);
            handleSubscription(customer.email, { subscription_status: status });
          })
          .catch((err) => console.log(err));

        // Then define and call a method to handle the subscription trial ending.
        // handleSubscriptionTrialEnding(subscription);
        break;

      case "customer.subscription.deleted":
        subscription = event.data.object;
        status = subscription.status;
        console.log(
          `customer.subscription.deleted Subscription status is ${status}.`
        );
        stripe.customers
          .retrieve(subscription.customer)
          .then((customer) => {
            console.log(customer.email);
            handleSubscription(customer.id, { subscription_status: status });
          })
          .catch((err) => console.log(err));

        // Then define and call a method to handle the subscription deleted.
        // handleSubscriptionDeleted(subscriptionDeleted);
        break;

      case "customer.subscription.created":
        subscription = event.data.object;
        status = subscription.status;
        console.log(`subscription.created Subscription status is ${status}.`);
        // Then define and call a method to handle the subscription created.
        // handleSubscriptionCreated(subscription);
        stripe.customers
          .retrieve(subscription.customer)
          .then((customer) => {
            console.log(customer, "customer");
            console.log(customer.metadata.userId, "customer.userId");
            console.log(customer.id, "customer.id");
            handleSubscription(customer.metadata.userId, {
              subscription_status: status,
            });
          })
          .catch((err) => console.log(err));
        break;

      case "customer.subscription.updated":
        subscription = event.data.object;
        status = subscription.status;
        console.log(`subscription.updated Subscription status is ${status}.`);
        stripe.customers
          .retrieve(subscription.customer)
          .then((customer) => {
            console.log(customer.email);
            console.log(customer.id);
            handleSubscription(customer.metadata.userId, {
              subscription_status: status,
            });
          })
          .catch((err) => console.log(err));
        // Then define and call a method to handle the subscription update.
        // handleSubscriptionUpdated(subscription);
        break;

      case "subscription_schedule.canceled":
        subscription = event.data.object;
        status = subscription.status;
        console.log(
          `subscription_schedule.canceled Subscription status is ${status}.`
        );
        stripe.customers
          .retrieve(subscription.customer)
          .then((customer) => {
            console.log(customer.email);
          })
          .catch((err) => console.log(err));

        // Then define and call a method to handle the subscription update.
        // handleSubscriptionUpdated(subscription);
        break;

      default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}.`);
    }
    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);

module.exports = router;

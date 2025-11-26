import React, { useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, CreditCard, Sparkles, Truck, Shield } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const stripePromise = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
  : null;

const currency = (value) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

const PaymentForm = ({
  customer,
  onConfirm,
  isSubmitting,
  setIsSubmitting,
  paymentError,
  setPaymentError,
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async () => {
    if (!stripe || !elements) return;
    setIsSubmitting(true);
    setPaymentError("");

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout`,
        receipt_email: customer.email || undefined,
        payment_method_data: {
          billing_details: {
            name: customer.name || undefined,
            email: customer.email || undefined,
          },
        },
      },
      redirect: "if_required",
    });

    if (error) {
      setPaymentError(error.message || "Payment failed. Please try again.");
      setIsSubmitting(false);
      return;
    }

    await onConfirm(paymentIntent.id);
  };

  return (
    <div className="space-y-3">
      <PaymentElement />
      <p className="text-xs text-neutral-600">
        Powered by Stripe. Use test card 4242 4242 4242 4242, any future date, any CVC.
      </p>
      {paymentError ? (
        <p className="text-xs font-semibold text-red-600">{paymentError}</p>
      ) : null}
      <Button
        className="w-full bg-[#6E4A27] text-white hover:bg-[#55381e]"
        onClick={handleSubmit}
        disabled={isSubmitting || !stripe || !elements}
      >
        {isSubmitting ? "Processing..." : "Pay with card"}
      </Button>
    </div>
  );
};

const CheckoutPage = () => {
  const API_BASE = useMemo(() => {
    const raw = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8000").replace(/\/+$/, "");
    return raw.endsWith("/api") ? raw : `${raw}/api`;
  }, []);
  const { items, totals, clear } = useCart();
  const [customer, setCustomer] = useState({ name: "", email: "", note: "" });
  const [clientSecret, setClientSecret] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [orderStatus, setOrderStatus] = useState("");

  const startCheckout = async () => {
    if (!items.length) {
      setPaymentError("Cart is empty.");
      return;
    }
    if (!stripePromise) {
      setPaymentError("Stripe publishable key missing. Add VITE_STRIPE_PUBLISHABLE_KEY.");
      return;
    }

    setPaymentError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE}/checkout/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({ id: item.id, quantity: item.quantity })),
          customer,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || "Unable to start checkout.");
      }

      setClientSecret(data.clientSecret);
      setPaymentIntentId(data.paymentIntentId);
      setOrderId(data.orderId);
    } catch (error) {
      setPaymentError(error.message || "Unable to start checkout.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const finalizeOrder = async (paymentIntentIdValue) => {
    try {
      const response = await fetch(`${API_BASE}/checkout/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentIntentId: paymentIntentIdValue || paymentIntentId,
          orderId,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || "Unable to confirm payment.");
      }

      setOrderStatus(data.order?.status || "succeeded");
      clear();
    } catch (error) {
      setPaymentError(error.message || "Unable to confirm payment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[90vh] bg-gradient-to-b from-[#f6efe7] via-white to-[#f9f5ef] text-[#1f130a]">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 pb-16 pt-12">
        <div className="flex items-center justify-between">
          <Link
            to="/cart"
            className="flex items-center gap-2 text-sm font-semibold text-[#6E4A27] underline"
          >
            <ArrowLeft className="size-4" /> Back to cart
          </Link>
        </div>

        <Card className="bg-white/90 shadow-lg ring-1 ring-amber-100">
          <CardHeader>
            <CardTitle className="text-2xl">Checkout</CardTitle>
            <CardDescription className="text-neutral-700">
              Enter your details, review totals, and pay via Stripe.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#2b1b12]">Full name</label>
                <Input
                  value={customer.name}
                  onChange={(e) => setCustomer((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Aisha Khan"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#2b1b12]">Email</label>
                <Input
                  type="email"
                  value={customer.email}
                  onChange={(e) => setCustomer((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="you@example.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#2b1b12]">Notes</label>
                <textarea
                  rows={4}
                  value={customer.note}
                  onChange={(e) => setCustomer((prev) => ({ ...prev, note: e.target.value }))}
                  className="w-full rounded-lg border border-amber-200 bg-transparent px-3 py-2 text-sm text-[#2b1b12] shadow-xs outline-none transition focus-visible:border-[#6E4A27] focus-visible:ring-2 focus-visible:ring-[#6E4A27]/30"
                  placeholder="Delivery notes or gift message."
                />
              </div>
              <div className="grid gap-3 rounded-xl border border-amber-100 bg-amber-50/60 p-4 text-sm text-neutral-700">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-[#6E4A27]" />
                  <span>Curated in-house, limited seasonal drop.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="size-4 text-[#6E4A27]" />
                  <span>Ships in 48h. Free over $95.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="size-4 text-[#6E4A27]" />
                  <span>Secure Stripe checkout.</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[#2b1b12]">Order summary</p>
                <span className="text-xs text-neutral-600">
                  {items.length} item{items.length === 1 ? "" : "s"}
                </span>
              </div>
              <div className="mt-3 space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span className="text-neutral-700">
                      {item.title} x {item.quantity}
                    </span>
                    <span className="font-semibold text-[#6E4A27]">
                      {currency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-1 text-sm text-neutral-700">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span>{currency(totals.subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Shipping</span>
                  <span>{totals.shipping === 0 ? "Free" : currency(totals.shipping)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tax</span>
                  <span>{currency(totals.tax)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-amber-100 pt-2 text-base font-semibold text-[#2b1b12]">
                  <span>Total</span>
                  <span>{currency(totals.total)}</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-amber-100 bg-white/70 p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Shield className="size-4 text-[#6E4A27]" />
                  <p className="text-sm font-semibold text-[#2b1b12]">
                    Pay with Stripe (test or live)
                  </p>
                </div>
                <div className="text-xs text-neutral-500">Card payments</div>
              </div>

              {clientSecret && stripePromise ? (
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: { theme: "flat" },
                  }}
                >
                  <PaymentForm
                    customer={customer}
                    onConfirm={finalizeOrder}
                    isSubmitting={isSubmitting}
                    setIsSubmitting={setIsSubmitting}
                    paymentError={paymentError}
                    setPaymentError={setPaymentError}
                  />
                </Elements>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-neutral-700">
                    Click below to create a secure payment session.
                  </p>
                  <Button
                    className="w-full bg-[#6E4A27] text-white hover:bg-[#55381e]"
                    onClick={startCheckout}
                    disabled={isSubmitting || !items.length}
                  >
                    <CreditCard className="mr-2 size-4" />
                    {isSubmitting ? "Starting checkout..." : "Start checkout"}
                  </Button>
                  {paymentError ? (
                    <p className="text-xs font-semibold text-red-600">{paymentError}</p>
                  ) : null}
                </div>
              )}
            </div>
          </CardContent>
          {orderStatus ? (
            <CardFooter className="flex flex-col gap-2 border-t border-amber-100">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#2b1b12]">
                <Check className="size-4 text-green-600" />
                Payment status: {orderStatus}
              </div>
              {orderId ? (
                <p className="text-xs text-neutral-700">Order ID: {orderId}</p>
              ) : null}
            </CardFooter>
          ) : null}
        </Card>
      </div>
    </div>
  );
};

export default CheckoutPage;

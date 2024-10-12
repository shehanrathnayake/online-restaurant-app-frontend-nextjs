'use client';

import CheckoutCart from "@/components/CheckoutCart";
import CheckoutForm from "@/components/CheckoutForm";
import { useInitialRender } from "@/utils/useInitialRender";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe("pk_test_51Q96ye01AZUKpa9HNGAq3YUpVbkk3fM4TrWq4WxZwHQ99fe039PeXpa3flowsTqqmXSMQUJgDWAgM2ovTrLA7Zvy00CFTt7fHy");

export default function Checkout() {
  const initialRender = useInitialRender();
  if (!initialRender) return null;

  return (
    <section className="container mx-auto py-24">
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-2">
          <CheckoutCart />
        </div>
        <div className="col-span-3">
          <Elements stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        </div>
      </div>
    </section>
  );
}
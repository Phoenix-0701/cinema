import React from "react";
import { CheckoutLayout } from "@/src/features/checkout";

export default function CheckoutPage() {
  return (
    // Không cần Header/Footer vì RootLayout đã bao gồm
    <CheckoutLayout />
  );
}

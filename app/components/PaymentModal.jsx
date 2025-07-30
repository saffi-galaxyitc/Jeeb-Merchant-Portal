"use client";
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { X, CreditCard } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { useJeebContext } from "../context/JeebContext";
import { useState } from "react";

export default function PaymentModal() {
  const { isPaymentModalOpen, closePaymentModal } = useJeebContext();
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [cardNumber, setCardNumber] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    closePaymentModal();
    // Handle payment logic here
  };

  const formatCardNumber = (value) => {
    // Remove all non-digit characters
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    // Add space every 4 digits
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  return (
    <Dialog
      open={isPaymentModalOpen}
      onOpenChange={closePaymentModal}
      close={closePaymentModal}
    >
      <DialogContent className="max-w-md p-0 gap-0 bg-white rounded-2xl border-0 shadow-2xl">
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle asChild>
                <h2 className="text-xl font-semibold text-gray-900">
                  Select Payment Option
                </h2>
              </DialogTitle>
              <p className="text-sm text-gray-500 mt-1">
                All transactions are secured and encrypted
              </p>
            </div>
            {/* <button
              onClick={closePaymentModal}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button> */}
          </div>
        </div>

        {/* Payment Options */}
        <div className="px-6 pb-6">
          <RadioGroup
            value={paymentMethod}
            onValueChange={setPaymentMethod}
            className="space-y-4"
          >
            {/* Credit Card Option */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl bg-gray-50">
                <RadioGroupItem
                  value="credit-card"
                  id="credit-card"
                  className="border-blue-500 text-blue-500"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <label
                        htmlFor="credit-card"
                        className="text-base font-medium text-gray-900 cursor-pointer"
                      >
                        Credit card
                      </label>
                      <p className="text-sm text-gray-500">
                        Pay securely using Visa, Master cards
                      </p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-8 h-5 bg-red-500 rounded-sm"></div>
                      <div className="w-8 h-5 bg-orange-400 rounded-sm"></div>
                      <span className="text-xs text-gray-600 ml-1">
                        mastercard
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Credit Card Form */}
              {paymentMethod === "credit-card" && (
                <div className="space-y-4 p-4 border border-gray-200 rounded-xl bg-white">
                  {/* Card Number */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="card-number"
                      className="text-sm font-medium text-gray-700"
                    >
                      Card Number
                    </Label>
                    <div className="relative">
                      <Input
                        id="card-number"
                        value={cardNumber}
                        onChange={(e) =>
                          setCardNumber(formatCardNumber(e.target.value))
                        }
                        placeholder="1234 5678 9012 3456"
                        className="pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        maxLength={19}
                      />
                      <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  {/* Name, Expiry, CVV */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="name-on-card"
                        className="text-sm font-medium text-gray-700"
                      >
                        Name on card
                      </Label>
                      <Input
                        id="name-on-card"
                        value={nameOnCard}
                        onChange={(e) => setNameOnCard(e.target.value)}
                        placeholder="John Doe"
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="expiry-date"
                        className="text-sm font-medium text-gray-700"
                      >
                        Expiry date
                      </Label>
                      <Input
                        id="expiry-date"
                        value={expiryDate}
                        onChange={(e) =>
                          setExpiryDate(formatExpiryDate(e.target.value))
                        }
                        placeholder="MM/YY"
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        maxLength={5}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="cvv"
                        className="text-sm font-medium text-gray-700"
                      >
                        CVV
                      </Label>
                      <Input
                        id="cvv"
                        value={cvv}
                        onChange={(e) =>
                          setCvv(
                            e.target.value.replace(/\D/g, "").substring(0, 4)
                          )
                        }
                        placeholder="123"
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        maxLength={4}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Google Pay Option */}
            <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <RadioGroupItem
                value="google-pay"
                id="google-pay"
                className="border-gray-400"
              />
              <label
                htmlFor="google-pay"
                className="text-base font-medium text-gray-900 cursor-pointer flex-1"
              >
                Google pay
              </label>
            </div>
          </RadioGroup>

          {/* Pay Button */}
          <Button
            onClick={handlePayment}
            disabled={
              isProcessing ||
              (paymentMethod === "credit-card" &&
                (!cardNumber || !nameOnCard || !expiryDate || !cvv))
            }
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Processing...</span>
              </div>
            ) : (
              "Pay | $200 per month"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

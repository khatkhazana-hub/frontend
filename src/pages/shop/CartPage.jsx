import React from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, ShoppingCart, Trash2, ArrowLeft, CreditCard } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const currency = (value) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

const CartPage = () => {
  const { items, totals, updateQuantity, removeItem, clear } = useCart();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-[90vh] bg-gradient-to-b from-[#f6efe7] via-white to-[#f9f5ef] text-[#1f130a]">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 pb-16 pt-12">
        <div className="flex items-center justify-between">
          <Link
            to="/shop"
            className="flex items-center gap-2 text-sm font-semibold text-[#6E4A27] underline"
          >
            <ArrowLeft className="size-4" /> Continue shopping
          </Link>
          <Button variant="ghost" size="sm" className="text-xs" onClick={clear} disabled={!items.length}>
            Clear cart
          </Button>
        </div>

        <Card className="bg-white/90 shadow-lg ring-1 ring-amber-100">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl">
              <ShoppingCart className="size-5 text-[#6E4A27]" />
              Your cart ({cartCount})
            </CardTitle>
            <Link
              to="/checkout"
              className="rounded-md bg-[#6E4A27] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[#55381e]"
            >
              Go to checkout
            </Link>
          </CardHeader>

          <CardContent className="space-y-4">
            {items.length === 0 ? (
              <p className="text-sm text-neutral-600">No items yet. Add something from the shop.</p>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-3 rounded-lg border border-amber-100 bg-amber-50/60 p-3 sm:flex-row sm:items-center"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-16 w-16 rounded-md object-cover"
                    loading="lazy"
                  />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-semibold text-[#2b1b12]">{item.title}</p>
                    <p className="text-xs text-neutral-600">{item.category}</p>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="size-4" />
                      </Button>
                      <span className="min-w-[32px] text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus className="size-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-sm font-semibold text-[#6E4A27]">
                      {currency(item.price * item.quantity)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="size-4" />
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-3 border-t border-amber-100 pt-4">
            <div className="w-full space-y-1 text-sm">
              <div className="flex items-center justify-between text-neutral-700">
                <span>Subtotal</span>
                <span>{currency(totals.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-neutral-700">
                <span>Shipping</span>
                <span>{totals.shipping === 0 ? "Free" : currency(totals.shipping)}</span>
              </div>
              <div className="flex items-center justify-between text-neutral-700">
                <span>Tax (7%)</span>
                <span>{currency(totals.tax)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-amber-100 pt-2 text-lg font-semibold text-[#2b1b12]">
                <span>Total</span>
                <span>{currency(totals.total)}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="w-full rounded-md bg-[#6E4A27] px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-[#55381e]"
            >
              <CreditCard className="mr-2 inline size-4" />
              Proceed to checkout
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CartPage;

import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Sparkles, Truck, Shield, ShoppingCart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import api from "@/utils/api";

const currency = (value) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

const ProductDetailPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addItem, items } = useCart();

  useEffect(() => {
    let isMounted = true;
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/products/${productId}`);
        if (isMounted) {
          setProduct(data);
          setError("");
        }
      } catch (err) {
        if (isMounted) setError(err?.response?.data?.message || "Product not found");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchProduct();
    return () => {
      isMounted = false;
    };
  }, [productId]);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4">
        <p className="text-lg font-semibold">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4">
        <p className="text-lg font-semibold">{error || "Product not found."}</p>
        <Link to="/shop" className="text-[#6E4A27] underline">
          Back to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[90vh] bg-gradient-to-b from-[#f6efe7] via-white to-[#f9f5ef] text-[#1f130a]">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 pb-16 pt-12">
        <div className="flex items-center justify-between">
          <Link
            to="/shop"
            className="flex items-center gap-2 text-sm font-semibold text-[#6E4A27] underline"
          >
            <ArrowLeft className="size-4" /> Back to products
          </Link>
          <Link
            to="/cart"
            className="flex items-center gap-2 rounded-full bg-[#6E4A27] px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-[#55381e]"
          >
            <ShoppingCart className="size-4" />
            Cart ({cartCount})
          </Link>
        </div>

        <Card className="grid gap-6 bg-white/90 p-4 shadow-lg ring-1 ring-amber-100 md:grid-cols-2">
          <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl">
              <img
                src={product.image}
                alt={product.title}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <CardHeader className="p-0">
              <CardTitle className="text-2xl">{product.title}</CardTitle>
              <CardDescription className="text-base text-neutral-700">
                {product.description}
              </CardDescription>
            </CardHeader>

            <div className="flex items-center gap-3 text-sm text-neutral-700">
              <span className="rounded-full bg-amber-50 px-3 py-1 text-[#6E4A27] ring-1 ring-amber-100">
                {product.category}
              </span>
              {product.tag ? (
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#6E4A27] ring-1 ring-amber-100">
                  {product.tag}
                </span>
              ) : null}
              <span>{product.inStock ? "In stock" : "Made to order"}</span>
            </div>

            <p className="text-3xl font-semibold text-[#6E4A27]">{currency(product.price)}</p>

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

            <CardFooter className="p-0">
              <Button
                className="w-full bg-[#6E4A27] text-white hover:bg-[#55381e]"
                onClick={() => addItem({ ...product, id: product._id }, 1)}
              >
                <ShoppingCart className="size-4" />
                Add to cart
              </Button>
            </CardFooter>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProductDetailPage;

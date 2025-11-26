import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Truck, Shield, ShoppingCart, Star } from "lucide-react";
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
import useProducts from "@/hooks/useProducts";

const currency = (value) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

const ShopPage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const { items, addItem } = useCart();
  const { products, loading } = useProducts({ auto: true });

  const categories = useMemo(
    () => ["all", ...new Set(products.map((item) => item.category).filter(Boolean))],
    [products]
  );

  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") return products;
    return products.filter((item) => item.category === activeCategory);
  }, [activeCategory, products]);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-[90vh] bg-gradient-to-b from-[#f6efe7] via-white to-[#f9f5ef] text-[#1f130a]">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-16 pt-12">
        <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6E4A27]">
              Khat Khazana Atelier
            </p>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold leading-tight md:text-4xl">
                Artefacts for letter lovers
              </h1>
              <p className="max-w-2xl text-base text-neutral-700 md:text-lg">
                Browse the collection, dive into details, and add items to your cart before
                checkout.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-700">
              <div className="flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 shadow-sm ring-1 ring-amber-100">
                <Sparkles className="size-4 text-[#6E4A27]" />
                <span>Limited seasonal drop</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 shadow-sm ring-1 ring-amber-100">
                <Truck className="size-4 text-[#6E4A27]" />
                <span>Free shipping over $95</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 shadow-sm ring-1 ring-amber-100">
                <Shield className="size-4 text-[#6E4A27]" />
                <span>Secure checkout</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            <Link
              to="/cart"
              className="flex items-center gap-2 rounded-full bg-[#6E4A27] px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-[#55381e]"
            >
              <ShoppingCart className="size-4" />
              Cart ({cartCount})
            </Link>
          </div>
        </header>

        <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
          <section className="space-y-6">
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <Button
                    key={cat}
                    variant={isActive ? "default" : "outline"}
                    onClick={() => setActiveCategory(cat)}
                    className={
                      isActive
                        ? "bg-[#6E4A27] text-white hover:bg-[#55381e]"
                        : "border-amber-200 text-[#6E4A27] hover:bg-amber-50"
                    }
                  >
                    {cat === "all" ? "All items" : cat}
                  </Button>
                );
              })}
            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {loading ? (
                <p className="text-sm text-neutral-600">Loading products...</p>
              ) : filteredProducts.length ? (
                filteredProducts.map((product) => (
                  <Card
                    key={product._id}
                    className="bg-white/90 ring-1 ring-amber-100 transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <CardHeader className="gap-3">
                      <div className="relative h-44 overflow-hidden rounded-xl">
                        <img
                          src={product.image}
                          alt={product.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-300 hover:scale-105"
                        />
                        {product.tag ? (
                          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#6E4A27] shadow-sm ring-1 ring-amber-100">
                            {product.tag}
                          </span>
                        ) : null}
                      </div>
                      <CardTitle className="text-xl leading-tight">{product.title}</CardTitle>
                      <CardDescription className="text-sm text-neutral-700">
                        {(product.description || "").slice(0, 90)}...
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-semibold text-[#6E4A27]">
                          {currency(product.price)}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-amber-700">
                          <Star className="size-4 fill-amber-500 text-amber-500" />
                          <span className="font-semibold">{product.rating || 4.8}</span>
                          <span className="text-neutral-500">
                            ({product.reviews || 0})
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-neutral-600">
                        <span>{product.inStock ? "In stock" : "Made to order"}</span>
                        <span>{product.category}</span>
                      </div>
                    </CardContent>

                    <CardFooter className="flex flex-col gap-2">
                      <Button
                        className="w-full bg-[#6E4A27] text-white hover:bg-[#55381e]"
                        onClick={() => addItem({ ...product, id: product._id }, 1)}
                      >
                        <ShoppingCart className="size-4" />
                        Add to cart
                      </Button>
                      <Link
                        to={`/shop/${product._id}`}
                        className="w-full rounded-md border border-amber-200 px-4 py-2 text-center text-sm font-semibold text-[#6E4A27] transition hover:bg-amber-50"
                      >
                        View details
                      </Link>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <p className="text-sm text-neutral-600">No products available.</p>
              )}
            </div>
          </section>

          <aside className="space-y-4 lg:sticky lg:top-24">
            <Card className="bg-white/90 shadow-md ring-1 ring-amber-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <ShoppingCart className="size-5 text-[#6E4A27]" />
                  Your cart
                </CardTitle>
                <CardDescription className="text-neutral-700">
                  {cartCount ? `${cartCount} item(s) in cart.` : "Nothing here yet."}
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Link
                  to="/cart"
                  className="w-full rounded-md bg-[#6E4A27] px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-[#55381e]"
                >
                  Go to cart
                </Link>
              </CardFooter>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;

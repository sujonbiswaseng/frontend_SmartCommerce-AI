"use client";

import React, { useEffect, useMemo, useState, useDeferredValue } from "react";
import { Search, SlidersHorizontal, Sparkles, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
type Product = {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  date: string;
};

type ProductCardProps = {
  p: Product;
};
type ProductCardSkeletonProps = {};

const categories = ["All", "Books", "AI Tools", "Gadgets", "Courses", "Lifestyle"];

// Dummy data: Replace with fetch or SSR/ISR for real app
const products: Product[] = [
  {
    id: "1",
    title: "Smart Coffee Mug",
    description: "Keeps your coffee at the perfect temperature with built-in AI.",
    category: "Gadgets",
    price: 45,
    rating: 4.7,
    date: "2024-06-13",
  },
  {
    id: "2",
    title: "AI-Powered Journal",
    description: "Guided journaling with personalized AI insights.",
    category: "Lifestyle",
    price: 30,
    rating: 4.9,
    date: "2024-05-15",
  },
  {
    id: "3",
    title: "The AI Playbook",
    description: "A practical guide to AI for business leaders.",
    category: "Books",
    price: 65,
    rating: 4.8,
    date: "2024-03-20",
  },
  // ...add more products as needed
];

// Enterprise SaaS Product Card Component
const ProductCard: React.FC<ProductCardProps> = ({ p }) => (
  <div className="rounded-2xl border border-border bg-card p-6 shadow-card flex flex-col gap-4 transition hover:shadow-xl focus-within:shadow-xl outline-none duration-150">
    <h4 className="font-medium text-base leading-tight tracking-tight truncate">{p.title}</h4>
    <span className="text-xs font-medium text-muted-foreground">{p.category}</span>
    <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-3">{p.description}</p>
    <div className="mt-auto flex justify-between items-center pt-4">
      <span className="font-semibold text-lg text-indigo-600 dark:text-indigo-400">${p.price}</span>
      <span className="text-xs flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
        <span role="img" aria-label="rating">⭐</span>
        {p.rating}
      </span>
    </div>
  </div>
);

// Product Card Skeleton Loader
const ProductCardSkeleton: React.FC<ProductCardSkeletonProps> = () => (
  <div className="animate-pulse rounded-2xl border border-border bg-card p-6 shadow-card min-h-[178px] flex flex-col gap-4">
    <div className="h-6 bg-muted rounded w-3/4 mb-1" />
    <div className="h-3 bg-muted rounded w-1/2" />
    <div className="h-3 bg-muted rounded w-full" />
    <div className="mt-auto flex justify-between items-center pt-4">
      <div className="h-5 w-16 bg-muted rounded" />
      <div className="h-5 w-8 bg-muted rounded" />
    </div>
  </div>
);

const PER_PAGE = 8;

const ProductsPage: React.FC = () => {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [category, setCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(500);
  const [sort, setSort] = useState("popular");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [aiOpen, setAiOpen] = useState(false);
  const [message,setmessage]=useState<any[]>()
  const [aiQuery, setAiQuery] = useState("");
  const [aiPicks, setAiPicks] = useState<string[]>([]);
  const [aiLoading, setAiLoading] = useState(false);


  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => { setPage(1); }, [debounced, category, maxPrice, sort]);

  const deferred = useDeferredValue(debounced);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (category !== "All" && p.category !== category) return false;
      if (p.price > maxPrice) return false;
      if (
        deferred &&
        !(
          `${p.title} ${p.description} ${p.category}`
            .toLowerCase()
            .includes(deferred.toLowerCase())
        )
      )
        return false;
      return true;
    });
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    if (sort === "newest") list = [...list].sort((a, b) => b.date.localeCompare(a.date));
    return list;
  }, [deferred, category, maxPrice, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 py-12">
      <section className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="font-bold text-3xl md:text-4xl tracking-tight mb-2">Explore the catalog</h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-base">{filtered.length} products curated by humans, ranked by AI.</p>
          </div>
          <Button
            onClick={() => setAiOpen((v) => !v)}
            className="bg-gradient-to-tr from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-100/25 dark:shadow-none rounded-xl px-6 py-3 font-medium text-base transition hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-indigo-500"
          >
            <Sparkles className="size-4 mr-2" />
            AI Stylist
          </Button>
        </div>
        {aiOpen && (
          <div className="mb-8 rounded-2xl border border-border bg-card/90 p-6 shadow-lg flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <span className="size-9 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 grid place-items-center">
                <Sparkles className="size-4 text-white" />
              </span>
              <h3 className="text-lg font-semibold">Tell the AI what you're looking for</h3>
            </div>
            {/* <form onSubmit={runAi} className="flex flex-col sm:flex-row gap-4">
              <Input
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder="e.g. a quiet gift for a coffee lover under $50"
                className="flex-1 text-base rounded-lg"
                aria-label="AI stylist query"
              />
              <Button
                type="submit"
                disabled={aiLoading}
                className="bg-gradient-to-tr from-emerald-500 to-indigo-500 text-white font-semibold rounded-lg px-6 flex items-center gap-2 transition"
              >
                {aiLoading ? <Loader2 className="size-4 animate-spin" /> : "Recommend"}
              </Button>
            </form> */}
            {aiPicks.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {aiPicks.map((id) => {
                  const p = products.find((x) => x.id === id);
                  return p ? <ProductCard key={id} p={p} /> : null;
                })}
              </div>
            )}
          </div>
        )}
      </section>

      <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
        {/* Sidebar Filters */}
        <aside className="space-y-8">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products"
                className="pl-10 text-base h-11 rounded-lg"
                aria-label="Search products"
              />
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-8">
            <div className="flex items-center gap-2 font-medium text-sm mb-2">
              <SlidersHorizontal className="size-4" />
              Filters
            </div>
            <div>
              <label htmlFor="category-filter" className="text-xs text-muted-foreground mb-3 block">
                Category
              </label>
              <div className="flex flex-wrap gap-2" id="category-filter">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    type="button"
                    className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors duration-100
                      ${
                        category === c
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                          : "border-border bg-background hover:bg-accent hover:border-indigo-200/60"
                      }
                    `}
                    aria-pressed={category === c}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="max-price" className="text-xs text-muted-foreground">
                  Max price
                </label>
                <span className="text-xs font-medium">${maxPrice}</span>
              </div>
              {/* Example: Integrate Slider for price when available */}
              {/* <Slider value={[maxPrice]} onValueChange={(v: any) => setMaxPrice(v[0])} min={20} max={500} step={10} /> */}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mb-8 gap-4">
            <div className="flex flex-wrap gap-2">
              {category !== "All" && <Badge variant="secondary" className="rounded-lg">{category}</Badge>}
              {debounced && <Badge variant="secondary" className="rounded-lg">"{debounced}"</Badge>}
            </div>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-[180px] ml-auto font-medium rounded-lg focus-visible:ring-indigo-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most popular</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="rating">Top rated</SelectItem>
                <SelectItem value="price-asc">Price: low → high</SelectItem>
                <SelectItem value="price-desc">Price: high → low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : paged.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-20 text-center bg-card/80 flex flex-col items-center justify-center gap-4 shadow-inner min-h-[220px]">
              <p className="text-muted-foreground text-lg mb-2">
                No products match your filters.
              </p>
              <Button
                onClick={() => {
                  setCategory("All");
                  setQuery("");
                  setMaxPrice(500);
                }}
                variant="ghost"
                className="rounded-lg text-indigo-600 dark:text-indigo-300 font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/10"
              >
                Reset filters
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {paged.map((p) => <ProductCard key={p.id} p={p} />)}
              </div>
              {totalPages > 1 && (
                <nav
                  className="mt-12 flex items-center justify-center gap-3"
                  aria-label="Pagination"
                >
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`size-10 rounded-lg font-semibold text-base transition
                        ${
                          page === i + 1
                            ? "bg-indigo-600 text-white shadow"
                            : "border border-border bg-background hover:bg-indigo-50 dark:hover:bg-indigo-900/10 text-zinc-600 dark:text-zinc-300"
                        }
                      `}
                      aria-current={page === i + 1 ? "page" : undefined}
                    >
                      {i + 1}
                    </button>
                  ))}
                </nav>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductsPage;

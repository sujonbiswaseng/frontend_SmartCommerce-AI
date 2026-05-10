"use client";

import { useState } from "react";
import { Loader2, Check, Mail, MessageSquare, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function ContactContent() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  const [result, setResult] = useState("");

  const onSubmit = async (event:any) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target);
    formData.append("access_key", "f2820b3b-d42d-4639-89e7-3edf794e9596");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();
    if (data.success) {
      setResult("Form Submitted Successfully");
      event.target.reset();
    } else {
      setResult("Error");
    }
  };


  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 py-20 flex justify-center items-center min-h-[60vh]">
      <div className="w-full grid gap-12 lg:grid-cols-2 items-center">
        {/* Info Section */}
        <section className="w-full">
          <h1 className="text-[2.5rem] lg:text-5xl font-bold tracking-tight leading-tight">
            Contact our team
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-[40ch]">
            Whether you're scaling a 7-figure store or just exploring AI commerce, we'd love to hear from you.
          </p>
          <div className="mt-10 space-y-6">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-2xl bg-accent/60 flex items-center justify-center">
                <Mail className="size-5 text-primary" />
              </div>
              <div>
                <div className="font-medium text-base">Email</div>
                <a
                  href="mailto:hello@novaai.shop"
                  className="text-sm text-muted-foreground hover:text-primary focus-visible:underline transition-colors"
                >
                  hello@novaai.shop
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-2xl bg-accent/60 flex items-center justify-center">
                <MessageSquare className="size-5 text-primary" />
              </div>
              <div>
                <div className="font-medium text-base">Live chat</div>
                <div className="text-sm text-muted-foreground">
                  Mon–Fri · 9am–6pm CET
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-2xl bg-accent/60 flex items-center justify-center">
                <MapPin className="size-5 text-primary" />
              </div>
              <div>
                <div className="font-medium text-base">Office</div>
                <div className="text-sm text-muted-foreground">
                  Berlin · Mitte 12, 10117
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* END Info Section */}

        {/* Contact Form */}
        <section>
          <form
            onSubmit={onSubmit}
            className="rounded-2xl bg-card border border-border shadow-card px-8 py-10 max-w-md mx-auto space-y-8 relative"
            autoComplete="off"
          >
            <div className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-base font-medium">Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Your full name"
                  className="mt-2 h-12"
                  autoComplete="name"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-base font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="you@email.com"
                  className="mt-2 h-12"
                  autoComplete="email"
                />
              </div>
              <div>
                <Label htmlFor="message" className="text-base font-medium">Message</Label>
                <Textarea
                  id="message"
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  placeholder="How can we help you?"
                  className="mt-2 min-h-32"
                />
              </div>
            </div>
            <AnimatePresence>
              {err && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="text-sm text-destructive mt-1"
                >
                  {err}
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {done && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="text-sm text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-2 mt-2 font-medium"
                >
                  <Check className="size-4" />
                  Message sent — we'll be in touch.
                </motion.div>
              )}
            </AnimatePresence>
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-glow rounded-2xl text-base font-semibold transition-colors"
            >
              {loading ? <Loader2 className="size-5 animate-spin" /> : "Send message"}
            </Button>
          </form>
        </section>
        {/* END Form */}
      </div>
    </div>
  );
}

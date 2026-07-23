"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaClock,
  FaFacebook,
} from "react-icons/fa";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setSending(true);
    setSuccess(false);

    const { error } = await supabase
      .from("contact_messages")
      .insert([
        {
          name,
          email,
          message,
        },
      ]);

    setSending(false);

    if (error) {
      alert(error.message);
      return;
    }

    setName("");
    setEmail("");
    setMessage("");
    setSuccess(true);
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/50 relative overflow-hidden pb-24">
      {/* Decorative Vibrant Background Blurs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-pink-400/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 pt-20 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight mb-6">
            Contact <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Us</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed">
            We'd love to hear from you. Get in touch with Nazareno Elementary School.
          </p>

          <div className="flex items-center justify-center gap-2 mt-8">
            <span className="w-12 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></span>
            <span className="w-4 h-1.5 bg-amber-400 rounded-full"></span>
            <span className="w-12 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></span>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-10">
          
          {/* Left Column: School Information */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-blue-500/10 p-10 border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-blue-100 to-transparent rounded-bl-full pointer-events-none" />
            
            <h2 className="text-3xl font-extrabold text-slate-900 mb-8 relative z-10">
              School Details
            </h2>

            <div className="space-y-8 text-slate-700 relative z-10">
              <div className="flex items-start gap-5 group">
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-red-50 text-red-500 shadow-sm group-hover:scale-110 group-hover:bg-red-500 group-hover:text-white transition-all duration-300 shrink-0">
                  <FaMapMarkerAlt className="text-2xl" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg mb-1">Address</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Barangay Nazareno<br />
                    Gubat, Sorsogon,<br />Philippines
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5 group">
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 shadow-sm group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300 shrink-0">
                  <FaEnvelope className="text-2xl" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg mb-1">Email</h3>
                  <p className="text-slate-600 font-medium hover:text-amber-600 transition-colors cursor-pointer">
                    114214@deped.gov.ph
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5 group">
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-500 shadow-sm group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 shrink-0">
                  <FaPhone className="text-2xl" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg mb-1">Telephone</h3>
                  <p className="text-slate-600 font-medium">+63 9685289257</p>
                </div>
              </div>

              <div className="flex items-start gap-5 group">
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-purple-50 text-purple-500 shadow-sm group-hover:scale-110 group-hover:bg-purple-500 group-hover:text-white transition-all duration-300 shrink-0">
                  <FaClock className="text-2xl" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg mb-1">Office Hours</h3>
                  <p className="text-slate-600">
                    Monday – Friday<br />
                    8:00 AM – 5:00 PM
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5 group">
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 shadow-sm group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shrink-0">
                  <FaFacebook className="text-2xl" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg mb-1">Facebook</h3>
                  <a
                    href="https://www.facebook.com/profile.php?id=100092447396923"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 font-medium hover:text-blue-800 hover:underline transition-colors"
                  >
                    Nazareno Elem School
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form & Map */}
          <div className="lg:col-span-3 space-y-10">
            
            {/* Form Section */}
            <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-indigo-500/10 p-10 border border-slate-100">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
                Send Us a Message
              </h2>
              <p className="text-slate-500 mb-8 font-medium">
                Have any questions? Fill out the form below and we'll get back to you.
              </p>

              {success && (
                <div className="mb-8 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 text-emerald-800 p-5 rounded-2xl shadow-sm flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2">
                  <div className="bg-emerald-500 text-white p-1.5 rounded-full shrink-0 mt-0.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <div>
                    <strong className="block text-emerald-900 text-lg mb-1">Message Sent Successfully!</strong>
                    <p className="text-emerald-700/90 text-sm">Thank you for contacting Nazareno Elementary School. We have received your message and will respond shortly.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 pl-2">Full Name</label>
                    <input
                      type="text"
                      placeholder="Juan Dela Cruz"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl p-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all shadow-sm"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 pl-2">Email Address</label>
                    <input
                      type="email"
                      placeholder="juan@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl p-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all shadow-sm"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 pl-2">Message</label>
                  <textarea
                    placeholder="How can we help you?"
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl p-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all shadow-sm resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                >
                  {sending ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </form>
            </div>

            {/* Map Section */}
            <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-indigo-500/10 p-6 border border-slate-100">
              <div className="overflow-hidden rounded-[2rem] border-2 border-slate-100 shadow-inner bg-slate-100 relative group">
                <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <iframe
                  src="https://www.google.com/maps?q=Nazareno%20Elementary%20School%20Gubat%20Sorsogon&output=embed"
                  width="100%"
                  height="350"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  className="grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                ></iframe>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
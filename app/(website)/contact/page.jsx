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
    <section className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4">
            Contact Us
          </h1>

          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Get in touch with Nazareno Elementary School.
          </p>

          <div className="w-24 h-1 bg-yellow-400 rounded-full mx-auto mt-8"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">
              School Information
            </h2>

            <div className="space-y-6 text-slate-700">
              <div className="flex items-start gap-4">
                <FaMapMarkerAlt className="text-blue-700 text-xl mt-1" />

                <div>
                  <h3 className="font-bold text-lg mb-2">
                    Address
                  </h3>

                  <p>
                    Barangay Nazareno
                    <br />
                    Gubat, Sorsogon,
                    Philippines
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <FaEnvelope className="text-blue-700 text-xl mt-1" />

                <div>
                  <h3 className="font-bold text-lg mb-2">
                    Email
                  </h3>

                  <p>114214@deped.gov.ph</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <FaPhone className="text-blue-700 text-xl mt-1" />

                <div>
                  <h3 className="font-bold text-lg mb-2">
                    Telephone
                  </h3>

                  <p>+63 9685289257</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <FaClock className="text-blue-700 text-xl mt-1" />

                <div>
                  <h3 className="font-bold text-lg mb-2">
                    Office Hours
                  </h3>

                  <p>
                    Monday – Friday
                    <br />
                    8:00 AM – 5:00 PM
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <FaFacebook className="text-blue-700 text-xl mt-1" />

                <div>
                  <h3 className="font-bold text-lg mb-2">
                    Facebook
                  </h3>

                  <a
                    href="https://www.facebook.com/profile.php?id=100092447396923"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 hover:underline"
                  >
                    Nazareno Elem School
                  </a>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="font-bold text-lg mb-4">
                  School Location
                </h3>

                <div className="overflow-hidden rounded-2xl border">
                  <iframe
                    src="https://www.google.com/maps?q=Nazareno%20Elementary%20School%20Gubat%20Sorsogon&output=embed"
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">
              Send Us a Message
            </h2>

            {success && (
              <div className="mb-6 bg-green-100 border border-green-300 text-green-800 p-4 rounded-xl">
                <strong>
                  ✅ Message Sent Successfully
                </strong>

                <p className="mt-2">
                  Thank you for contacting
                  Nazareno Elementary School.
                  We have received your
                  message.
                </p>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                className="w-full border rounded-xl p-4"
                required
              />

              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="w-full border rounded-xl p-4"
                required
              />

              <textarea
                placeholder="Your Message"
                rows={6}
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
                className="w-full border rounded-xl p-4 resize-none"
                required
              />

              <button
                type="submit"
                disabled={sending}
                className="bg-blue-900 text-white px-6 py-3 rounded-xl hover:bg-blue-800 transition-colors disabled:opacity-50"
              >
                {sending
                  ? "Sending..."
                  : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
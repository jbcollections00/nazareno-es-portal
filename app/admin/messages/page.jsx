"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function MessagesAdminPage() {
  const [messages, setMessages] =
    useState([]);
  const [search, setSearch] =
    useState("");

  useEffect(() => {
    loadMessages();
  }, []);

  async function loadMessages() {
    const { data } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    setMessages(data || []);
  }

  async function markAsRead(id) {
    const { error } = await supabase
      .from("contact_messages")
      .update({
        is_read: true,
      })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    loadMessages();
  }

  async function deleteMessage(id) {
    const confirmed = window.confirm(
      "Delete this message?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("contact_messages")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    loadMessages();
  }

  function exportMessages() {
    const csv = [
      [
        "Name",
        "Email",
        "Message",
        "Date",
        "Status",
      ].join(","),
      ...filteredMessages.map(
        (message) =>
          `"${message.name}","${message.email}","${String(
            message.message
          ).replace(/"/g, '""')}","${
            message.created_at
          }","${
            message.is_read
              ? "Read"
              : "Unread"
          }"`
      ),
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url =
      window.URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download =
      "contact-messages.csv";

    link.click();

    window.URL.revokeObjectURL(url);
  }

  const filteredMessages =
    messages.filter(
      (message) =>
        message.name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        message.email
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        message.message
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  const unreadCount =
    messages.filter(
      (message) => !message.is_read
    ).length;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <h1 className="text-5xl font-bold">
          Messages
        </h1>

        <div className="flex gap-3">
          <div className="bg-red-600 text-white px-5 py-3 rounded-xl font-semibold">
            {unreadCount} Unread
          </div>

          <button
            onClick={exportMessages}
            className="bg-green-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-green-700"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="mb-8">
        <input
          type="text"
          placeholder="Search messages..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full border rounded-xl p-4"
        />
      </div>

      {filteredMessages.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
          No messages found.
        </div>
      ) : (
        <div className="space-y-6">
          {filteredMessages.map(
            (message) => (
              <div
                key={message.id}
                className={`bg-white rounded-3xl shadow-lg p-6 border-l-4 ${
                  message.is_read
                    ? "border-slate-300"
                    : "border-red-500"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      {message.name}
                    </h2>

                    <p className="text-blue-700">
                      {message.email}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-slate-500">
                      {new Date(
                        message.created_at
                      ).toLocaleString()}
                    </p>

                    <span
                      className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${
                        message.is_read
                          ? "bg-slate-200 text-slate-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {message.is_read
                        ? "Read"
                        : "Unread"}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 mb-4">
                  <p className="text-slate-700 whitespace-pre-wrap">
                    {message.message}
                  </p>
                </div>

                <div className="flex gap-3">
                  {!message.is_read && (
                    <button
                      onClick={() =>
                        markAsRead(
                          message.id
                        )
                      }
                      className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700"
                    >
                      Mark as Read
                    </button>
                  )}

                  <button
                    onClick={() =>
                      deleteMessage(
                        message.id
                      )
                    }
                    className="bg-red-600 text-white px-5 py-2 rounded-xl hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
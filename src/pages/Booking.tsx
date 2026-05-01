import { useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

export function Booking() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [photographer, setPhotographer] = useState<{name: string, email: string} | null>(null);
  const [clientName, setClientName] = useState("");
  const [message, setMessage] = useState("");
  const [budgetOffer, setBudgetOffer] = useState("");

  useEffect(() => {
    async function getPhotog() {
      if (!id) return;
      try {
        const res = await fetch(`/api/photographers/${id}`);
        if (res.ok) {
          const data = await res.json();
          setPhotographer({ name: data.name, email: data.email });
        }
      } catch (err) {
        console.error("Failed to fetch photographer for booking", err);
      }
    }
    getPhotog();
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photographer) return;
    
    // Create mailto link
    const subject = encodeURIComponent(`Booking Request: ${photographer.name}`);
    let body = `Name: ${clientName || "Client"}\n`;
    body += `Budget Offer: ${budgetOffer}\n\n`;
    body += `Message/Details:\n${message}\n\n`;
    body += `------------------------\n*Sent via J&W Creative Studio*`;
    
    const mailtoLink = `mailto:${photographer.email}?subject=${subject}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
    
    setTimeout(() => navigate("/"), 1000);
  };

  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center bg-[#0a0a0a] py-12 px-4 sm:px-6 font-sans">
      <div className="w-full max-w-2xl mt-12 md:mt-0">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-serif mb-4 text-white tracking-tight">Request a Shoot</h1>
          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.2em]">
            Booking with <span className="text-white">{photographer?.name || "..."}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 p-8 md:p-12 space-y-8 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-zinc-500 mb-3">Your Name</label>
            <input 
              type="text" 
              placeholder="Full Name"
              value={clientName} 
              onChange={(e) => setClientName(e.target.value)}
              required
              className="w-full bg-black border border-zinc-800 px-4 py-4 text-white focus:outline-none focus:border-zinc-500 transition-all text-xs tracking-wide placeholder-zinc-700"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-zinc-500 mb-3">Budget Offer (USD)</label>
            <input 
              type="text" 
              placeholder="e.g. $150 or $25 for 100 photos" 
              value={budgetOffer}
              onChange={(e) => setBudgetOffer(e.target.value)}
              required
              className="w-full bg-black border border-zinc-800 px-4 py-4 text-white focus:outline-none focus:border-zinc-500 transition-all text-xs tracking-wide placeholder-zinc-700"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-zinc-500 mb-3">Shoot Details & Message</label>
            <textarea 
              rows={5}
              placeholder="Tell me about your vision, location, dates, etc."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="w-full bg-black border border-zinc-800 px-4 py-4 text-white focus:outline-none focus:border-zinc-500 transition-all text-xs tracking-wide resize-none placeholder-zinc-700"
            />
            <p className="text-[10px] text-zinc-500 mt-4 font-medium uppercase tracking-widest">Please note: Clicking submit will open your default email client to send this request.</p>
          </div>

          <button 
            type="submit"
            className="w-full py-5 bg-white text-black hover:bg-zinc-200 font-bold text-[11px] uppercase tracking-widest transition-colors mb-4"
          >
            Send Request via Email
          </button>
        </form>
      </div>
    </div>
  );
}

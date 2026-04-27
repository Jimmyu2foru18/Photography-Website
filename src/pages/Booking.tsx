import { useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

export function Booking() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [photographerName, setPhotographerName] = useState("");
  const [clientName, setClientName] = useState("");
  const [message, setMessage] = useState("");
  const [budgetOffer, setBudgetOffer] = useState("");

  useEffect(() => {
    function getPhotog() {
      if (!id) return;
      // Fallback test data
      if (id === "james-mcguigan") setPhotographerName("James McGuigan Jr");
      else if (id === "waleed-bhatti") setPhotographerName("Waleed Bhatti");
      else setPhotographerName("Photographer");
    }
    getPhotog();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          photographer_id: id,
          client_name: clientName,
          budget_offer: budgetOffer,
          message: message,
        })
      });

      if (!res.ok) throw new Error("API failed");
      
      alert("Booking request submitted to database successfully!");
      navigate("/");
    } catch (err) {
      console.warn("DB booking failed, falling back to mailto", err);
      // Create mailto link
      const subject = encodeURIComponent(`Booking Request: ${photographerName}`);
      let body = `Name: ${clientName || "Client"}\n`;
      body += `Budget Offer: ${budgetOffer}\n\n`;
      body += `Message/Details:\n${message}\n\n`;
      body += `------------------------\n*If additional contact is needed, I will reach out via 516-640-2240*`;
      
      const mailtoLink = `mailto:jimmymcguigan18@gmail.com?subject=${subject}&body=${encodeURIComponent(body)}`;
      
      // Open the user's email client
      window.location.href = mailtoLink;
      
      // Send them back to home after a short delay
      setTimeout(() => {
        navigate("/");
      }, 500);
    }
  };

  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center bg-[#0a0a0a] py-12 px-4 sm:px-6 font-sans">
      <div className="w-full max-w-2xl mt-12 md:mt-0">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-serif mb-4 text-white tracking-tight">Request a Shoot</h1>
          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.2em]">
            Booking with <span className="text-white">{photographerName}</span>
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

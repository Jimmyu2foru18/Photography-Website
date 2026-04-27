import { Lightbulb, Maximize, Settings, DollarSign, Camera } from "lucide-react";

export function Education() {
  const essentials = [
    {
      title: "Lighting Basics",
      icon: <Lightbulb className="w-6 h-6" />,
      content: "Golden hour provides the softest, most flattering natural light. When shooting mid-day, seek open shade to avoid harsh shadows and squinting."
    },
    {
      title: "Composition Rules",
      icon: <Maximize className="w-6 h-6" />,
      content: "The Rule of Thirds suggests placing your subject on intersecting grid lines. Use leading lines (like roads or fences) to draw the viewer's eye into the frame."
    },
    {
      title: "Camera Settings",
      icon: <Settings className="w-6 h-6" />,
      content: "Aperture controls depth of field (blur). Shutter speed freezes or blurs motion. ISO controls light sensitivity. Balancing these three forms the Exposure Triangle."
    }
  ];

  const expectations = [
    {
      title: "Understanding Pricing",
      icon: <DollarSign className="w-6 h-6" />,
      content: "Our pricing covers not just the time shooting, but the hours spent culling, color-correcting, and editing to our cinematic standard."
    },
    {
      title: "How a Shoot Works",
      icon: <Camera className="w-6 h-6" />,
      content: "1. Discovery: We discuss your vision.\n2. The Shoot: Relaxed, guided posing.\n3. Post-Production: We select and edit the best frames.\n4. Delivery: Receive a digital gallery."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-serif mb-6 text-white tracking-tight">The Art of Photography</h1>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 max-w-2xl mx-auto">
          Whether you're an aspiring artist or a future client, understanding the craft helps create better images.
        </p>
      </div>

      <div className="space-y-16">
        <section>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 mb-8 border-b border-zinc-800 pb-4">The Essentials</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {essentials.map((item, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 p-8">
                <div className="text-white mb-5 bg-black w-12 h-12 flex items-center justify-center rounded">
                  {item.icon}
                </div>
                <h3 className="text-[11px] uppercase tracking-wider mb-3 font-bold text-white">{item.title}</h3>
                <p className="text-[11px] font-medium text-zinc-400 leading-relaxed">{item.content}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 mb-8 border-b border-zinc-800 pb-4">Client Guide</h2>
          <div className="space-y-6">
            {expectations.map((item, i) => (
              <div key={i} className="flex flex-col md:flex-row gap-6 bg-zinc-900 border border-zinc-800 p-8 items-start">
                <span className="font-serif text-3xl text-zinc-700 shrink-0 leading-none">
                  0{i + 1}.
                </span>
                <div>
                  <h3 className="text-[12px] uppercase tracking-wider mb-3 font-bold text-white">{item.title}</h3>
                  <p className="text-[11px] font-medium text-zinc-400 leading-relaxed whitespace-pre-line">{item.content}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

import { motion } from "framer-motion";
import { 
  BookOpen, 
  Camera, 
  Lightbulb, 
  Zap, 
  Target, 
  Layers, 
  Cpu, 
  Users, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck
} from "lucide-react";

export function Education() {
  const coreCurriculum = [
    {
      title: "Mastering the Exposure Triangle",
      description: "Understand the fundamental relationship between Aperture, Shutter Speed, and ISO to achieve perfect manual control.",
      icon: <Target className="w-5 h-5" />,
      skills: ["Depth of Field Control", "Motion Blur Management", "Noise Mitigation"]
    },
    {
      title: "Cinematic Lighting Theory",
      description: "Learn to manipulate natural and artificial light to create depth, mood, and professional-grade shadows.",
      icon: <Lightbulb className="w-5 h-5" />,
      skills: ["Dynamic Range Utilization", "3-Point Lighting Setup", "Negative Fill"]
    },
    {
      title: "Advanced Composition",
      description: "Move beyond the rule of thirds into leading lines, geometric symmetry, and psychological framing.",
      icon: <Layers className="w-5 h-5" />,
      skills: ["Subliminal Storytelling", "Spatial Balance", "Visual Hierarchy"]
    },
    {
      title: "Digital Workflow & Post",
      description: "Efficiently manage high-volume shoots and develop a signature look using industry-standard software.",
      icon: <Cpu className="w-5 h-5" />,
      skills: ["Color Grade Theory", "Non-Destructive Editing", "Asset Management"]
    }
  ];

  const teachingTools = [
    {
      title: "Live Peer Reviews",
      content: "Weekly sessions where we dissect professional work and provide constructive feedback on artist submissions.",
      tip: "Focus on 'The Why' before 'The How' when analyzing an image."
    },
    {
      title: "On-Set Mentorship",
      content: "Shadow J&W lead photographers during live commercial and portrait sessions to see high-pressure decision making.",
      tip: "Observe subject interaction—it's 70% of the job."
    },
    {
      title: "Gear Simulation",
      content: "Interactive guides on choosing the right focal length for specific environments and emotional resonance.",
      tip: "A 35mm tells a story; an 85mm isolates a soul."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans selection:bg-red-500/30">
      {/* Hero Section */}
      <section className="relative py-24 px-6 md:px-16 border-b border-zinc-900 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-red-500 to-transparent"></div>
          <div className="absolute top-0 right-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-zinc-800 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-red-500 font-bold uppercase tracking-[0.4em] text-[10px] mb-6">Education & Mentorship</p>
            <h1 className="text-6xl md:text-9xl font-serif mb-8 tracking-tighter leading-none">
              The Artist's <br /><span className="text-zinc-500">Curriculum</span>
            </h1>
            <p className="max-w-2xl text-zinc-400 text-sm md:text-base leading-relaxed uppercase tracking-wider font-medium">
              We don't just capture images; we build the technical and creative foundation required to produce visual artifacts that endure. 
            </p>
          </motion.div>
        </div>
      </section>

      {/* Core Skills Curriculum */}
      <section className="py-24 px-6 md:px-16 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-xl">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600 mb-4">01 // Technical Foundation</h2>
              <h3 className="text-4xl font-serif text-white">The Essential Skills We Teach</h3>
            </div>
            <div className="flex items-center gap-4 text-zinc-500 text-[10px] font-bold uppercase tracking-widest border border-zinc-800 px-6 py-3">
              <ShieldCheck className="w-4 h-4 text-red-500" /> Professional Certification Path
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreCurriculum.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-zinc-900/50 border border-zinc-800 p-8 group hover:border-red-500/50 transition-all duration-500"
              >
                <div className="w-12 h-12 bg-black border border-zinc-800 flex items-center justify-center mb-6 text-zinc-400 group-hover:text-red-500 transition-colors">
                  {item.icon}
                </div>
                <h4 className="text-lg font-serif text-white mb-4">{item.title}</h4>
                <p className="text-xs text-zinc-500 leading-relaxed mb-8 uppercase tracking-wide font-medium">
                  {item.description}
                </p>
                <ul className="space-y-3">
                  {item.skills.map((skill, si) => (
                    <li key={si} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      <CheckCircle2 className="w-3 h-3 text-red-500" /> {skill}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Teaching Tools & Tips */}
      <section className="py-24 px-6 md:px-16 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-4 sticky top-32">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600 mb-4">02 // Methodology</h2>
              <h3 className="text-4xl font-serif text-white mb-8 leading-tight">Interactive <br />Teaching Tools</h3>
              <p className="text-xs text-zinc-500 leading-relaxed uppercase tracking-widest font-medium mb-12">
                Learning visual documentation is an immersive experience. We provide the tools to bridge the gap between theory and execution.
              </p>
            </div>

            <div className="lg:col-span-8 space-y-8">
              {teachingTools.map((tool, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="bg-zinc-900 border border-zinc-800 p-10 relative group overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-6 text-4xl font-serif italic text-zinc-800 group-hover:text-red-500/20 transition-colors">
                    0{i + 1}
                  </div>
                  <h4 className="text-xl font-serif text-white mb-6 uppercase tracking-tight">{tool.title}</h4>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-8 font-medium">
                    {tool.content}
                  </p>
                  <div className="bg-black border border-zinc-800 p-6 flex gap-4 items-start">
                    <Zap className="w-5 h-5 text-red-500 shrink-0" />
                    <div>
                      <p className="text-[9px] uppercase font-black tracking-[0.3em] text-zinc-600 mb-2">Pro Tip</p>
                      <p className="text-xs font-bold text-zinc-300 italic tracking-wide">"{tool.tip}"</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* J&W Mentorship Philosophy */}
      <section className="py-24 px-6 md:px-16 bg-white text-black">
        <div className="max-w-4xl mx-auto text-center">
          <Users className="w-12 h-12 mx-auto mb-10 text-red-500" />
          <h2 className="text-5xl md:text-7xl font-serif mb-10 tracking-tighter leading-tight">
            Our mission is to build a new generation of visual archivists.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500 mb-4">The Provision</p>
              <p className="text-sm font-medium leading-relaxed opacity-70">
                At J&W Studios, we provide more than just tutorials. We offer a holistic environment where gear access, client management, and creative direction intersect. Our curriculum is designed to transform hobbyists into professional artifacts producers.
              </p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500 mb-4">The Expectation</p>
              <p className="text-sm font-medium leading-relaxed opacity-70">
                We expect rigorous dedication to the craft. Technical perfection is the prerequisite for creative expression. By mastering these tools, you earn the right to break the rules and define your own visual language.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


"use client";
import { useRouter } from "next/navigation";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { ArrowRight, Code, MessageCircle, Cpu, Rocket, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const FloatingFeatures = () => {
  const features = [
    { icon: <Code className="w-6 h-6" />, text: "Real-time Coding Challenges" },
    { icon: <MessageCircle className="w-6 h-6" />, text: "AI-Powered Feedback" },
    { icon: <Cpu className="w-6 h-6" />, text: "ML-Powered Analysis" },
    { icon: <ShieldCheck className="w-6 h-6" />, text: "Secure Sessions" },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20, x: Math.random() * 100 - 50 }}
          animate={{ 
            opacity: [0, 1, 0],
            y: [20, -100],
            x: [Math.random() * 100 - 50, Math.random() * 200 - 100]
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "linear"
          }}
          className="absolute text-slate-300/40 flex items-center gap-2"
        >
          {feature.icon}
          <span className="text-sm">{feature.text}</span>
        </motion.div>
      ))}
    </div>
  );
};

export default function Home() {
  const router = useRouter();
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    const animation = animate(count, 1000, { duration: 4, ease: "easeInOut" });
    return animation.stop;
  }, []);

  const handleGetStarted = () => {
    router.push("/Dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover"
        >
          <source src="/videos/webvdo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 to-slate-800/70" />
      </div>

      {/* Floating particles */}
      <FloatingFeatures />

      {/* Main content */}
      <div className="max-w-4xl text-center relative z-10">
        {/* Developer credit */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-8 left-0 right-0 mx-auto group"
        >
        </motion.div>

        {/* Main content */}
        <div className="space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative inline-block">
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute -top-4 -right-6"
              >
                <Rocket className="w-12 h-12 text-purple-400/80 animate-bounce" />
              </motion.span>
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-300 to-blue-400 bg-clip-text text-transparent mb-6">
                Elevate Your{' '}
                <span className="relative  text-purple-400/80 animate-bounce">
                  Interview
                  <motion.div
                    className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-purple-400"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                </span>{' '}
                Game
              </h1>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              Master technical interviews with AI-powered mock sessions, <span className="bg-gradient-to-r from-blue-400 to-purple-300 bg-clip-text text-transparent font-medium">real-time feedback</span>, and detailed performance analytics.
            </motion.p>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <Button
                onClick={handleGetStarted}
                className="group rounded-2xl px-8 py-6 text-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 transition-all duration-300 shadow-xl hover:shadow-2xl relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="flex items-center justify-center relative z-10">
                  <motion.span
                    whileHover={{ x: 5 }}
                    className="inline-block"
                  >
                    Let's Start Your Journey
                  </motion.span>
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Button>
            </motion.div>
          </motion.div>

          {/* Animated stats card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-16 mx-auto w-full max-w-lg bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-2xl"
          >
            <div className="grid grid-cols-2 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-300 bg-clip-text text-transparent">
                  <motion.span>{rounded}</motion.span>+
                </div>
                <div className="text-slate-400 mt-2">Successful Interviews</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-300 to-blue-400 bg-clip-text text-transparent">
                  24/7
                </div>
                <div className="text-slate-400 mt-2">AI Availability</div>
              </div>
            </div>
          </motion.div>

          {/* Animated tech stack */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex justify-center gap-8 mt-12"
          >
            {['Next.js', 'TypeScript', 'AI/ML', 'WebRTC'].map((tech, index) => (
              <motion.div
                key={tech}
                whileHover={{ y: -5 }}
                className="px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700/50 backdrop-blur-sm"
              >
                <span className="bg-gradient-to-r from-blue-400 to-purple-300 bg-clip-text text-transparent text-sm">
                  {tech}
                </span>
              </motion.div>
            ))}
          </motion.div>
          <p className="text-slate-400/80 text-sm font-light hover:text-slate-300 transition-colors">
            Developed by {" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-300 bg-clip-text text-transparent font-medium border-b border-transparent hover:border-blue-400 transition-all">
              Saif Siddique
            </span>
            
            
          </p>
        </div>
      </div>

      {/* Floating gradient orb */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute top-1/3 right-50 w-64 h-64 rounded-full bg-gradient-to-r from-blue-500/30 to-purple-500/30 blur-3xl animate-pulse"
      />
    </div>
  );
}


// "use client";
// import { useRouter } from "next/navigation";
// import { motion } from "framer-motion";
// import { ArrowRight } from "lucide-react";
// import { Button } from "@/components/ui/button";

// export default function Home() {
//   const router = useRouter();

//   const handleGetStarted = () => {
//     router.push("/Dashboard");
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden">
//       {/* Background Video */}
//       <div className="absolute inset-0 z-0">
//         <video 
//           autoPlay 
//           loop 
//           muted 
//           playsInline 
//           className="w-full h-full object-cover"
//         >
//           <source src="/videos/webvdo.mp4" type="video/mp4" />
//           Your browser does not support the video tag.
//         </video>
//         {/* Video overlay for better readability */}
//         <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 to-slate-800/70" />
//       </div>

//       {/* Main content */}
//       <div className="max-w-4xl text-center relative z-10">
//         {/* Developer credit */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.5, duration: 0.8 }}
//           className="absolute bottom-8 left-0 right-0 mx-auto"
//         >
//           <p className="text-slate-400/80 text-sm font-light">
//             Developed by {" "}
//             <span className="bg-gradient-to-r from-blue-400 to-purple-300 bg-clip-text text-transparent font-medium">
//               Saif Siddique
//             </span>
//           </p>
//         </motion.div>

//         {/* Main content */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//         >
//           <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-300 to-blue-400 bg-clip-text text-transparent mb-6">
//             Elevate Your Interview Game
//           </h1>
          
//           <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
//             Master your technical interviews with AI-powered mock sessions, detailed analytics, and personalized feedback.
//           </p>

//           <Button
//             onClick={handleGetStarted}
//             className="group rounded-2xl px-8 py-6 text-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 transition-all duration-300 shadow-xl hover:shadow-2xl relative overflow-hidden"
//             asChild
//           >
//             <motion.div
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               className="cursor-pointer"
//             >
//               <div className="flex items-center justify-center">
//                 Let's Start Your Journey
//                 <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
//               </div>
//             </motion.div>
//           </Button>
//         </motion.div>

//         {/* Decorative 3D element */}
//         <div className="mt-16 mx-auto w-full max-w-xs opacity-80 hover:opacity-100 transition-opacity">
//           <div className="relative aspect-square">
            
//             <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl transform rotate-45 blur-xl" />
//             <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-700/50">
//               <div className="h-24 w-24 mx-auto bg-gradient-to-r from-blue-400 to-purple-300 rounded-2xl shadow-lg" />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



// // "use client";
// // import { useRouter } from "next/navigation";
// // import { motion } from "framer-motion";
// // import { ArrowRight } from "lucide-react";
// // import { Button } from "@/components/ui/button";

// // export default function Home() {
// //   const router = useRouter();

// //   const handleGetStarted = () => {
// //     router.push("/Dashboard");
// //   };

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-8">
// //       <div className="max-w-4xl text-center relative z-10">
// //         {/* Developer credit */}
// //         <motion.div
// //           initial={{ opacity: 0, y: 20 }}
// //           animate={{ opacity: 1, y: 0 }}
// //           transition={{ delay: 0.5, duration: 0.8 }}
// //           className="absolute bottom-8 left-0 right-0 mx-auto"
// //         >
// //           <p className="text-slate-400/80 text-sm font-light">
// //             Developed by {" "}
// //             <span className="bg-gradient-to-r from-blue-400 to-purple-300 bg-clip-text text-transparent font-medium">
// //               Saif Siddique
// //             </span>
// //           </p>
// //         </motion.div>

// //         {/* Animated background elements */}
// //         <div className="absolute inset-0 overflow-hidden">
// //           <div className="absolute -top-32 -left-48 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
// //           <div className="absolute -bottom-32 -right-48 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
// //         </div>

// //         {/* Main content */}
// //         <motion.div
// //           initial={{ opacity: 0, y: 20 }}
// //           animate={{ opacity: 1, y: 0 }}
// //           transition={{ duration: 0.8 }}
// //         >
// //           <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-300 to-blue-400 bg-clip-text text-transparent mb-6">
// //             Elevate Your Interview Game
// //           </h1>
          
// //           <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
// //             Master your technical interviews with AI-powered mock sessions, detailed analytics, and personalized feedback.
// //           </p>

// //           <Button
// //             onClick={handleGetStarted}
// //             className="group rounded-2xl px-8 py-6 text-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 transition-all duration-300 shadow-xl hover:shadow-2xl relative overflow-hidden"
// //             asChild
// //           >
// //             <motion.div
// //               whileHover={{ scale: 1.05 }}
// //               whileTap={{ scale: 0.95 }}
// //               className="cursor-pointer"
// //             >
// //               <div className="flex items-center justify-center">
// //                 Let's Start Your Journey
// //                 <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
// //               </div>
// //             </motion.div>
// //           </Button>
// //         </motion.div>

// //         {/* Decorative 3D element */}
// //         <div className="mt-16 mx-auto w-full max-w-xs opacity-80 hover:opacity-100 transition-opacity">
// //           <div className="relative aspect-square">
// //             <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl transform rotate-45 blur-xl" />
// //             <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-700/50">
// //               <div className="h-24 w-24 mx-auto bg-gradient-to-r from-blue-400 to-purple-300 rounded-2xl shadow-lg" />
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }


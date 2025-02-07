
"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();

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
        {/* Video overlay for better readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 to-slate-800/70" />
      </div>

      {/* Main content */}
      <div className="max-w-4xl text-center relative z-10">
        {/* Developer credit */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="absolute bottom-8 left-0 right-0 mx-auto"
        >
          <p className="text-slate-400/80 text-sm font-light">
            Developed by {" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-300 bg-clip-text text-transparent font-medium">
              Saif Siddique
            </span>
          </p>
        </motion.div>

        {/* Main content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-300 to-blue-400 bg-clip-text text-transparent mb-6">
            Elevate Your Interview Game
          </h1>
          
          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
            Master your technical interviews with AI-powered mock sessions, detailed analytics, and personalized feedback.
          </p>

          <Button
            onClick={handleGetStarted}
            className="group rounded-2xl px-8 py-6 text-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 transition-all duration-300 shadow-xl hover:shadow-2xl relative overflow-hidden"
            asChild
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer"
            >
              <div className="flex items-center justify-center">
                Let's Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          </Button>
        </motion.div>

        {/* Decorative 3D element */}
        <div className="mt-16 mx-auto w-full max-w-xs opacity-80 hover:opacity-100 transition-opacity">
          <div className="relative aspect-square">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl transform rotate-45 blur-xl" />
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-700/50">
              <div className="h-24 w-24 mx-auto bg-gradient-to-r from-blue-400 to-purple-300 rounded-2xl shadow-lg" />
            </div>
          </div>
        </div>
      </div>
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
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-8">
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

//         {/* Animated background elements */}
//         <div className="absolute inset-0 overflow-hidden">
//           <div className="absolute -top-32 -left-48 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
//           <div className="absolute -bottom-32 -right-48 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
//         </div>

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


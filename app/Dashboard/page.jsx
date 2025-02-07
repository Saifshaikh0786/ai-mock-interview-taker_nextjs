"use client";
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { FiLogOut } from 'react-icons/fi';
import AddNewInterview from './_components/AddNewInterview';
import { getUserInterviewData } from '@/utils/userData';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import moment from 'moment';
import InterviewList from './interview/[interviewId]/start/_components/InterviewList';

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const fadeIn = (direction = 'up', type, delay, duration) => ({
  hidden: {
    y: direction === 'up' ? 40 : -60,
    opacity: 0,
  },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      type: type || 'spring',
      delay,
      duration,
      ease: 'easeOut'
    }
  }
});

const Header = () => {
  const { user } = useUser();
  
  return (
    <header className="w-full px-8 py-4 flex justify-between items-center border-b border-slate-700/50 bg-gradient-to-r from-slate-900/80 to-slate-800/70 backdrop-blur-xl">
      <div className="flex items-center space-x-4">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-300 to-pink-400 bg-clip-text text-transparent"
        >
          InterviewIQ
        </motion.h1>
      </div>
      
      {user && (
        <div className="flex items-center space-x-4 group relative">
          <div className="flex items-center space-x-3 cursor-pointer">
            <motion.img 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              src={user.imageUrl} 
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-purple-400/50 hover:border-purple-300 transition-all"
            />
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-right"
            >
              <p className="text-sm font-medium text-slate-200">{user.fullName}</p>
              <p className="text-xs text-slate-400">{user.primaryEmailAddress.emailAddress}</p>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-12 right-0 hidden group-hover:block bg-slate-800/90 backdrop-blur-lg rounded-lg p-2 shadow-xl"
          >
            <button className="flex items-center space-x-2 px-4 py-2 text-slate-200 hover:bg-slate-700/50 rounded-md w-full">
              <FiLogOut className="text-purple-400" />
              <span>Sign Out</span>
            </button>
          </motion.div>
        </div>
      )}
    </header>
  );
};

function Dashboard() {
    const { user } = useUser();
    const [interviewData, setInterviewData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchInterviewData = async () => {
        try {
            setLoading(true);
            const data = await getUserInterviewData(user.primaryEmailAddress.emailAddress);
            setInterviewData(data);
        } catch (error) {
            console.error("Error fetching interview data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.primaryEmailAddress?.emailAddress) {
            fetchInterviewData();
        }
    }, [user]);

    const calculateAnalytics = () => {
        if (!interviewData.length) return null;

        const questionRatings = interviewData.map(item => ({
            rating: Math.round(Number(item.rating)),
            createdAt: item.createdAt
        }));

        const ratingDistribution = Array.from({ length: 10 }, (_, i) => {
            const rating = i + 1;
            const count = questionRatings.filter(q => q.rating === rating).length;
            return { rating, count };
        });

        const sessionData = interviewData.reduce((acc, curr) => {
            const sessionId = curr.mockIdRef;
            if (!acc[sessionId]) {
                acc[sessionId] = {
                    date: curr.createdAt,
                    totalRating: 0,
                    questionCount: 0,
                };
            }
            acc[sessionId].totalRating += Number(curr.rating);
            acc[sessionId].questionCount++;
            return acc;
        }, {});

        const performanceData = Object.values(sessionData)
            .map(session => ({
                date: moment(session.date).format('MMM DD'),
                avgRating: (session.totalRating / session.questionCount).toFixed(1)
            }))
            .sort((a, b) => moment(a.date).valueOf() - moment(b.date).valueOf());

        const totalRating = performanceData.reduce((acc, curr) => acc + Number(curr.avgRating), 0);
        const averageRating = performanceData.length > 0 
            ? (totalRating / performanceData.length).toFixed(1)
            : 0;

        return {
            averageRating,
            ratingDistribution,
            performanceData,
            totalSessions: performanceData.length,
            totalQuestions: interviewData.length
        };
    };

    const analytics = calculateAnalytics();

    return (
        <div className="w-full min-h-screen relative overflow-y-auto">
            <div className="fixed inset-0 z-0">
                <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="w-full h-full object-cover"
                >
                    <source src="/videos/webvdo.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 to-indigo-900/60" />
                <div className="absolute inset-0 noise-overlay" />
            </div>

            <div className="relative z-10">
                <Header />
                
                <motion.div 
                    variants={staggerContainer}
                    initial="hidden"
                    animate="show"
                    className="p-8 w-full mx-auto space-y-8"
                >
                    <motion.div variants={fadeIn('down', 'tween', 0.2, 1)} className="space-y-4 pt-8">
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-300 bg-clip-text text-transparent drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] text-center">
                            Interview Analytics
                        </h1>
                        <p className="text-slate-300 text-xl text-center font-light drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                            AI-Driven Performance Insights & Interview Tracking
                        </p>
                    </motion.div>

                    <motion.div variants={fadeIn('up', 'tween', 0.3, 1)} className="bg-slate-900/40 rounded-2xl p-6 border border-slate-700/30 backdrop-blur-2xl shadow-2xl mx-4">
                        <AddNewInterview onSuccess={fetchInterviewData} />
                    </motion.div>

                    {analytics && (
                        <div className="space-y-8 pb-12 px-4">
                            <motion.div variants={fadeIn('up', 'tween', 0.4, 1)} className="bg-slate-900/40 rounded-2xl p-8 border border-slate-700/30 backdrop-blur-2xl shadow-2xl">
                                <div className="flex flex-col md:flex-row justify-between items-center">
                                    <div className="space-y-2">
                                        <h2 className="text-3xl font-semibold text-slate-200">Performance Overview</h2>
                                        <p className="text-slate-300 text-lg font-light">
                                            {analytics.totalQuestions} questions across {analytics.totalSessions} sessions
                                        </p>
                                    </div>
                                    <div className="mt-4 md:mt-0 flex items-center space-x-4 bg-slate-800/50 px-6 py-3 rounded-xl">
                                        <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
                                        <span className="text-slate-300 text-sm font-medium">
                                            Last Updated: {moment().format('h:mm A')}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <motion.div variants={fadeIn('right', 'tween', 0.5, 1)} className="bg-gradient-to-br from-slate-900/50 to-indigo-900/30 rounded-2xl p-6 border border-slate-700/30 backdrop-blur-2xl shadow-2xl h-64">
                                    <h3 className="text-lg font-medium text-slate-300 mb-4">Average Session Rating</h3>
                                    <div className="flex items-center justify-center h-3/4">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-blue-400/10 blur-2xl rounded-full animate-pulse" />
                                            <div className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-300 bg-clip-text text-transparent">
                                                {analytics.averageRating}
                                                <span className="text-2xl ml-1 text-slate-300">/10</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div variants={fadeIn('left', 'tween', 0.6, 1)} className="lg:col-span-2 bg-slate-900/40 rounded-2xl p-6 border border-slate-700/30 backdrop-blur-2xl shadow-2xl h-[500px]">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-lg font-semibold text-slate-200">Question Rating Distribution</h3>
                                        <div className="flex items-center space-x-2 text-sm text-slate-300">
                                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                                            <span>Questions per Rating</span>
                                        </div>
                                    </div>
                                    <div className="h-[calc(100%-3rem)]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={analytics.ratingDistribution}>
                                                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                                                <XAxis 
                                                    dataKey="rating"
                                                    stroke="#64748b"
                                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                                />
                                                <YAxis
                                                    stroke="#64748b"
                                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                                />
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: '#818cf8',
                                                        border: '1px solid #1e293b',
                                                        borderRadius: '6px',
                                                        boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                                                    }}
                                                    formatter={(value) => [value, 'Questions']}
                                                    labelFormatter={(label) => `Rating: ${label}`}
                                                />
                                                <Bar
                                                    dataKey="count"
                                                    fill="url(#ratingGradient)"
                                                    radius={[4, 4, 0, 0]}
                                                />
                                                <defs>
                                                    <linearGradient id="ratingGradient" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="#6366f1" />
                                                        <stop offset="100%" stopColor="#a855f7" />
                                                    </linearGradient>
                                                </defs>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </motion.div>
                            </div>

                            <motion.div variants={fadeIn('up', 'tween', 0.7, 1)} className="bg-slate-900/40 rounded-2xl p-6 border border-slate-700/30 backdrop-blur-2xl shadow-2xl h-[500px]">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-semibold text-slate-200">Performance Timeline</h3>
                                    <div className="flex items-center space-x-2 text-sm text-slate-300">
                                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                                        <span>Average Session Rating</span>
                                    </div>
                                </div>
                                <div className="h-[calc(100%-3rem)]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={analytics.performanceData}>
                                            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                                            <XAxis
                                                dataKey="date"
                                                stroke="#64748b"
                                                tick={{ fill: '#94a3b8', fontSize: 12 }}
                                            />
                                            <YAxis
                                                domain={[0, 10]}
                                                stroke="#64748b"
                                                tick={{ fill: '#94a3b8', fontSize: 12 }}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: '#0f172a',
                                                    border: '1px solid #1e293b',
                                                    borderRadius: '6px',
                                                    boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                                                }}
                                                formatter={(value) => [`${value}/10`, 'Average Rating']}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="avgRating"
                                                stroke="#818cf8"
                                                strokeWidth={2}
                                                dot={{ fill: '#4f46e5', strokeWidth: 2 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </motion.div>
                        </div>
                    )}
                    
                    <motion.div variants={fadeIn('up', 'tween', 0.8, 1)} className="bg-slate-900/40 rounded-2xl p-6 border border-slate-700/30 backdrop-blur-2xl shadow-2xl mx-4">
                        <InterviewList />
                    </motion.div>
                </motion.div>
            </div>

            <div className="fixed top-0 left-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 opacity-30" />
            <div className="fixed bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 opacity-30" />

            <style jsx global>{`
                .noise-overlay {
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
                    opacity: 0.05;
                    pointer-events: none;
                }
            `}</style>
        </div>
    );
}

export default Dashboard;

// "use client";
// import { useEffect, useState } from 'react';
// import { useUser } from '@clerk/nextjs';
// import AddNewInterview from './_components/AddNewInterview';
// import { getUserInterviewData } from '@/utils/userData';
// import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// import moment from 'moment';
// import InterviewList from './interview/[interviewId]/start/_components/InterviewList';
// import { useRouter } from 'next/navigation';

// function Dashboard() {
//     const { user } = useUser();
//     const [interviewData, setInterviewData] = useState([]);
//     const [loading, setLoading] = useState(true);

//     const fetchInterviewData = async () => {
//         try {
//             setLoading(true);
//             const data = await getUserInterviewData(user.primaryEmailAddress.emailAddress);
//             setInterviewData(data);
//         } catch (error) {
//             console.error("Error fetching interview data:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         if (user?.primaryEmailAddress?.emailAddress) {
//             fetchInterviewData();
//         }
//     }, [user]);

//     const calculateAnalytics = () => {
//         if (!interviewData.length) return null;

//         const questionRatings = interviewData.map(item => ({
//             rating: Math.round(Number(item.rating)),
//             createdAt: item.createdAt
//         }));

//         const ratingDistribution = Array.from({ length: 10 }, (_, i) => {
//             const rating = i + 1;
//             const count = questionRatings.filter(q => q.rating === rating).length;
//             return { rating, count };
//         });

//         const sessionData = interviewData.reduce((acc, curr) => {
//             const sessionId = curr.mockIdRef;
//             if (!acc[sessionId]) {
//                 acc[sessionId] = {
//                     date: curr.createdAt,
//                     totalRating: 0,
//                     questionCount: 0,
//                 };
//             }
//             acc[sessionId].totalRating += Number(curr.rating);
//             acc[sessionId].questionCount++;
//             return acc;
//         }, {});

//         const performanceData = Object.values(sessionData)
//             .map(session => ({
//                 date: moment(session.date).format('MMM DD'),
//                 avgRating: (session.totalRating / session.questionCount).toFixed(1)
//             }))
//             .sort((a, b) => moment(a.date).valueOf() - moment(b.date).valueOf());

//         const totalRating = performanceData.reduce((acc, curr) => acc + Number(curr.avgRating), 0);
//         const averageRating = performanceData.length > 0 
//             ? (totalRating / performanceData.length).toFixed(1)
//             : 0;

//         return {
//             averageRating,
//             ratingDistribution,
//             performanceData,
//             totalSessions: performanceData.length,
//             totalQuestions: interviewData.length
//         };
//     };

//     const analytics = calculateAnalytics();

//     return (
//         <div className="w-full  bg-gradient-to-br from-slate-900 to-slate-800 p-8 overflow-y-auto">
//             <div className="w-full-7xl mx-auto space-y-8">
//                 {/* Header Section */}
//                 <div className="space-y-4 pt-4">
//                     <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-300 bg-clip-text text-transparent">
//                         Interview Analytics Dashboard
//                     </h1>
//                     <p className="text-slate-300/80 text-lg font-light">
//                         AI-Powered Interview Performance Insights
//                     </p>
//                 </div>

                

//                 {/* Add New Interview Section */}
//                 <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50 backdrop-blur-xl shadow-lg">
//                     <AddNewInterview onSuccess={fetchInterviewData} />
//                 </div>

//                 {analytics && (
//                     <div className="space-y-8 pb-12">
//                         {/* Analytics Overview */}
//                         <div className="bg-slate-800/20 rounded-xl p-6 border border-slate-700/30">
//                             <div className="flex flex-col md:flex-row justify-between">
//                                 <div>
//                                     <h2 className="text-2xl font-semibold text-slate-200">Performance Summary</h2>
//                                     <p className="text-slate-400 mt-2 text-sm">
//                                         {analytics.totalQuestions} questions across {analytics.totalSessions} sessions
//                                     </p>
//                                 </div>
//                                 <div className="mt-4 md:mt-0 flex items-center space-x-4">
//                                     <div className="bg-slate-700/30 px-4 py-2 rounded-lg">
//                                         <span className="text-slate-300 text-sm">Last Updated: </span>
//                                         <span className="text-blue-300 font-medium">
//                                             {moment().format('h:mm A')}
//                                         </span>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         <InterviewList></InterviewList>

//                         {/* Metrics Grid */}
//                         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                             {/* Average Rating Card */}
//                             <div className="bg-slate-800/20 rounded-xl p-6 border border-slate-700/30 backdrop-blur-xl h-64">
//                                 <h3 className="text-lg font-semibold text-slate-200 mb-4">Average Session Rating</h3>
//                                 <div className="flex items-center justify-center h-3/4">
//                                     <div className="relative">
//                                         <div className="absolute inset-0 bg-blue-400/10 blur-2xl rounded-full" />
//                                         <div className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-300 bg-clip-text text-transparent">
//                                             {analytics.averageRating}
//                                             <span className="text-2xl ml-1 text-slate-400">/10</span>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Rating Distribution Card */}
//                             <div className="lg:col-span-2 bg-slate-800/20 rounded-xl p-6 border border-slate-700/30 backdrop-blur-xl h-[500px]">
//                                 <div className="flex justify-between items-center mb-6">
//                                     <h3 className="text-lg font-semibold text-slate-200">Question Rating Distribution</h3>
//                                     <div className="flex items-center space-x-2 text-sm text-slate-400">
//                                         <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
//                                         <span>Questions per Rating</span>
//                                     </div>
//                                 </div>
//                                 <div className="h-[calc(100%-3rem)]">
//                                     <ResponsiveContainer width="100%" height="100%">
//                                         <BarChart data={analytics.ratingDistribution}>
//                                             <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
//                                             <XAxis 
//                                                 dataKey="rating"
//                                                 stroke="#64748b"
//                                                 tick={{ fill: '#94a3b8', fontSize: 12 }}
//                                                 label={{ 
//                                                     value: 'Rating', 
//                                                     position: 'bottom', 
//                                                     fill: '#94a3b8',
//                                                     fontSize: 12
//                                                 }}
//                                             />
//                                             <YAxis
//                                                 stroke="#64748b"
//                                                 tick={{ fill: '#94a3b8', fontSize: 12 }}
//                                             />
//                                             <Tooltip
//                                                 contentStyle={{
//                                                     backgroundColor: '#818cf8',
//                                                     border: '1px solid #1e293b',
//                                                     borderRadius: '6px',
//                                                     boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
//                                                 }}
//                                                 formatter={(value) => [value, 'Questions']}
//                                                 labelFormatter={(label) => `Rating: ${label}`}
//                                             />
//                                             <Bar
//                                                 dataKey="count"
//                                                 fill="url(#ratingGradient)"
//                                                 radius={[4, 4, 0, 0]}
//                                                 activeBar={{
//                                                     fill: 'url(#ratingGradient)',
//                                                     stroke: '#818cf8',
//                                                     strokeWidth: 1
//                                                 }}
//                                             />
//                                             <defs>
//                                                 <linearGradient id="ratingGradient" x1="0" y1="0" x2="0" y2="1">
//                                                     <stop offset="0%" stopColor="#6366f1" />
//                                                     <stop offset="100%" stopColor="#a855f7" />
//                                                 </linearGradient>
//                                             </defs>
//                                         </BarChart>
//                                     </ResponsiveContainer>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Performance Timeline */}
//                         <div className="bg-slate-800/20 rounded-xl p-6 border border-slate-700/30 backdrop-blur-xl h-[500px]">
//                             <div className="flex justify-between items-center mb-6">
//                                 <h3 className="text-lg font-semibold text-slate-200">Performance Timeline</h3>
//                                 <div className="flex items-center space-x-2 text-sm text-slate-400">
//                                     <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
//                                     <span>Average Session Rating</span>
//                                 </div>
//                             </div>
//                             <div className="h-[calc(100%-3rem)]">
//                                 <ResponsiveContainer width="100%" height="100%">
//                                     <LineChart data={analytics.performanceData}>
//                                         <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
//                                         <XAxis
//                                             dataKey="date"
//                                             stroke="#64748b"
//                                             tick={{ fill: '#94a3b8', fontSize: 12 }}
//                                         />
//                                         <YAxis
//                                             domain={[0, 10]}
//                                             stroke="#64748b"
//                                             tick={{ fill: '#94a3b8', fontSize: 12 }}
//                                         />
//                                         <Tooltip
//                                             contentStyle={{
//                                                 backgroundColor: '#0f172a',
//                                                 border: '1px solid #1e293b',
//                                                 borderRadius: '6px',
//                                                 boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
//                                             }}
//                                             formatter={(value) => [`${value}/10`, 'Average Rating']}
//                                         />
//                                         <Line
//                                             type="monotone"
//                                             dataKey="avgRating"
//                                             stroke="#818cf8"
//                                             strokeWidth={2}
//                                             dot={{ fill: '#4f46e5', strokeWidth: 2 }}
//                                             activeDot={{ r: 8 }}
//                                         />
//                                     </LineChart>
//                                 </ResponsiveContainer>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>
//             {/* {previous interview ka list} */}
//             <InterviewList></InterviewList>
//         </div>
//     );
// }

// export default Dashboard;
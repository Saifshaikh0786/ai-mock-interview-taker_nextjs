"use client";
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import AddNewInterview from './_components/AddNewInterview';
import { getUserInterviewData } from '@/utils/userData';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import moment from 'moment';
import InterviewList from './interview/[interviewId]/start/_components/InterviewList';

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
        <div className="w-full  bg-gradient-to-br from-slate-900 to-slate-800 p-8 overflow-y-auto">
            <div className="w-full-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="space-y-4 pt-4">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-300 bg-clip-text text-transparent">
                        Interview Analytics Dashboard
                    </h1>
                    <p className="text-slate-300/80 text-lg font-light">
                        AI-Powered Interview Performance Insights
                    </p>
                </div>

                {/* Add New Interview Section */}
                <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50 backdrop-blur-xl shadow-lg">
                    <AddNewInterview onSuccess={fetchInterviewData} />
                </div>

                {analytics && (
                    <div className="space-y-8 pb-12">
                        {/* Analytics Overview */}
                        <div className="bg-slate-800/20 rounded-xl p-6 border border-slate-700/30">
                            <div className="flex flex-col md:flex-row justify-between">
                                <div>
                                    <h2 className="text-2xl font-semibold text-slate-200">Performance Summary</h2>
                                    <p className="text-slate-400 mt-2 text-sm">
                                        {analytics.totalQuestions} questions across {analytics.totalSessions} sessions
                                    </p>
                                </div>
                                <div className="mt-4 md:mt-0 flex items-center space-x-4">
                                    <div className="bg-slate-700/30 px-4 py-2 rounded-lg">
                                        <span className="text-slate-300 text-sm">Last Updated: </span>
                                        <span className="text-blue-300 font-medium">
                                            {moment().format('h:mm A')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Average Rating Card */}
                            <div className="bg-slate-800/20 rounded-xl p-6 border border-slate-700/30 backdrop-blur-xl h-64">
                                <h3 className="text-lg font-semibold text-slate-200 mb-4">Average Session Rating</h3>
                                <div className="flex items-center justify-center h-3/4">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-blue-400/10 blur-2xl rounded-full" />
                                        <div className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-300 bg-clip-text text-transparent">
                                            {analytics.averageRating}
                                            <span className="text-2xl ml-1 text-slate-400">/10</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Rating Distribution Card */}
                            <div className="lg:col-span-2 bg-slate-800/20 rounded-xl p-6 border border-slate-700/30 backdrop-blur-xl h-[500px]">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-semibold text-slate-200">Question Rating Distribution</h3>
                                    <div className="flex items-center space-x-2 text-sm text-slate-400">
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
                                                label={{ 
                                                    value: 'Rating', 
                                                    position: 'bottom', 
                                                    fill: '#94a3b8',
                                                    fontSize: 12
                                                }}
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
                                                activeBar={{
                                                    fill: 'url(#ratingGradient)',
                                                    stroke: '#818cf8',
                                                    strokeWidth: 1
                                                }}
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
                            </div>
                        </div>

                        {/* Performance Timeline */}
                        <div className="bg-slate-800/20 rounded-xl p-6 border border-slate-700/30 backdrop-blur-xl h-[500px]">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold text-slate-200">Performance Timeline</h3>
                                <div className="flex items-center space-x-2 text-sm text-slate-400">
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
                                            activeDot={{ r: 8 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {/* {previous interview ka list} */}
            <InterviewList></InterviewList>
        </div>
    );
}

export default Dashboard;
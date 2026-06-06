import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { ref, get } from 'firebase/database';
import { useNavigate } from 'react-router-dom';

export function FeaturedRooms() {
    const navigate = useNavigate();
    const [recentRooms, setRecentRooms] = useState([]);
    const [loadingRooms, setLoadingRooms] = useState(true);

    useEffect(() => {
        const fetchRecentRooms = async () => {
            try {
                const snapshot = await get(ref(db, 'publicRooms'));
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const roomsArray = Object.entries(data).map(([roomCode, room]) => ({
                        roomCode,
                        ...room
                    }));
                    roomsArray.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
                    setRecentRooms(roomsArray.slice(0, 4));
                }
            } catch (error) {
                console.error("Error fetching recent rooms:", error);
            } finally {
                setLoadingRooms(false);
            }
        };
        fetchRecentRooms();
    }, []);

    if (loadingRooms) {
        return (
            <div className="w-full bg-white border-b border-gray-100 shadow-sm relative z-10 py-12 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-examly-accent"></div>
            </div>
        );
    }

    return (
        <div className="w-full bg-white border-b border-gray-100 shadow-sm relative z-10">
            <div className="max-w-6xl mx-auto px-6 py-16 w-full">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Featured Rooms</h2>
                    <button
                        onClick={() => navigate('/explore')}
                        className="flex items-center gap-1 text-examly-accent font-medium hover:text-teal-700 transition-colors cursor-pointer"
                    >
                        View all
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {recentRooms.map((room) => (
                        <div key={room.roomCode} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-full hover:shadow-md hover:border-examly-accent transition-all duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-bold text-gray-800 line-clamp-2 pr-2">{room.examTitle || 'Untitled Exam'}</h3>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="text-xs font-bold px-3 py-1 rounded-full border uppercase tracking-wider bg-teal-50 text-examly-accent border-teal-100">
                                    {room.topic || room.difficulty || 'General'}
                                </span>
                            </div>
                            <div className="mt-auto space-y-4">
                                <div className="flex items-center justify-between text-sm font-medium text-gray-500">
                                    <span className="flex items-center gap-1.5">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {room.questionsCount || 0} Qs
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                        {room.participantsCount || (room.participants ? Object.keys(room.participants).length : 0)} Users
                                    </span>
                                </div>
                                <button
                                    onClick={() => navigate(`/exam/${room.roomCode}`)}
                                    className="w-full bg-examly-accent hover:brightness-95 text-white font-medium py-2 rounded-lg transition-colors cursor-pointer"
                                >
                                    Join
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

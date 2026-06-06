import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { ref, get } from 'firebase/database';
import { useNavigate } from 'react-router-dom';

export function ExplorePage() {
    const [rooms, setRooms] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchPublicRooms = async () => {
            try {
                const snapshot = await get(ref(db, 'publicRooms'));

                if (snapshot.exists()) {
                    const data = snapshot.val();

                    const roomsArray = Object.entries(data).map(
                        ([roomCode, room]) => ({
                            roomCode,
                            ...room
                        })
                    );

                    roomsArray.sort(
                        (a, b) => b.createdAt - a.createdAt
                    );

                    setRooms(roomsArray);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPublicRooms();
    }, []);

    const filteredRooms = rooms.filter(room =>
        room.examTitle
            ?.toLowerCase()
            .includes(search.toLowerCase())
    );

    const difficultyColors = {
        easy: 'bg-green-100 text-green-700 border-green-200',
        medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        hard: 'bg-red-100 text-red-700 border-red-200'
    };

    return (
        <div className="min-h-screen bg-examly-base font-sans  flex flex-col pb-32">
            <div className="flex-1 max-w-6xl w-full mx-auto px-6 pt-20">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-8">Explore Exams</h1>
                    <div className="max-w-2xl mx-auto relative">
                        <input
                            type="text"
                            placeholder="Search by topic, subject, or title..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full border border-gray-200 rounded-full py-4 pl-6 pr-12 text-lg shadow-sm focus:ring-2 focus:ring-examly-accent focus:border-transparent outline-none transition-all bg-white"
                        />
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                    
                    <div className="mt-4 text-gray-500 font-medium">
                        {loading ? 'Loading public exams...' : `${filteredRooms.length} result${filteredRooms.length !== 1 ? 's' : ''} found`}
                    </div>
                </div>

                {!loading && filteredRooms.length === 0 && (
                    <div className="text-center py-20 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-xl font-medium">No public exams found.</p>
                        <p className="mt-2 text-sm">Try adjusting your search terms.</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRooms.map(room => (
                        <div key={room.roomCode} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-full hover:shadow-md hover:border-examly-accent transition-all duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-xl font-bold text-gray-800 line-clamp-2 pr-2">{room.examTitle}</h2>
                                <span className={`text-xs font-bold px-3 py-1 rounded-full border uppercase tracking-wider whitespace-nowrap ${difficultyColors[room.difficulty] || difficultyColors.medium}`}>
                                    {room.difficulty}
                                </span>
                            </div>
                            
                            <p className="text-gray-500 text-sm mb-6 flex-1 line-clamp-3">
                                {room.examDescription || 'No description provided for this exam.'}
                            </p>
                            
                            <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50">
                                <span className="text-sm font-medium text-gray-400 flex items-center gap-1.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {room.questionsCount} questions
                                </span>
                                <button
                                    onClick={() => navigate(`/exam/${room.roomCode}`)}
                                    className="bg-examly-accent hover:brightness-95 text-white font-bold py-2 px-6 rounded-lg transition-colors text-sm"
                                >
                                    Join Exam
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
import { useState } from 'react';
import { ref, get } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase.js';

export function JoinExam() {
    const [roomCode, setRoomCode] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleJoin = async () => {
        const roomRef = ref(db, 'rooms/' + roomCode);
        const snapshot = await get(roomRef);
        const data = snapshot.val();
        if (data) {
            navigate('/lobby/' + roomCode, { replace: true });
        } else {
            setError('Room not found. Please check the code and try again.');
        }
    }

    return (
        <div className="min-h-screen bg-examly-base font-sans flex flex-col pb-32">
            <div className="flex-1 flex flex-col justify-center items-center px-6 max-w-lg w-full mx-auto">
                <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 text-center">
                    <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center text-examly-accent mx-auto mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                        </svg>
                    </div>
                    
                    <h1 className="text-3xl font-bold text-gray-800 mb-3">Join a Room</h1>
                    <p className="text-gray-500 mb-10 font-medium">Enter the room code provided by your host to join the exam session.</p>
                    
                    <div className="space-y-6">
                        <div>
                            <input
                                type="text"
                                placeholder="e.g. AD1234"
                                value={roomCode}
                                onChange={(e) => setRoomCode(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
                                className="w-full border-2 border-gray-200 rounded-xl py-5 px-6 text-2xl font-black text-center tracking-widest text-gray-800 uppercase shadow-sm focus:ring-0 focus:border-examly-accent outline-none transition-colors placeholder-gray-300"
                            />
                        </div>
                        
                        {error && <p className="text-sm text-red-500 font-bold">{error}</p>}
                        
                        <button 
                            onClick={handleJoin}
                            disabled={!roomCode.trim()}
                            className={`w-full py-5 rounded-xl font-bold text-xl transition-all duration-300 shadow-sm cursor-pointer ${
                                roomCode.trim() 
                                ? 'bg-examly-accent hover:bg-teal-800 text-white hover:-translate-y-1' 
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            Join Exam
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
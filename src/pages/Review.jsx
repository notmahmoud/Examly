import { useLocation, useNavigate } from 'react-router-dom';
import { db } from '../firebase.js';
import { ref, set} from 'firebase/database';
import { auth } from '../firebase.js';
import { Navigate } from 'react-router-dom';

export function Review() {
    const location = useLocation();
    const navigate = useNavigate();
    const { questions, examTitle, examDescription, examDuration, difficulty, questionsCount, type, isPublic } = location.state || {};
    
    if (!questions) return <Navigate to="/" />;
    
    const handleLaunch = async () => {
        const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        await set(ref(db, 'rooms/' + roomCode), {
            roomCode,
            hostId: auth.currentUser.uid,
            questions,
            examTitle,
            examDuration,
            difficulty,
            questionsCount,
            type,
            isPublic,
            status: 'waiting',
            participants: {},
            createdAt: Date.now()
        });
        
        if (isPublic) {
            await set(ref(db, 'publicRooms/' + roomCode), {
                roomCode,
                examTitle,
                examDescription,
                difficulty,
                questionsCount,
                hostId: auth.currentUser.uid,
                createdAt: Date.now()
            });
        }
        if (isPublic) {
            navigate('/exam/' + roomCode, { replace: true });
        } else {
            navigate('/lobby/' + roomCode, { replace: true });
        }
    };

    return (
        <div className="min-h-screen bg-examly-base font-sans animate-fade-in flex flex-col pb-32">
            
            <div className="flex-1 flex flex-col justify-center items-center px-6 pt-10 max-w-2xl w-full mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Ready to Launch!</h1>
                    <p className="text-gray-500">Review your quiz details before generating the room code.</p>
                </div>

                <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10 mb-8">
                    {examTitle && <h2 className="text-2xl font-bold text-gray-800 mb-2">{examTitle}</h2>}
                    {examDescription && <p className="text-gray-500 mb-8 pb-6 border-b border-gray-100">{examDescription}</p>}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-examly-accent">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Duration</span>
                                <span className="font-bold text-gray-800">{examDuration} minutes</span>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-examly-accent">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div>
                                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Difficulty</span>
                                <span className="font-bold text-gray-800 capitalize">{difficulty}</span>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-examly-accent">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Questions</span>
                                <span className="font-bold text-gray-800">{questionsCount} questions</span>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-examly-accent">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <div>
                                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Type</span>
                                <span className="font-bold text-gray-800 capitalize">{type.replace('_', ' ')}</span>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4 md:col-span-2">
                            <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-examly-accent">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Visibility</span>
                                <span className="font-bold text-gray-800">{isPublic ? 'Public Room' : 'Private Room'}</span>
                            </div>
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleLaunch}
                        className="w-full bg-examly-accent hover:brightness-95 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-sm text-lg mt-4 flex justify-center items-center gap-2"
                    >
                        Launch Room
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}
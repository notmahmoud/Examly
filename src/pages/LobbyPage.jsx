import { useLobbyPage } from '../hooks/useLobbyPage';

export function LobbyPage() {
    const {
        roomCode,
        participants,
        roomData,
        isHost,
        showLeaveModal,
        setShowLeaveModal,
        handleStartExam,
        copyRoomCode,
        navigate
    } = useLobbyPage();

    return (
        <div className="min-h-screen bg-examly-base font-sans flex flex-col pb-32">
            
            {/* Top Bar with Leave Button */}
            <div className="fixed top-0 left-0 p-6 z-50">
                <button 
                    onClick={() => setShowLeaveModal(true)}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-800 font-bold transition-colors cursor-pointer"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Leave Lobby
                </button>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center px-6 pt-20 max-w-4xl w-full mx-auto">
                {isHost ? (
                    <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 text-center">
                        <h1 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Host Lobby</h1>
                        <p className="text-gray-500 mb-8 font-medium">Waiting for students to join your quiz room.</p>
                        
                        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 max-w-sm mx-auto mb-10 relative group cursor-pointer hover:border-gray-300 transition-colors" onClick={copyRoomCode} title="Click to copy room code">
                            <span className="block text-xs font-bold text-examly-accent uppercase tracking-widest mb-2">Room Code</span>
                            <h2 className="text-6xl font-black text-gray-800 tracking-wider font-mono">{roomCode}</h2>
                            <div className="absolute right-4 top-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                        
                        <div className="mb-10 text-left w-full max-w-2xl mx-auto">
                            <div className="flex justify-between items-center mb-4 px-2">
                                <h3 className="font-bold text-gray-700">Participants</h3>
                                <span className="text-sm font-bold text-examly-accent bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
                                    {Object.keys(participants).length} Joined
                                </span>
                            </div>
                            
                            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                                {Object.keys(participants).length === 0 ? (
                                    <div className="py-12 text-center px-4">
                                        <div className="animate-pulse flex justify-center mb-4">
                                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <h4 className="font-bold text-gray-600 mb-1">Waiting for the first student...</h4>
                                        <p className="text-sm text-gray-400">Share the room code above with your students.</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
                                        {Object.values(participants).map((participant, i) => (
                                            <div key={i} className="flex justify-between items-center py-4 px-6 hover:bg-gray-50 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-examly-accent text-white flex items-center justify-center font-bold text-sm shadow-sm">
                                                        {participant?.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="font-bold text-gray-800">{participant.name}</span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                                                        participant.status === 'finished' || participant.score !== undefined ? 'bg-green-100 text-green-700 border-green-200' : 
                                                        'bg-gray-100 text-gray-600 border-gray-200'
                                                    }`}>
                                                        {participant.score !== undefined ? 'finished' : participant.status}
                                                    </span>
                                                    {(participant.status === 'finished' || participant.score !== undefined) && (
                                                        <button 
                                                            onClick={() => navigate('/host-results/' + roomCode + '/' + participant.name)}
                                                            className="text-sm font-bold text-examly-accent hover:underline bg-teal-50 hover:bg-teal-100 px-3 py-1 rounded-lg transition-colors cursor-pointer"
                                                        >
                                                            Report
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="flex justify-center">
                            <button 
                                onClick={handleStartExam}
                                disabled={Object.keys(participants).length === 0 || roomData?.status === 'active'}
                                className={`w-full max-w-sm py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 shadow-sm ${
                                    roomData?.status === 'active'
                                    ? 'bg-teal-800 text-teal-100 cursor-not-allowed opacity-80'
                                    : Object.keys(participants).length > 0 
                                    ? 'bg-examly-accent hover:bg-teal-800 text-white cursor-pointer hover:-translate-y-0.5' 
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                            >
                                {roomData?.status === 'active' ? 'Exam Active' : 'Start Exam'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center pt-10">
                        <div className="relative w-28 h-28 mx-auto mb-8">
                            <div className="absolute inset-0 bg-examly-accent rounded-full animate-ping opacity-20"></div>
                            <div className="absolute inset-2 bg-examly-accent rounded-full flex items-center justify-center text-white shadow-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Waiting for Host</h2>
                        <p className="text-gray-500 font-medium">Please wait while the host prepares the exam...</p>
                    </div>
                )}
            </div>

            {/* Leave Modal */}
            {showLeaveModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm px-4">
                    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full mx-auto transform transition-all">
                        <h3 className="text-2xl font-bold text-gray-800 mb-3 text-center">Leave Lobby?</h3>
                        <p className="text-gray-500 mb-8 text-center leading-relaxed">
                            Are you sure you want to leave this room?
                        </p>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => setShowLeaveModal(false)}
                                className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => {
                                    setShowLeaveModal(false);
                                    navigate('/');
                                }}
                                className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors cursor-pointer"
                            >
                                Leave
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
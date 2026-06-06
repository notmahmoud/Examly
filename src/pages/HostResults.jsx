import { useParams } from 'react-router-dom';
import { get, ref } from 'firebase/database';
import { db } from '../firebase.js';
import { useEffect, useState } from 'react';

export function HostResults() {
    const { roomCode, participantName } = useParams();
    const [questions, setQuestions] = useState([]);
    const [participant, setParticipant] = useState(null);

    useEffect(() => {
        const roomRef = ref(db, 'rooms/' + roomCode);
        get(roomRef).then((snapshot) => {
            const data = snapshot.val();
            if (data) {
                setQuestions(data.questions);
                const participant = Object.values(data.participants || {}).find(p => p.name === participantName);
                setParticipant(participant);
            }

        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomCode]);

    return (
        <div className="min-h-screen bg-examly-base font-sans flex flex-col pb-32">
            <div className="flex-1 max-w-4xl w-full mx-auto px-6 pt-20">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{participant?.name}'s Results</h1>
                    <div className="inline-block bg-white rounded-2xl shadow-sm border border-gray-100 px-8 py-4 mt-4">
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest block mb-1">Final Score</span>
                        <span className="text-5xl font-black text-examly-accent">{participant?.score || 0}</span>
                        <span className="text-2xl font-bold text-gray-300 mx-1">/</span>
                        <span className="text-2xl font-bold text-gray-600">{questions.length}</span>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-800">Answer Breakdown</h2>
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                            {participant?.status || 'Unknown Status'}
                        </span>
                    </div>
                    
                    <div className="divide-y divide-gray-50">
                        {questions.map((question, index) => {
                            const userAnswer = participant?.userAnswers?.[index];
                            const isCorrect = userAnswer === question.correct_answer;
                            const isUnanswered = !userAnswer;
                            
                            return (
                                <div key={index} className="p-8 relative">
                                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${isUnanswered ? 'bg-gray-300' : isCorrect ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    
                                    <h3 className="text-lg font-medium text-gray-800 mb-6 pl-4">
                                        <span className="font-bold mr-2 text-gray-400">{index + 1}.</span>
                                        {question.question}
                                    </h3>
                                    
                                    <div className="space-y-4 pl-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                                            <div className="w-32 text-xs font-bold text-gray-400 uppercase tracking-wider">Their Answer</div>
                                            <div className={`font-bold ${isUnanswered ? 'text-gray-500 italic' : isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                                                {userAnswer || 'Not answered'}
                                            </div>
                                        </div>
                                        
                                        {!isCorrect && (
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                                                <div className="w-32 text-xs font-bold text-gray-400 uppercase tracking-wider">Correct Answer</div>
                                                <div className="font-bold text-gray-800">
                                                    {question.correct_answer}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
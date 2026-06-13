import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
export function CreateExam() {

    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [difficulty, setDifficulty] = useState('medium');
    const [questionsCount, setQuestionsCount] = useState(10);
    const [type, setType] = useState('multiple');
    const [isPublic, setIsPublic] = useState(false);
    const [examDuration, setExamDuration] = useState(10);
    const [examTitle, setExamTitle] = useState('');
    const [examDescription, setExamDescription] = useState('');
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [showAI, setShowAI] = useState(false);
    const [manualQuestions, setManualQuestions] = useState([
        { question: '', correct_answer: '', incorrect_answers: ['', '', ''] }
    ]);
    const [step, setStep] = useState(1); // 1: exam details, 2: exam questions, 3: launch

    const handleCreate = async () => {
        setIsLoading(true);
        if (!examTitle || !input) {
            setErrorMessage('Please fill in all fields');
            return;
        }
        try {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        { role: "system", content: "You are a quiz generator. Return only a JSON array of 10 questions. Each object must have: question, correct_answer, incorrect_answers (array of 3 wrong answers). No extra text, just the JSON array." },
                        {
                            role: "user", content: `Generate ${questionsCount} questions about ${input}4
                     with ${difficulty} difficulty,
                      Easy means high school level,
                       Medium means university level,
                        Hard means expert level, 
                        Type: ${type} For true/false questions, 
                        incorrect_answers should only contain one wrong answer (either 'True' or 'False')` }
                    ]
                })
            });
            const data = await response.json();
            const parsed = JSON.parse(data.choices[0].message.content);
            setManualQuestions([...manualQuestions, ...parsed]);
            setIsLoading(false);
            setErrorMessage('');
        } catch {
            setErrorMessage('AI generation failed, please try again.');
        } finally {
            setIsLoading(false);
        }

    };
    const handleStepNext = () => {
        if (!examTitle) {
            setErrorMessage('Please enter an exam title');
            return;
        }
        setErrorMessage('');
        setStep(2);
    };

    const addQuestion = () => {
        setManualQuestions([...manualQuestions,
        { question: '', correct_answer: '', incorrect_answers: ['', '', ''] }
        ]);
    }
    const deleteQuestion = (index) => {
        setManualQuestions(manualQuestions.filter((_, i) => i !== index));
    };
    // Only proceed if there is at least one question
    const handleNext = () => {
        // Validate that all questions have a correct answer
        const incomplete = manualQuestions.filter(q => q.question && !q.correct_answer);
        if (incomplete.length > 0) {
            setErrorMessage(`${incomplete.length} question(s) are missing a correct answer.`);
            return;
        }
        const allQuestions = [...manualQuestions.filter(q => q.question && q.correct_answer)];
        if (allQuestions.length === 0) {
            setErrorMessage('Please add at least one question before proceeding.');
            return;
        }
        navigate('/review', { replace: true, state: { questions: allQuestions, examTitle, examDescription, examDuration, difficulty, questionsCount, type, isPublic } });
    };

    const inputClasses = "w-full border border-gray-200 rounded-lg p-4 bg-white text-gray-800 outline-none focus:ring-2 focus:ring-examly-accent focus:border-transparent transition-all";
    const labelClasses = "block text-sm font-bold text-gray-700 mb-2";

    return (
        <div className="min-h-screen bg-examly-base font-sans  flex flex-col pb-32">
            <div className="flex-1 max-w-3xl w-full mx-auto px-6 pt-20">
                <h1 className="text-4xl font-bold text-gray-800 mb-3 text-center">Create a New Exam</h1>
                <p className="text-gray-500 text-center mb-12">Follow the steps below to build and launch your exam room.</p>

                {/* Step indicator */}
                <div className="flex items-center justify-center mb-16 relative max-w-lg mx-auto">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"></div>
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-examly-accent -z-10 transition-all duration-500" style={{ width: step === 1 ? '0%' : '50%' }}></div>

                    <div className="flex items-center justify-between w-full">
                        {[{ num: 1, label: 'Settings' }, { num: 2, label: 'Questions' }, { num: 3, label: 'Launch' }].map((s) => (
                            <div key={s.num} className="flex flex-col items-center bg-examly-base px-2">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${step > s.num ? 'bg-examly-accent text-white' : step === s.num ? 'bg-examly-accent text-white ring-4 ring-teal-100' : 'bg-gray-200 text-gray-500'}`}>
                                    {step > s.num ? '✓' : s.num}
                                </div>
                                <span className={`mt-3 text-sm font-bold ${step >= s.num ? 'text-gray-800' : 'text-gray-400'}`}>{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10">
                    {step === 1 && (
                        <div className="space-y-6 ">
                            <div>
                                <label className={labelClasses}>Exam Title</label>
                                <input type="text"
                                    className={inputClasses}
                                    placeholder="e.g. Midterm History"
                                    value={examTitle}
                                    onChange={(e) => setExamTitle(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className={labelClasses}>Description</label>
                                <input type="text"
                                    className={inputClasses}
                                    placeholder='Briefly describe what this exam covers..'
                                    value={examDescription}
                                    onChange={(e) => setExamDescription(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className={labelClasses}>Exam Duration (minutes)</label>
                                <input type="number" min="1"
                                    className={inputClasses}
                                    value={examDuration}
                                    onChange={(e) => setExamDuration(parseInt(e.target.value))}
                                />
                            </div>

                            <div className="pt-2">
                                <label className="flex items-center space-x-3 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 border-2 border-gray-300 rounded text-examly-accent focus:ring-examly-accent cursor-pointer peer"
                                            checked={isPublic}
                                            onChange={(e) => setIsPublic(e.target.checked)}
                                        />
                                    </div>
                                    <span className="text-gray-700 font-bold group-hover:text-examly-accent transition-colors">Public Room</span>
                                </label>
                                {isPublic && <p className="text-sm text-gray-500 mt-2 ml-8">Your exam will be visible immediately on the Explore page for anyone to join.</p>}
                            </div>

                            {errorMessage && <p className="text-sm text-red-500 mt-2 font-medium">{errorMessage}</p>}

                            <div className="pt-6">
                                <button
                                    onClick={handleStepNext}
                                    className="w-full bg-examly-accent hover:bg-teal-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 cursor-pointer hover:-translate-y-0.5 shadow-sm"
                                >
                                    Next Step
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-8 ">
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                {!showAI && (
                                    <button
                                        onClick={() => setShowAI(true)}
                                        className="w-full bg-examly-accent hover:bg-teal-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-sm cursor-pointer hover:-translate-y-0.5 flex justify-center items-center gap-2 text-lg"
                                    >
                                        ✨ Generate Questions with AI
                                    </button>
                                )}

                                <div className={`transition-all duration-500 overflow-hidden ${showAI ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="font-bold text-gray-800 text-lg">AI Question Generator</h3>
                                        <button
                                            onClick={() => setShowAI(false)}
                                            className="text-gray-400 hover:text-gray-600 font-bold text-sm hover:underline focus:outline-none cursor-pointer"
                                        >
                                            Close
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Topic</label>
                                            <input type="text"
                                                className="w-full border border-gray-200 rounded-lg p-3 bg-white text-gray-800 outline-none focus:ring-2 focus:ring-examly-accent transition-all"
                                                placeholder="e.g. World War II"
                                                onChange={(e) => setInput(e.target.value)}
                                                value={input}
                                                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Count</label>
                                                <input type="number"
                                                    className="w-full border border-gray-200 rounded-lg p-3 bg-white text-gray-800 outline-none focus:ring-2 focus:ring-examly-accent transition-all"
                                                    value={questionsCount}
                                                    onChange={(e) => setQuestionsCount(parseInt(e.target.value))}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Difficulty</label>
                                                <select
                                                    className="w-full border border-gray-200 rounded-lg p-3 bg-white text-gray-800 outline-none focus:ring-2 focus:ring-examly-accent transition-all appearance-none"
                                                    value={difficulty}
                                                    onChange={(e) => setDifficulty(e.target.value)}
                                                >
                                                    <option value="easy">Easy</option>
                                                    <option value="medium">Medium</option>
                                                    <option value="hard">Hard</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Type</label>
                                                <select
                                                    className="w-full border border-gray-200 rounded-lg p-3 bg-white text-gray-800 outline-none focus:ring-2 focus:ring-examly-accent transition-all appearance-none"
                                                    value={type}
                                                    onChange={(e) => setType(e.target.value)}
                                                >
                                                    <option value="multiple">Multiple Choice</option>
                                                    <option value="true_false">True/False</option>
                                                    <option value="mixed">Mixed</option>
                                                </select>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleCreate}
                                            disabled={isLoading}
                                            className={`w-full mt-4 bg-gray-800 hover:bg-gray-900 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex justify-center items-center ${isLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer hover:-translate-y-0.5 shadow-sm'}`}
                                        >
                                            {isLoading ? (
                                                <span className="flex items-center gap-2">
                                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                    Generating...
                                                </span>
                                            ) : '✨ Generate Now'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {manualQuestions.map((q, index) => (
                                    <div key={index} className="border border-gray-200 rounded-xl p-6 relative bg-white hover:border-gray-300 transition-colors">
                                        <button
                                            onClick={() => deleteQuestion(index)}
                                            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                                            title="Delete Question"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>

                                        <h4 className="font-bold text-gray-700 mb-4">Question {index + 1}</h4>

                                        <div className="space-y-4">
                                            <input
                                                className="w-full border-b-2 border-gray-200 py-2 bg-transparent text-gray-800 font-medium outline-none focus:border-examly-accent transition-colors placeholder-gray-400"
                                                placeholder="Enter question here..."
                                                value={q.question}
                                                onChange={(e) => {
                                                    const updatedQuestions = manualQuestions.map((q, i) =>
                                                        i === index ? { ...q, question: e.target.value } : q
                                                    );
                                                    setManualQuestions(updatedQuestions);
                                                }}
                                            />

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                                <div>
                                                    <label className="block text-xs font-bold text-green-600 uppercase mb-1">Correct Answer</label>
                                                    <input
                                                        className="w-full border border-green-200 rounded-lg p-3 bg-green-50/30 text-gray-800 outline-none focus:ring-1 focus:ring-green-500 transition-all"
                                                        placeholder="Correct answer"
                                                        value={q.correct_answer}
                                                        onChange={(e) => {
                                                            const updatedQuestions = manualQuestions.map((q, i) =>
                                                                i === index ? { ...q, correct_answer: e.target.value } : q
                                                            );
                                                            setManualQuestions(updatedQuestions);
                                                        }}
                                                    />
                                                </div>

                                                <div className="space-y-3">
                                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Incorrect Answers</label>
                                                    {q.incorrect_answers.map((ans, ansIndex) => (
                                                        <input
                                                            key={ansIndex}
                                                            className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50 text-gray-800 outline-none focus:ring-1 focus:ring-gray-300 transition-all text-sm"
                                                            placeholder={`Wrong answer ${ansIndex + 1}`}
                                                            value={ans}
                                                            onChange={(e) => {
                                                                const updatedQuestions = manualQuestions.map((q, i) =>
                                                                    i === index ? { ...q, incorrect_answers: q.incorrect_answers.map((a, j) => j === ansIndex ? e.target.value : a) } : q
                                                                );
                                                                setManualQuestions(updatedQuestions);
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-center pt-2">
                                <button
                                    onClick={addQuestion}
                                    className="flex items-center gap-2 text-examly-accent font-bold hover:bg-teal-50 py-3 px-6 rounded-xl transition-colors cursor-pointer"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                    </svg>
                                    Add Question
                                </button>
                            </div>

                            {errorMessage && <p className="text-sm text-red-500 text-center font-medium">{errorMessage}</p>}

                            <div className="pt-6 flex gap-4">
                                <button
                                    onClick={() => setStep(1)}
                                    className="flex-1 py-4 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all duration-300 cursor-pointer hover:-translate-y-0.5"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="flex-[2] bg-examly-accent hover:bg-teal-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 cursor-pointer hover:-translate-y-0.5 shadow-sm"
                                >
                                    Review & Launch
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}


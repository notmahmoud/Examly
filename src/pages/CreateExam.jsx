import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const STEPS = [
  { num: 1, label: 'Settings', desc: 'Title, duration & visibility' },
  { num: 2, label: 'Questions', desc: 'Add or generate questions' },
  { num: 3, label: 'Launch', desc: 'Review and go live' },
];

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
  const [step, setStep] = useState(1);

  const handleCreate = async () => {
    setIsLoading(true);
    if (!examTitle || !input) {
      setErrorMessage('Please fill in all fields');
      setIsLoading(false);
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
  };

  const deleteQuestion = (index) => {
    setManualQuestions(manualQuestions.filter((_, i) => i !== index));
  };

  const handleNext = () => {
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

  const inputCls = "w-full border border-gray-200 rounded-lg px-4 py-3 bg-white text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-examly-accent focus:border-transparent transition-all text-sm";
  const labelCls = "block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2";

  return (
    <div className="min-h-screen bg-examly-base font-sans flex pb-24">

      {/* ── LEFT SIDEBAR ── */}
      <aside className="hidden lg:flex flex-col w-64 xl:w-72 shrink-0 sticky top-0 h-screen bg-white border-r border-gray-100 shadow-sm px-6 py-10">
        <div className="mb-10">
          <span className="text-xs font-bold text-examly-accent uppercase tracking-widest">Examly</span>
          <h2 className="text-xl font-bold text-gray-800 mt-1">Create Exam</h2>
        </div>

        <nav className="flex flex-col gap-2">
          {STEPS.map((s) => {
            const isActive = step === s.num;
            const isDone = step > s.num;
            return (
              <div key={s.num}
                className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-200 ${isActive ? 'bg-teal-50 border border-teal-100' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${isDone ? 'bg-examly-accent text-white' : isActive ? 'bg-examly-accent text-white ring-4 ring-teal-100' : 'bg-gray-200 text-gray-400'}`}>
                  {isDone ? 'Done' : s.num}
                </div>
                <div>
                  <p className={`font-bold text-sm ${isActive ? 'text-gray-800' : isDone ? 'text-gray-600' : 'text-gray-400'}`}>{s.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </nav>

        {/* Question counter */}
        <div className="mt-auto pt-10">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">Questions added</p>
            <p className="text-3xl font-black text-gray-800 mt-1">{manualQuestions.filter(q => q.question).length}</p>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-3">
              <div
                className="bg-examly-accent h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((manualQuestions.filter(q => q.question).length / 10) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Mobile step bar */}
        <header className="lg:hidden flex items-center gap-2 px-6 py-4 bg-white border-b border-gray-100 sticky top-0 z-20">
          {STEPS.map((s) => {
            const isActive = step === s.num;
            const isDone = step > s.num;
            return (
              <div key={s.num} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${isDone ? 'bg-examly-accent text-white' : isActive ? 'bg-examly-accent text-white' : 'bg-gray-200 text-gray-400'}`}>
                  {isDone ? 'Done' : s.num}
                </div>
                <span className={`text-sm font-bold ${isActive ? 'text-gray-800' : 'text-gray-400'}`}>{s.label}</span>
                {s.num < 3 && <span className="text-gray-300 mx-1">›</span>}
              </div>
            );
          })}
        </header>

        <main className="flex-1 px-6 lg:px-10 xl:px-16 py-10">

          {/* ── STEP 1: SETTINGS ── */}
          {step === 1 && (
            <div className="max-w-2xl">
              <div className="mb-10">
                <h1 className="text-3xl font-bold text-gray-800">Exam Settings</h1>
                <p className="text-gray-500 mt-2">Configure the basics before adding questions.</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
                <div>
                  <label className={labelCls}>Exam Title <span className="text-examly-accent">*</span></label>
                  <input type="text" className={inputCls} placeholder="e.g. Midterm History — Chapter 5"
                    value={examTitle} onChange={(e) => setExamTitle(e.target.value)} />
                </div>

                <div>
                  <label className={labelCls}>Description</label>
                  <input type="text" className={inputCls} placeholder="Briefly describe what this exam covers..."
                    value={examDescription} onChange={(e) => setExamDescription(e.target.value)} />
                </div>

                <div>
                  <label className={labelCls}>Duration (minutes)</label>
                  <input type="number" min="1" className={inputCls}
                    value={examDuration} onChange={(e) => setExamDuration(parseInt(e.target.value))} />
                </div>

                {/* Public toggle */}
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <p className="text-sm font-bold text-gray-700">Public Room</p>
                      <p className="text-xs text-gray-400 mt-0.5">Visible on the Explore page for anyone to join</p>
                    </div>
                    <div className="relative ml-4 shrink-0" onClick={() => setIsPublic(!isPublic)}>
                      <div className={`w-11 h-6 rounded-full cursor-pointer transition-colors duration-200 ${isPublic ? 'bg-examly-accent' : 'bg-gray-300'}`}>
                        <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${isPublic ? 'translate-x-5' : 'translate-x-0'}`} />
                      </div>
                    </div>
                  </label>
                </div>

                {errorMessage && (
                  <p className="text-sm text-red-500 font-medium"> {errorMessage}</p>
                )}
              </div>
            </div>
          )}

          {/* ── STEP 2: QUESTIONS ── */}
          {step === 2 && (
            <div>
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Questions</h1>
                <p className="text-gray-500 mt-2">Add questions manually or generate them with AI.</p>
              </div>

              {/* AI Banner */}
              {!showAI ? (
                <div className="mb-8 rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 60%, #134e4a 100%)' }}>
                  <div className="flex items-center justify-between gap-4 px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.298.057-.592.123-.877a3 3 0 10-4.246 0c.066.285.108.579.123.877h4z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm">Save time — generate questions with AI in seconds</p>
                        <p className="text-teal-200 text-xs mt-0.5">Pick a topic, difficulty and question count. We'll do the rest.</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowAI(true)}
                      className="shrink-0 px-5 py-2.5 bg-white text-teal-700 font-bold text-sm rounded-xl hover:bg-teal-50 transition-all duration-200 cursor-pointer shadow-sm whitespace-nowrap">
                      Generate Now
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mb-8 flex items-center justify-between bg-teal-50 border border-teal-100 rounded-2xl px-5 py-3">
                  <p className="text-teal-700 text-sm font-medium">AI panel is open on the right</p>
                  <button onClick={() => setShowAI(false)} className="text-teal-600 hover:text-teal-800 text-sm font-bold cursor-pointer transition-colors">Hide</button>
                </div>
              )}

              {/* Question cards */}
              <div className="space-y-5">
                {manualQuestions.map((q, index) => (
                  <div key={index} className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 hover:border-gray-200 transition-colors group">
                    {/* Card header */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl font-black text-gray-200 leading-none select-none">{String(index + 1).padStart(2, '0')}</span>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Question</span>
                      </div>
                      <button onClick={() => deleteQuestion(index)}
                        className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all cursor-pointer p-1.5 rounded-lg hover:bg-red-50"
                        title="Delete question">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>

                    {/* Question text input */}
                    <input
                      className="w-full border-b-2 border-gray-200 pb-3 bg-transparent text-gray-800 text-base font-medium outline-none focus:border-examly-accent transition-colors placeholder-gray-300"
                      placeholder="Type your question here..."
                      value={q.question}
                      onChange={(e) => {
                        const updated = manualQuestions.map((item, i) => i === index ? { ...item, question: e.target.value } : item);
                        setManualQuestions(updated);
                      }}
                    />

                    {/* Answers 2x2 grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
                      {/* Correct answer */}
                      <div>
                        <label className="block text-xs font-bold text-green-600 uppercase tracking-wider mb-1.5">Correct Answer</label>
                        <input
                          className="w-full border border-green-200 rounded-xl px-4 py-3 bg-green-50/40 text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-300 focus:border-green-300 transition-all text-sm"
                          placeholder="Correct answer"
                          value={q.correct_answer}
                          onChange={(e) => {
                            const updated = manualQuestions.map((item, i) => i === index ? { ...item, correct_answer: e.target.value } : item);
                            setManualQuestions(updated);
                          }}
                        />
                      </div>

                      {/* Incorrect answers */}
                      {q.incorrect_answers.map((ans, ansIndex) => (
                        <div key={ansIndex}>
                          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Wrong {ansIndex + 1}</label>
                          <input
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-300 transition-all text-sm"
                            placeholder={`Wrong answer ${ansIndex + 1}`}
                            value={ans}
                            onChange={(e) => {
                              const updated = manualQuestions.map((item, i) =>
                                i === index ? { ...item, incorrect_answers: item.incorrect_answers.map((a, j) => j === ansIndex ? e.target.value : a) } : item
                              );
                              setManualQuestions(updated);
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Question — full width dashed */}
              <button
                onClick={addQuestion}
                className="w-full mt-5 py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 hover:border-examly-accent hover:text-examly-accent hover:bg-teal-50/30 transition-all duration-200 cursor-pointer font-bold flex items-center justify-center gap-2 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Question
              </button>

              {errorMessage && (
                <p className="text-sm text-red-500 font-medium text-center mt-4"> {errorMessage}</p>
              )}
            </div>
          )}
        </main>

        {/* ── FIXED BOTTOM BAR ── */}
        <div className="fixed bottom-0 left-0 lg:left-64 xl:left-72 right-0 z-30 bg-white/90 backdrop-blur border-t border-gray-100 shadow-sm px-6 lg:px-10 xl:px-16 py-4 flex items-center gap-4">
          {step === 1 && (
            <>
              <button onClick={() => navigate(-1)}
                className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-sm transition-all cursor-pointer">
                Back
              </button>
              <button onClick={handleStepNext}
                className="flex-1 max-w-xs ml-auto py-3 rounded-xl bg-examly-accent hover:bg-teal-800 text-white font-bold text-sm transition-all cursor-pointer hover:-translate-y-0.5 shadow-sm">
                Next: Add Questions
              </button>
            </>
          )}
          {step === 2 && (
            <>
              <button onClick={() => setStep(1)}
                className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-sm transition-all cursor-pointer">
                Back
              </button>
              <span className="text-sm text-gray-400 ml-auto">
                <span className="font-bold text-gray-700">{manualQuestions.filter(q => q.question).length}</span> questions
              </span>
              <button onClick={handleNext}
                className="px-8 py-3 rounded-xl bg-examly-accent hover:bg-teal-800 text-white font-bold text-sm transition-all cursor-pointer hover:-translate-y-0.5 shadow-sm flex items-center gap-2">
                 Review &amp; Launch
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── AI RIGHT PANEL ── */}
      {showAI && step === 2 && (
        <aside className="hidden xl:flex flex-col shrink-0 sticky top-0 h-screen bg-white border-l border-gray-100 shadow-sm px-6 py-10" style={{ width: '22rem' }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold text-examly-accent uppercase tracking-widest">AI Generator</span>
              <h3 className="text-lg font-bold text-gray-800 mt-0.5">Generate Questions</h3>
            </div>
            <button onClick={() => setShowAI(false)}
              className="text-gray-400 hover:text-gray-600 cursor-pointer p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <div className="space-y-5 flex-1">
            <div>
              <label className={labelCls}>Topic</label>
              <input type="text"
                className={inputCls}
                placeholder="e.g. World War II"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              />
            </div>

            <div>
              <label className={labelCls}>Number of Questions</label>
              <input type="number" className={inputCls}
                value={questionsCount}
                onChange={(e) => setQuestionsCount(parseInt(e.target.value))}
              />
            </div>

            <div>
              <label className={labelCls}>Difficulty</label>
              <select className={`${inputCls} appearance-none cursor-pointer`}
                value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                <option value="easy">Easy — High school level</option>
                <option value="medium">Medium — University level</option>
                <option value="hard">Hard — Expert level</option>
              </select>
            </div>

            <div>
              <label className={labelCls}>Question Type</label>
              <select className={`${inputCls} appearance-none cursor-pointer`}
                value={type} onChange={(e) => setType(e.target.value)}>
                <option value="multiple">Multiple Choice</option>
                <option value="true_false">True / False</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>

            {errorMessage && (
              <p className="text-xs text-red-500 font-medium"> {errorMessage}</p>
            )}

            <button
              onClick={handleCreate}
              disabled={isLoading}
              className={`w-full py-4 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${isLoading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-examly-accent hover:bg-teal-800 text-white cursor-pointer hover:-translate-y-0.5 shadow-sm'}`}>
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Generating...
                </>
              ) : 'Generate Now'}
            </button>
          </div>

          <div className="mt-6 bg-gray-50 border border-gray-100 rounded-xl p-4">
            <p className="text-xs text-gray-400">Questions will be appended to your list. You can edit them freely after generation.</p>
          </div>
        </aside>
      )}
    </div>
  );
}

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

    return (
        <div>
            <h1>Create a New Exam</h1>
            <p>Follow the steps below to build and launch your exam room.</p>

            <div>
                {step === 1 && (
                    <div>
                        <p>Exam Title: <input type="text"
                            value={examTitle}
                            onChange={(e) => setExamTitle(e.target.value)}
                        /></p>

                        <p>Description: <input type="text"
                            placeholder='Briefly descripe what this exam covers..'
                            value={examDescription}
                            onChange={(e) => setExamDescription(e.target.value)}
                        /></p>
                        <p>Exam Duration: <input type="number" min="1" value={examDuration} onChange={(e) => setExamDuration(parseInt(e.target.value))} /></p>
                        <label>
                            <input
                                type="checkbox"
                                checked={isPublic}
                                onChange={(e) => setIsPublic(e.target.checked)}
                            />
                            Public Room
                            {isPublic && <p>Your exam will be visible immediately on the Explore page for anyone to join.</p>}
                        </label>
                        <button onClick={handleStepNext}>Next Step</button>
                    </div>)}
                {step === 2 &&
                    <div>
                        <button onClick={() => setShowAI(!showAI)}>
                            {showAI ? 'Hide AI Generator' : '✨ Generate with AI'}
                        </button>

                        {showAI &&
                            <div>
                                <input type="text"
                                    placeholder="Topic: Math or history .."
                                    onChange={(e) => setInput(e.target.value)}
                                    value={input}
                                    onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                                />

                                <input type="number"
                                    value={questionsCount}
                                    onChange={(e) => setQuestionsCount(parseInt(e.target.value))}
                                />

                                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                </select>


                                <select value={type} onChange={(e) => setType(e.target.value)}>
                                    <option value="multiple">Multiple Choice</option>
                                    <option value="true_false">True/False</option>
                                    <option value="mixed">Mixed</option>
                                </select>

                                <button onClick={handleCreate}>✨ Generate Questions with AI</button>
                            </div>
                        }

                        {manualQuestions.map((q, index) => (
                            <div key={index}>
                                <input
                                    placeholder="Question"
                                    value={q.question}
                                    onChange={(e) => {
                                        const updatedQuestions = manualQuestions.map((q, i) =>
                                            i === index ? { ...q, question: e.target.value } : q
                                        );
                                        setManualQuestions(updatedQuestions);
                                    }}
                                />
                                <input
                                    placeholder="Correct answer"
                                    value={q.correct_answer}
                                    onChange={(e) => {
                                        const updatedQuestions = manualQuestions.map((q, i) =>
                                            i === index ? { ...q, correct_answer: e.target.value } : q
                                        );
                                        setManualQuestions(updatedQuestions);
                                    }}
                                />
                                {q.incorrect_answers.map((ans, ansIndex) => (
                                    <input
                                        key={ansIndex}
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
                                <button onClick={() => deleteQuestion(index)}>Delete Question</button>
                            </div>
                        ))}
                        <button onClick={addQuestion}>+ Add Question</button>
                        <button onClick={handleNext}>Review & Launch</button>
                    </div>}

            </div>



            {!errorMessage && isLoading && <p>Loading...</p>}
            {errorMessage && <p>{errorMessage}</p>}
        </div>
    );
}


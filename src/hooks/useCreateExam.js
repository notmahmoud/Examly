import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function useCreateExam() {
    const navigate = useNavigate();

    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [difficulty, setDifficulty] = useState('medium');
    const [questionsCount, setQuestionsCount] = useState(10);
    const [type, setType] = useState('multiple');
    const [isPublic, setIsPublic] = useState(false);
    const [examDuration, setExamDuration] = useState(10);
    const [examTitle, setExamTitle] = useState('');
    const [examDescription, setExamDescription] = useState('');
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
                            role: "user", content: `Generate ${questionsCount} questions about ${input}
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

    return {
        input, setInput,
        isLoading,
        difficulty, setDifficulty,
        questionsCount, setQuestionsCount,
        type, setType,
        isPublic, setIsPublic,
        examDuration, setExamDuration,
        examTitle, setExamTitle,
        examDescription, setExamDescription,
        errorMessage,
        showAI, setShowAI,
        manualQuestions, setManualQuestions,
        step, setStep,
        handleCreate,
        handleStepNext,
        addQuestion,
        deleteQuestion,
        handleNext,
        navigate
    };
}

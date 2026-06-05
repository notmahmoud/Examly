import { useLocation} from 'react-router-dom';
import { Navigate } from 'react-router-dom';
export function ExamResults() {
    const location = useLocation();
    const { score, questions, userAnswers } = location.state || {};

    if (!questions) return <Navigate to="/" />;
    
    // Decode HTML entities in questions and answers for proper display
    const decode = (str) => {
        const txt = document.createElement('textarea');
        txt.innerHTML = str;
        return txt.value;
    }

    return (
        <>
            <p>Score: {score}/{questions.length}</p>
            {questions.map((question, index) => (
                <div key={index}>
                    <p>{decode(question.question)}</p>
                    <p>Your answer: {decode(userAnswers[index] || 'Not answered')}</p>
                    <p>Correct answer: {decode(question.correct_answer)}</p>
                </div>
            ))}
        </>
    );
}
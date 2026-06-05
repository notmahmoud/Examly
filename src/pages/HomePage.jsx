import { useNavigate } from 'react-router-dom'
export function HomePage() {
    const navigate = useNavigate()
    return (
        <>
            <div className="home-page">
                <h1>Welcome to the Trivia Game!</h1>
                <p>Test your knowledge with our fun and challenging trivia questions. Click the button below to get started!</p>

                <button onClick={() => navigate('/create-exam')}>Create Your Own Quiz</button>
                <button onClick={() => navigate('/join')}>Join an Exam</button>

            </div>
        </>
    );
}
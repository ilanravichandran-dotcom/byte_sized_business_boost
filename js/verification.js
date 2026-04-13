/**
 * Verification Module
 * Handles bot verification to prevent automated access
 */

const VerificationManager = (() => {
    const VERIFICATION_QUESTIONS = [
        { question: "What is 5 + 3?", answer: "8" },
        { question: "What is 10 - 4?", answer: "6" },
        { question: "What is 2 × 3?", answer: "6" },
        { question: "What is 12 ÷ 4?", answer: "3" },
        { question: "What is 7 + 9?", answer: "16" },
        { question: "What is 15 - 8?", answer: "7" },
        { question: "What is 4 × 2?", answer: "8" },
        { question: "What is 20 ÷ 5?", answer: "4" }
    ];

    let currentQuestion = null;
    let isVerified = false;

    /**
     * Validate text input
     */
    function validateText(text, minLength = 1, maxLength = 500) {
        if (!text || text.trim().length === 0) {
            return { isValid: false, error: 'This field is required.' };
        }
        if (text.trim().length < minLength) {
            return { isValid: false, error: `Must be at least ${minLength} characters.` };
        }
        if (text.length > maxLength) {
            return { isValid: false, error: `Must not exceed ${maxLength} characters.` };
        }
        return { isValid: true, error: '' };
    }

    /**
     * Check if user is verified
     */
    function getIsVerified() {
        const verified = sessionStorage.getItem('verified');
        return verified === 'true';
    }

    /**
     * Show verification modal
     */
    function showModal() {
        const modal = document.getElementById('verificationModal');
        const questionElement = document.getElementById('verificationQuestion');
        const answerInput = document.getElementById('verificationAnswer');
        const errorElement = document.getElementById('verificationError');

        const randomIndex = Math.floor(Math.random() * VERIFICATION_QUESTIONS.length);
        currentQuestion = VERIFICATION_QUESTIONS[randomIndex];

        questionElement.textContent = currentQuestion.question;
        answerInput.value = '';
        errorElement.textContent = '';
        errorElement.classList.remove('show');

        modal.classList.add('active');
        answerInput.focus();

        answerInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                verify();
            }
        });
    }

    /**
     * Verify user's answer
     */
    function verify() {
        const answerInput = document.getElementById('verificationAnswer');
        const errorElement = document.getElementById('verificationError');
        const userAnswer = answerInput.value.trim();

        const validation = validateText(userAnswer, 1, 10);
        if (!validation.isValid) {
            errorElement.textContent = validation.error;
            errorElement.classList.add('show');
            return;
        }

        if (userAnswer.toLowerCase() === currentQuestion.answer.toLowerCase()) {
            isVerified = true;
            sessionStorage.setItem('verified', 'true');
            document.getElementById('verificationModal').classList.remove('active');
        } else {
            errorElement.textContent = 'Incorrect answer. Please try again.';
            errorElement.classList.add('show');
            const randomIndex = Math.floor(Math.random() * VERIFICATION_QUESTIONS.length);
            currentQuestion = VERIFICATION_QUESTIONS[randomIndex];
            document.getElementById('verificationQuestion').textContent = currentQuestion.question;
            answerInput.value = '';
            answerInput.focus();
        }
    }

    /**
     * Initialize verification
     */
    function initialize() {
        if (getIsVerified()) {
            isVerified = true;
            return;
        }
        showModal();
    }

    return {
        getIsVerified,
        initialize,
        showModal,
        verify,
        validateText
    };
})();

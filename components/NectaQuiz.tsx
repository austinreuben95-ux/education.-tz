import React, { useState } from 'react';

// Sample quiz data aligned with Tanzanian curriculum
export interface QuizQuestion {
  id: number;
  subject: string;
  topic: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    subject: "Basic Mathematics",
    topic: "Algebra & Equations",
    question: "If 2x + 6 = 18, what is the value of x?",
    options: ["x = 4", "x = 6", "x = 8", "x = 12"],
    correctIndex: 1,
    explanation: "Subtract 6 from both sides: 2x = 12. Then divide by 2: x = 6.",
  },
  {
    id: 2,
    subject: "Civics",
    topic: "Our Nation & National Symbols",
    question: "Which national symbol in Tanzania represents freedom and enlightenment?",
    options: ["The Coat of Arms", "The Uhuru Torch (Mwenge wa Uhuru)", "The National Flag", "The Currency"],
    correctIndex: 1,
    explanation: "The Uhuru Torch symbolizes freedom, dignity, and enlightenment across the nation.",
  },
  {
    id: 3,
    subject: "Biology",
    topic: "Cell Structure & Organization",
    question: "Which organelle is known as the powerhouse of the cell?",
    options: ["Nucleus", "Ribosome", "Mitochondria", "Cell Membrane"],
    correctIndex: 2,
    explanation: "Mitochondria produce ATP energy required for cellular functions.",
  }
];

export default function NectaQuiz() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQ = QUIZ_DATA[currentIndex];

  const handleSelectOption = (index: number) => {
    if (showExplanation) return; // Lock choices once answered
    setSelectedOption(index);
    setShowExplanation(true);

    if (index === currentQ.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < QUIZ_DATA.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setShowExplanation(false);
    setIsCompleted(false);
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <span style={styles.badge}>{currentQ?.subject || "NECTA Revision"}</span>
        <span style={styles.counter}>
          {isCompleted ? "Completed" : `Question ${currentIndex + 1} of ${QUIZ_DATA.length}`}
        </span>
      </div>

      {!isCompleted ? (
        <div>
          <h3 style={styles.topicTag}>{currentQ.topic}</h3>
          <p style={styles.questionText}>{currentQ.question}</p>

          <div style={styles.optionsList}>
            {currentQ.options.map((option, idx) => {
              let btnStyle: React.CSSProperties = { ...styles.optionBtn };

              if (showExplanation) {
                if (idx === currentQ.correctIndex) {
                  btnStyle.backgroundColor = "#dcfce7"; // Green for correct
                  btnStyle.borderColor = "#16a34a";
                  btnStyle.color = "#14532d";
                } else if (idx === selectedOption) {
                  btnStyle.backgroundColor = "#fee2e2"; // Red for incorrect
                  btnStyle.borderColor = "#dc2626";
                  btnStyle.color = "#7f1d1d";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  style={btnStyle}
                  disabled={showExplanation}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {showExplanation && (
            <div style={styles.explanationBox}>
              <div>
                <strong>💡 Explanation:</strong> {currentQ.explanation}
              </div>
              <button onClick={handleNext} style={styles.nextBtn}>
                {currentIndex + 1 === QUIZ_DATA.length ? "Finish Quiz" : "Next Question →"}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div style={styles.resultContainer}>
          <h2 style={{ margin: "0 0 12px 0", color: "#0f172a" }}>🎉 Quiz Completed!</h2>
          <p style={styles.scoreText}>
            You scored <strong>{score}</strong> out of <strong>{QUIZ_DATA.length}</strong>
          </p>
          <button onClick={handleRestart} style={styles.restartBtn}>
            Try Again 🔄
          </button>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    maxWidth: "600px",
    margin: "20px auto",
    padding: "24px",
    borderRadius: "16px",
    backgroundColor: "#ffffff",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
    fontFamily: "'Segoe UI', Roboto, sans-serif",
    border: "1px solid #e2e8f0",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  badge: {
    backgroundColor: "#eff6ff",
    color: "#2563eb",
    padding: "4px 12px",
    borderRadius: "9999px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  counter: {
    fontSize: "13px",
    color: "#64748b",
  },
  topicTag: {
    margin: "8px 0 4px 0",
    fontSize: "14px",
    color: "#0f172a",
    opacity: 0.7,
  },
  questionText: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: "20px",
  },
  optionsList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  optionBtn: {
    padding: "12px 16px",
    textAlign: "left",
    borderRadius: "10px",
    border: "2px solid #cbd5e1",
    backgroundColor: "#f8fafc",
    fontSize: "15px",
    fontWeight: "500",
    color: "#1e293b",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  explanationBox: {
    marginTop: "20px",
    padding: "16px",
    backgroundColor: "#f1f5f9",
    borderRadius: "10px",
    fontSize: "14px",
    color: "#334155",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  nextBtn: {
    alignSelf: "flex-end",
    padding: "8px 16px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  resultContainer: {
    textAlign: "center",
    padding: "20px 0",
  },
  scoreText: {
    fontSize: "18px",
    margin: "12px 0 24px 0",
    color: "#334155",
  },
  restartBtn: {
    padding: "10px 20px",
    backgroundColor: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

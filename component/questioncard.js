export default function QuestionCard({ question, selected, onSelect }) {
  return (
    <div
      style={{
        padding: 20,
        borderRadius: 10,
        backgroundColor: "#f5f5f5",
        marginBottom: 20,
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      }}
    >
      <p style={{ fontSize: 18, marginBottom: 15 }}>{question.question_text}</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {question.options.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            style={{
              padding: 12,
              borderRadius: 8,
              border: selected === option.id ? "2px solid #4CAF50" : "2px solid #ccc",
              backgroundColor: selected === option.id ? "#d4edda" : "#fff",
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#e8f5e9")}
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor =
                selected === option.id ? "#d4edda" : "#fff")
            }
          >
            {option.answer_text}
          </button>
        ))}
      </div>
    </div>
  );
}

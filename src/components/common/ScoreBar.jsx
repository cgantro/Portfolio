export default function ScoreBar({ score }) {
  const percent = Math.max(0, Math.min(100, (score / 5) * 100));

  return (
    <div className="score-wrap" aria-label={`숙련도 ${score}점`}>
      <div className="score-track">
        <div className="score-fill" style={{ width: `${percent}%` }} />
      </div>
      <span className="score-text">{score.toFixed(1)} / 5.0</span>
    </div>
  );
}

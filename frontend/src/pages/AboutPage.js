import React, { useState } from 'react';

const currentQuiz = [
    { q: "Who is the first hero ever released in MLBB?", o: ["Miya", "Layla", "Balmond", "Saber"], a: 0, h: "She is an elf archer." },
    { q: "Which item provides immunity to physical damage for 2 seconds?", o: ["Immortality", "Winter Truncheon", "Wind of Nature", "Rose Gold Meteor"], a: 2, h: "Used mainly by marksmen." },
    { q: "What is the highest rank achievable in MLBB?", o: ["Mythic", "Mythical Glory", "Mythical Immortal", "Legend"], a: 2, h: "Added in a recent season update, beyond Glory." },
    { q: "What is the maximum level a hero can reach during a match?", o: ["12", "15", "18", "20"], a: 1, h: "It is a multiple of 5." },
    { q: "Which objective spawns exactly at the 8-minute mark?", o: ["Lithowanderer", "Turtle", "Lord", "Crab"], a: 2, h: "Defeating this will summon it to push a lane for your team." },
    { q: "Which Battle Spell teleports your hero a short distance instantly?", o: ["Sprint", "Purify", "Arrival", "Flicker"], a: 3, h: "Very popular for escaping or surprising enemies over walls." },
    { q: "In the lore, who is the older brother of Gusion?", o: ["Aamon", "Lancelot", "Alucard", "Tigreal"], a: 0, h: "He is an assassin who uses shards and camouflage." },
    { q: "Which of these items reduces an enemy's healing and shield effects?", o: ["Blade of Despair", "Dominance Ice", "Bloodlust Axe", "Athena's Shield"], a: 1, h: "It is a defense item often built by Tanks and Roamers." },
    { q: "What is the name of the world where Mobile Legends takes place?", o: ["Runeterra", "The Land of Dawn", "Azeroth", "Eruditio"], a: 1, h: "The announcer welcomes you here at the start of every match." },
    { q: "Which hero can transform into a flying black dragon?", o: ["Zilong", "Baxia", "Yu Zhong", "Chou"], a: 2, h: "He is a dominant Exp Laner." }
];

export default function AboutPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hintMsg, setHintMsg] = useState("");
  const [resultMsg, setResultMsg] = useState("");
  const [isFinished, setIsFinished] = useState(false);

  const handleOptionClick = (index) => {
      setSelectedOption(index);
  };

  const showHint = () => {
      setHintMsg(`Hint: ${currentQuiz[currentIndex].h}`);
  };

  const handleSubmit = () => {
      const data = currentQuiz[currentIndex];
      if (selectedOption === data.a) {
          setScore(score + 1);
          setResultMsg("Correct! ✨");
      } else {
          setResultMsg(`Wrong! It was ${data.o[data.a]}.`);
      }

      setTimeout(() => {
          if (currentIndex + 1 < currentQuiz.length) {
              setCurrentIndex(currentIndex + 1);
              setSelectedOption(null);
              setResultMsg("");
              setHintMsg("");
          } else {
              setIsFinished(true);
          }
      }, 1500);
  };

  const handleRestart = () => {
      setCurrentIndex(0);
      setScore(0);
      setSelectedOption(null);
      setResultMsg("");
      setHintMsg("");
      setIsFinished(false);
  };

  return (
    <main>
      <section className="card text-center">
          <h2>My Hero Pool</h2>
          <p>I specialize in high-mobility assassins and crowd-control heavy tanks.</p>
          <img src="images/aboutrealHeroPool.jpg" alt="Setup" className="hero-img mt-2" style={{ maxWidth: '300px' }} />
      </section>

      <section className="card text-center">
          <h2>Battle Stations & Highlights</h2>
          <div className="gallery">
              <img src="images/about2.jpg" alt="PC Setup" />
              <img src="images/about1.jpg" alt="Mobile Gaming" />
          </div>
      </section>

      <section className="quiz-section text-center">
          <h2>MLBB Knowledge Check</h2>
          {/* Progress Bar dynamically adjusts to the new 10-question length */}
          <div style={{ width: '100%', background: '#ddd', height: '10px', borderRadius: '5px', margin: '15px 0' }}>
              <div style={{ width: `${isFinished ? 100 : (currentIndex / currentQuiz.length) * 100}%`, height: '100%', background: 'var(--accent-color)', transition: 'width 0.3s' }}></div>
          </div>

          {!isFinished ? (
              <>
                  <h3>{currentQuiz[currentIndex].q}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '20px 0' }}>
                      {currentQuiz[currentIndex].o.map((option, index) => (
                          <div 
                              key={index}
                              onClick={() => handleOptionClick(index)}
                              style={{
                                  padding: '10px', border: '1px solid #ccc', borderRadius: '5px', cursor: 'pointer',
                                  background: selectedOption === index ? 'var(--primary-color)' : 'transparent',
                                  color: selectedOption === index ? '#fff' : 'inherit'
                              }}
                          >
                              {option}
                          </div>
                      ))}
                  </div>
                  
                  <p style={{ fontWeight: 'bold', minHeight: '24px', color: resultMsg.includes("Correct") ? 'green' : 'red' }}>{resultMsg}</p>
                  <p style={{ color: '#d97706', minHeight: '24px' }}>{hintMsg}</p>
                  
                  <button onClick={showHint} disabled={resultMsg !== ""}>Use Hint</button>
                  <button onClick={handleSubmit} disabled={selectedOption === null || resultMsg !== ""} style={{ marginLeft: '10px' }}>Submit Answer</button>
              </>
          ) : (
              <>
                  <h3>Quiz Complete!</h3>
                  <h3>Score: {score} / {currentQuiz.length}</h3>
                  <p style={{ fontWeight: 'bold' }}>
                      {score === currentQuiz.length ? "Mythical Immortal Knowledge! 🏆" : 
                       score >= 7 ? "Mythic Level Player! 🔥" : 
                       "Keep Grinding!"}
                  </p>
                  <button onClick={handleRestart} className="mt-2">Play Again</button>
              </>
          )}
      </section>
    </main>
  );
}
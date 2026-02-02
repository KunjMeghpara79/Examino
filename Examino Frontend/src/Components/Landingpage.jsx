import DecryptedText from './DecryptedText';
import GradientText from './GradientText';
import InteractiveDots from './InteractiveDots';
import SpotlightCard from './SpotlightCard';


export default function LandingPage() {
  return (
    <InteractiveDots backgroundColor="#000000">
      <div className="min-h-screen text-white">
        {/* Header */}
        <header className="flex justify-between items-center px-8 py-4 bg-black bg-opacity-0 border-b border-zinc-800">
          <h1 className="text-2xl font-semibold">
            <GradientText colors={["#5227FF", "#FF9FFC", "#B19EEF"]} animationSpeed={8} showBorder={false}>
              Examino
            </GradientText>
          </h1>
          <button className="px-4 py-2 rounded-lg border-2 border-purple-600 text-purple-600 bg-transparent hover:bg-purple-600 hover:text-white transition-colors duration-300 cursor-pointer">
            Login
          </button>

        </header>

        {/* Hero */}
        <section className="text-center py-28 px-8  bg-opacity-0">
          <h2 className="text-5xl font-bold mb-4">
            <GradientText colors={["#5227FF", "#FF9FFC", "#B19EEF"]} animationSpeed={8} showBorder={false}>
              <DecryptedText text="Outscore. Outlearn. Outwork." animateOn="view" revealDirection="start" sequential useOriginalCharsOnly={false} />
            </GradientText>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-6">
            Take quizzes across multiple domains, challenge yourself, and track your progress.
          </p>
          <button className="px-6 py-3 rounded-lg border-2 border-purple-600 text-purple-600 bg-transparent hover:bg-purple-600 hover:text-white transition-colors duration-300 cursor-pointer text-lg">
            Get Started
          </button>

        </section>

        {/* Features */}
        <section className="px-3 py-20  bg-opacity-0">
          <h3 className="text-3xl font-bold text-center mb-12">Features</h3>
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { title: "Exam Integrity", desc: "Any attempt to leave the exam screen, switch browser tabs, or exit full-screen mode is automatically detected and flagged as a violation." },
              { title: "Leaderboard", desc: "Discover where you stand among the best, track high scores, and compete for the top position on the Examino leaderboard." },
              { title: "Timed Mode", desc: "Challenge yourself with time-bound quizzes designed to improve speed, concentration, and decision-making skills." },
              { title: "Progress Analytics", desc: "Track your learning journey with visual analytics that highlight strengths, weaknesses, and progress." },
              { title: "Performance Report Export", desc: "Generate and export comprehensive result reports containing scores, attempt details, and analytics in a downloadable format." },
              { title: "Security", desc: "All user data, including quiz progress, scores, and personal details, is securely stored and handled with strict privacy controls to prevent unauthorized access." },
            ].map((f, i) => (
              <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(0, 229, 255, 0.2)">
                <h2 className="text-2xl font-semibold mb-2">{f.title}  </h2>
                <h6 className='mt-5'>{f.desc}</h6>
              </SpotlightCard>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-6 text-gray-500 bg-black bg-opacity-40 border-t border-zinc-800 text-sm">
          © {new Date().getFullYear()} Examino · All Rights Reserved
        </footer>
      </div>
    </InteractiveDots>
  );
}

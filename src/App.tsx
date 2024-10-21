import React, { useState, useEffect } from 'react';
import { SubcriterionSlider } from './components/SubcriterionSlider';
import { Trophy, PlusCircle, Trash2 } from 'lucide-react';

interface Subcriterion {
  name: string;
  maxPoints: number;
}

interface Criterion {
  name: string;
  maxPoints: number;
  subcriteria: Subcriterion[];
}

interface Team {
  id: number;
  name: string;
  scores: { [key: string]: { [key: string]: number } };
}

const criteria: Criterion[] = [
  {
    name: "Creativity",
    maxPoints: 25,
    subcriteria: [
      { name: "Originality: How unique and innovative is the concept?", maxPoints: 9 },
      { name: "Problem-solving: Does it address pharmacy challenges in novel ways?", maxPoints: 8 },
      { name: "Design: Is the virtual pharmacy aesthetically appealing and well-designed?", maxPoints: 8 },
    ],
  },
  {
    name: "Interactivity",
    maxPoints: 25,
    subcriteria: [
      { name: "User Experience: How intuitive and engaging is the interface?", maxPoints: 9 },
      { name: "Functionality: Does it offer interactive features that enhance the pharmacy experience?", maxPoints: 8 },
      { name: "Accessibility: Is it easy for users of varying technical abilities to navigate?", maxPoints: 8 },
    ],
  },
  {
    name: "Team Collaboration",
    maxPoints: 15,
    subcriteria: [
      { name: "Roles: Did team members have clearly defined and complementary roles?", maxPoints: 5 },
      { name: "Execution: How well did the team work together to bring the concept to life?", maxPoints: 5 },
      { name: "Presentation: Was the project presented cohesively by the team?", maxPoints: 5 },
    ],
  },
  {
    name: "Traction",
    maxPoints: 15,
    subcriteria: [
      { name: "Feasibility: How realistic is the implementation of this concept?", maxPoints: 5 },
      { name: "Scalability: Can the solution be easily expanded or adapted?", maxPoints: 5 },
      { name: "Market Potential: Is there a clear target audience and business model?", maxPoints: 5 },
    ],
  },
  {
    name: "Vision",
    maxPoints: 20,
    subcriteria: [
      { name: "Impact: How could this transform pharmacy services in the metaverse?", maxPoints: 7 },
      { name: "Future-readiness: Does it anticipate and address upcoming trends in healthcare?", maxPoints: 7 },
      { name: "Sustainability: Is there a long-term plan for maintaining and evolving the project?", maxPoints: 6 },
    ],
  },
];

function App() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentTeamId, setCurrentTeamId] = useState<number | null>(null);

  useEffect(() => {
    addTeam();
  }, []);

  const addTeam = () => {
    if (teams.length >= 10) return;
    const newTeam: Team = {
      id: Date.now(),
      name: `Team ${teams.length + 1}`,
      scores: {},
    };
    criteria.forEach(criterion => {
      newTeam.scores[criterion.name] = {};
      criterion.subcriteria.forEach(subcriterion => {
        newTeam.scores[criterion.name][subcriterion.name] = 0;
      });
    });
    setTeams([...teams, newTeam]);
    setCurrentTeamId(newTeam.id);
  };

  const removeTeam = (id: number) => {
    const updatedTeams = teams.filter(team => team.id !== id);
    setTeams(updatedTeams);
    if (currentTeamId === id) {
      setCurrentTeamId(updatedTeams[0]?.id || null);
    }
  };

  const handleTeamNameChange = (id: number, newName: string) => {
    setTeams(teams.map(team => 
      team.id === id ? { ...team, name: newName } : team
    ));
  };

  const handleScoreChange = (teamId: number, criterionName: string, subcriterionName: string, value: number) => {
    setTeams(teams.map(team => 
      team.id === teamId ? {
        ...team,
        scores: {
          ...team.scores,
          [criterionName]: {
            ...team.scores[criterionName],
            [subcriterionName]: value,
          },
        },
      } : team
    ));
  };

  const calculateTotalScore = (teamId: number) => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return 0;
    return Object.values(team.scores).reduce((criterionSum, criterionScores) => 
      criterionSum + Object.values(criterionScores).reduce((sum, score) => sum + score, 0), 0
    );
  };

  const calculateCriterionScore = (teamId: number, criterionName: string) => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return 0;
    return Object.values(team.scores[criterionName] || {}).reduce((sum, score) => sum + score, 0);
  };

  const currentTeam = teams.find(team => team.id === currentTeamId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Metaverse Pharmacy Hackathon</h1>
          <p className="text-xl">Judging Panel</p>
        </header>

        <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg shadow-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Teams</h2>
            <button 
              onClick={addTeam}
              disabled={teams.length >= 10}
              className="flex items-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Add Team
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {teams.map(team => (
              <div 
                key={team.id} 
                className={`p-4 rounded-lg cursor-pointer flex justify-between items-center ${
                  team.id === currentTeamId ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                }`}
                onClick={() => setCurrentTeamId(team.id)}
              >
                <input
                  type="text"
                  value={team.name}
                  onChange={(e) => handleTeamNameChange(team.id, e.target.value)}
                  className="bg-transparent border-b border-white text-white placeholder-gray-300 focus:outline-none"
                  placeholder="Enter team name"
                />
                <div className="flex items-center">
                  <span className="mr-2">{calculateTotalScore(team.id)}</span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTeam(team.id);
                    }}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {currentTeam && (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Project Score: {currentTeam.name}</h2>
                <div className="flex items-center">
                  <Trophy className="w-8 h-8 mr-2 text-yellow-300" />
                  <span className="text-3xl font-bold">{calculateTotalScore(currentTeam.id)}</span>
                  <span className="text-xl ml-1">/ 100</span>
                </div>
              </div>

              {criteria.map((criterion) => (
                <div key={criterion.name} className="mb-8">
                  <h3 className="text-xl font-semibold mb-2">
                    {criterion.name} ({calculateCriterionScore(currentTeam.id, criterion.name)} / {criterion.maxPoints} points)
                  </h3>
                  {criterion.subcriteria.map((subcriterion) => (
                    <SubcriterionSlider
                      key={subcriterion.name}
                      name={subcriterion.name}
                      maxPoints={subcriterion.maxPoints}
                      value={currentTeam.scores[criterion.name]?.[subcriterion.name] || 0}
                      onChange={(value) => handleScoreChange(currentTeam.id, criterion.name, subcriterion.name, value)}
                    />
                  ))}
                </div>
              ))}
            </>
          )}
        </div>

        <footer className="text-center text-sm opacity-70">
          <p>© 2024 Metaverse Pharmacy Hackathon. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
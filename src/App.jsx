import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Big12WheelSpinner = () => {
  const teams = [
    'BYU', 'Utah', 'Colorado', 'Arizona', 'Arizona State',
    'Kansas', 'Kansas State', 'Iowa State', 'UCF',
    'Cincinnati', 'Houston', 'TCU', 'Texas Tech', 'Baylor', 
    'Oklahoma State', 'West Virginia'
  ];

  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState('');
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      const response = await fetch('/api/results');
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error loading results:', error);
      setResults({});
    } finally {
      setLoading(false);
    }
  };

  const saveResult = async (team) => {
    try {
      const response = await fetch('/api/spin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ team }),
      });
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error saving result:', error);
    }
  };

  const selectTeam = () => {
    const rand = Math.random();
    if (rand < 0.5) {
      return 'BYU';
    }
    const otherTeams = teams.filter(t => t !== 'BYU');
    return otherTeams[Math.floor(Math.random() * otherTeams.length)];
  };

  const spinWheel = () => {
    if (spinning) return;

    setSpinning(true);
    setResult('');

    const selectedTeam = selectTeam();
    const teamIndex = teams.indexOf(selectedTeam);
    const segmentAngle = 360 / teams.length;
    const targetAngle = 360 - (teamIndex * segmentAngle + segmentAngle / 2);
    const spins = 5;
    const finalRotation = spins * 360 + targetAngle;

    setRotation(finalRotation);

    setTimeout(() => {
      setSpinning(false);
      setResult(selectedTeam);
      saveResult(selectedTeam);
    }, 4000);
  };

  const getChartData = () => {
    return teams
      .map(team => ({
        team,
        spins: results[team] || 0
      }))
      .sort((a, b) => b.spins - a.spins);
  };

  const totalSpins = Object.values(results).reduce((sum, count) => sum + count, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-white text-center mb-4">
          Who's the Best Big 12 Team? 🏈
        </h1>
        <p className="text-blue-200 text-center mb-8">
          Spin the wheel to find out!
        </p>

        <div className="flex flex-col items-center mb-12">
          <div className="relative w-96 h-96 mb-8">
            <div className="absolute inset-0 flex items-start justify-center z-10">
              <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[40px] border-t-red-500 mt-2"></div>
            </div>

            <svg
              className="w-full h-full"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: spinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none'
              }}
              viewBox="0 0 200 200"
            >
              {teams.map((team, index) => {
                const angle = (360 / teams.length) * index;
                const nextAngle = (360 / teams.length) * (index + 1);
                const startRad = (angle * Math.PI) / 180;
                const endRad = (nextAngle * Math.PI) / 180;
                
                const x1 = 100 + 95 * Math.cos(startRad);
                const y1 = 100 + 95 * Math.sin(startRad);
                const x2 = 100 + 95 * Math.cos(endRad);
                const y2 = 100 + 95 * Math.sin(endRad);

                const midAngle = (startRad + endRad) / 2;
                const textX = 100 + 65 * Math.cos(midAngle);
                const textY = 100 + 65 * Math.sin(midAngle);

                const colors = ['#1e40af', '#3b82f6', '#60a5fa', '#93c5fd'];
                const color = colors[index % colors.length];

                return (
                  <g key={team}>
                    <path
                      d={`M 100 100 L ${x1} ${y1} A 95 95 0 0 1 ${x2} ${y2} Z`}
                      fill={color}
                      stroke="white"
                      strokeWidth="2"
                    />
                    <text
                      x={textX}
                      y={textY}
                      fill="white"
                      fontSize="8"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${angle + 360 / teams.length / 2}, ${textX}, ${textY})`}
                    >
                      {team}
                    </text>
                  </g>
                );
              })}
              <circle cx="100" cy="100" r="15" fill="white" />
            </svg>
          </div>

          <button
            onClick={spinWheel}
            disabled={spinning}
            className={`px-8 py-4 text-xl font-bold rounded-full shadow-lg transition-all ${
              spinning
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-yellow-500 hover:bg-yellow-400 hover:scale-105 active:scale-95'
            } text-blue-900`}
          >
            {spinning ? 'SPINNING...' : 'SPIN THE WHEEL!'}
          </button>

          {result && (
            <div className="mt-8 p-6 bg-white rounded-lg shadow-xl">
              <p className="text-3xl font-bold text-blue-900 text-center">
                🎉 {result} 🎉
              </p>
              <p className="text-blue-600 text-center mt-2">
                is the best Big 12 team!
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-xl p-6">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">
            Results ({totalSpins} total spins)
          </h2>
          
          {totalSpins > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="team" 
                  angle={-45} 
                  textAnchor="end" 
                  height={100}
                  interval={0}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="spins" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No spins yet! Be the first to spin the wheel.
            </p>
          )}

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {getChartData().map(({ team, spins }) => (
              <div key={team} className="bg-blue-50 p-3 rounded-lg">
                <p className="font-semibold text-blue-900">{team}</p>
                <p className="text-2xl font-bold text-blue-600">{spins}</p>
                {totalSpins > 0 && (
                  <p className="text-sm text-blue-500">
                    {((spins / totalSpins) * 100).toFixed(1)}%
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center text-blue-200 text-sm">
          <p>⚠️ Results are shared across all users</p>
          <p className="mt-2">This wheel is totally unbiased and fair* 😇</p>
          <p className="text-xs mt-1">*maybe</p>
        </div>
      </div>
    </div>
  );
};

export default Big12WheelSpinner;

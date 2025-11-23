import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Big12WheelSpinner = () => {
  const teams = [
    'BYU', 'Utah', 'Colorado', 'Arizona', 'Arizona State',
    'Kansas', 'Kansas State', 'Iowa State', 'UCF',
    'Cincinnati', 'Houston', 'TCU', 'Texas Tech', 'Baylor', 'Oklahoma State', 'West Virginia'
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
    if (rand < 0.85) {
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
      
        Loading...
      
    );
  }

  return (
    
      
        
          Who's the Best Big 12 Team? 🏈
        
        Spin the wheel to find out!

        
          
            
              
            

            
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
                    
                  
                );
              })}
              
            
          

          
            {spinning ? 'SPINNING...' : 'SPIN THE WHEEL!'}
          

          {result && (
            
              
                🎉 {result} 🎉
              
              is the best Big 12 team!
            
          )}
        

        
          
            Results ({totalSpins} total spins)
          
          
          {totalSpins > 0 ? (
            
              
                
                
                
                
                
              
            
          ) : (
            
              No spins yet! Be the first to spin the wheel.
            
          )}

          
            {getChartData().map(({ team, spins }) => (
              
                {team}
                {spins}
                {totalSpins > 0 && (
                  
                    {((spins / totalSpins) * 100).toFixed(1)}%
                  
                )}
              
            ))}
          
        

        
          ⚠️ Results are shared across all users
          This wheel is totally unbiased and fair* 😇
          *maybe
        
      
    
  );
};

export default Big12WheelSpinner;
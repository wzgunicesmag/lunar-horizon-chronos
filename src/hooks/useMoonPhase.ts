import { useState, useEffect } from 'react';

interface MoonPhaseData {
  phase: number; // 0-1
  phaseName: string;
  phasePercentage: number;
  illumination: number;
}

// Calculate moon phase based on date
function calculateMoonPhase(date: Date): MoonPhaseData {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Julian date calculation
  let jd = 367 * year - Math.floor(7 * (year + Math.floor((month + 9) / 12)) / 4) +
    Math.floor(275 * month / 9) + day + 1721013.5;

  // Days since known new moon (January 6, 2000)
  const daysSinceNew = jd - 2451549.5;
  
  // Moon phase (synodic month ≈ 29.53 days)
  const newMoons = daysSinceNew / 29.53;
  let phase = newMoons - Math.floor(newMoons);
  
  if (phase < 0) phase += 1;

  // Calculate illumination percentage
  const illumination = (1 - Math.cos(phase * 2 * Math.PI)) / 2 * 100;

  // Determine phase name
  let phaseName: string;
  if (phase < 0.0625 || phase >= 0.9375) {
    phaseName = "Luna Nueva";
  } else if (phase < 0.1875) {
    phaseName = "Creciente Iluminante";
  } else if (phase < 0.3125) {
    phaseName = "Cuarto Creciente";
  } else if (phase < 0.4375) {
    phaseName = "Creciente Gibosa";
  } else if (phase < 0.5625) {
    phaseName = "Luna Llena";
  } else if (phase < 0.6875) {
    phaseName = "Menguante Gibosa";
  } else if (phase < 0.8125) {
    phaseName = "Cuarto Menguante";
  } else {
    phaseName = "Menguante Iluminante";
  }

  return {
    phase,
    phaseName,
    phasePercentage: illumination,
    illumination,
  };
}

export function useMoonPhase(selectedDate: Date) {
  const [moonData, setMoonData] = useState<MoonPhaseData>(() => calculateMoonPhase(selectedDate));

  useEffect(() => {
    setMoonData(calculateMoonPhase(selectedDate));
  }, [selectedDate]);

  return moonData;
}

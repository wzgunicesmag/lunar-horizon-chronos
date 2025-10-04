export interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  timezone: string;
}

export interface NasaMoonData {
  phase: number;
  illumination: number;
  distance: number;
  angularDiameter: number;
  phaseName: string;
}

export interface MoonPhaseData {
  phase: number;
  phaseName: string;
  phasePercentage: number;
  illumination: number;
  distance?: number;
  angularDiameter?: number;
  location?: string;
  source: 'nasa' | 'local';
}

export interface Wish {
  id: number;
  text: string;
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  speedX: number;
  speedY: number;
}

export interface BalloonProps {
  id: number;
  x: number;
  speed: number;
  color: string;
  delay: number;
  onPop: (id: number) => void;
}

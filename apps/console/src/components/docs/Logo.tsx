import { cn } from "@/lib/utils";

interface LogoProps {
  size?: number;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 45, className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={cn(
        "transition-transform duration-300 hover:scale-105",
        className
      )}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#3B82F6" }} />
          <stop offset="100%" style={{ stopColor: "#2563EB" }} />
        </linearGradient>
      </defs>
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="url(#logoGradient)"
        className="drop-shadow-lg"
      />
      <path
        d="M55 20 L30 50 L48 50 L45 80 L70 50 L52 50 Z"
        fill="none"
        stroke="#ffffff"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="drop-shadow"
      />
    </svg>
  );
};

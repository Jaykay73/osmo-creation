type IconProps = {
  className?: string;
  size?: number;
};

export function ArrowUpRight({ className, size = 16 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path d="M4 12L12 4M12 4H5.5M12 4V10.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function ArrowRight({ className, size = 16 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path d="M2.5 8H13.5M13.5 8L8.5 3M13.5 8L8.5 13" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function ArrowLeft({ className, size = 16 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path d="M13.5 8H2.5M2.5 8L7.5 3M2.5 8L7.5 13" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function ArrowDown({ className, size = 16 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path d="M8 2.5V13.5M8 13.5L3 8.5M8 13.5L13 8.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function PlayIcon({ className, size = 20 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path d="M6.5 4.2L15.5 10L6.5 15.8V4.2Z" fill="currentColor" />
    </svg>
  );
}

export function PauseIcon({ className, size = 20 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <rect x="5" y="4" width="3.2" height="12" fill="currentColor" />
      <rect x="11.8" y="4" width="3.2" height="12" fill="currentColor" />
    </svg>
  );
}

export function VolumeIcon({ className, muted, size = 18 }: IconProps & { muted?: boolean }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path d="M3 8H6L10 4.5V15.5L6 12H3V8Z" stroke="currentColor" strokeWidth="1.2" />
      {muted ? (
        <path d="M13 8L17 12M17 8L13 12" stroke="currentColor" strokeWidth="1.2" />
      ) : (
        <>
          <path d="M13 7.4C14.1 8.1 14.1 11.9 13 12.6" stroke="currentColor" strokeWidth="1.2" />
          <path d="M15.1 5.6C17.2 7.2 17.2 12.8 15.1 14.4" stroke="currentColor" strokeWidth="1.2" />
        </>
      )}
    </svg>
  );
}

export function FullscreenIcon({ className, size = 18 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7 3H3V7M13 3H17V7M17 13V17H13M7 17H3V13"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}

export function CloseIcon({ className, size = 18 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
    >
      <path d="M3.5 3.5L14.5 14.5M14.5 3.5L3.5 14.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

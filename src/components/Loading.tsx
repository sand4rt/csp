export function Loading() {
  return (
    <svg
      role="status"
      aria-live="assertive"
      aria-busy="true"
      className="mx-auto mt-20 animate-spin duration-300"
      width="84"
      height="84"
      viewBox="0 0 84 84"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_63_123)">
        <path
          d="M42 14V3.5L56 17.5L42 31.5V21C30.45 21 21 30.45 21 42C21 45.5 21.7 49 23.45 51.8L18.2 57.05C15.75 52.5 14 47.6 14 42C14 26.6 26.6 14 42 14ZM42 63C53.55 63 63 53.55 63 42C63 38.5 62.3 35 60.55 32.2L65.8 26.95C68.25 31.5 70 36.4 70 42C70 57.4 57.4 70 42 70V80.5L28 66.5L42 52.5V63Z"
          fill="black"
        />
      </g>
      <defs>
        <clipPath id="clip0_63_123">
          <rect width="84" height="84" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

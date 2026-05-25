import { memo } from "react";

/**
 * AiOrb Component
 *
 * A visually complex animated SVG orb with gradients, filters, and blend modes.
 * This component is memoized as it contains static SVG content that doesn't need to re-render.
 *
 * @param className - Optional CSS class for sizing (default: "w-40 h-40")
 * @param animated - If true, enables rotating color animation (default: false)
 */
export const AiOrb = memo<{ className?: string; animated?: boolean }>(
  ({ className = "w-40 h-40", animated = false }) => {
    return (
      <div
        className={`orb-container relative inline-block shrink-0 rounded-full overflow-hidden bg-transparent ${className}`}
      >
        {/* Add animation styles when animated prop is true */}
        {animated && (
          <style>{`
            @keyframes orb-rotate-colors {
              from {
                transform: rotate(0deg);
              }
              to {
                transform: rotate(360deg);
              }
            }
          `}</style>
        )}

        {/* The Orb SVG */}
        <svg
          className="orb-svg size-full"
          width="161"
          height="161"
          viewBox="0 0 161 161"
          fill="none"
          overflow="hidden"
          xmlns="http://www.w3.org/2000/svg"
        >
          {animated && (
            <g filter="url(#filter0_f_2406_16701)">
              <g clipPath="url(#paint0_angular_2406_16701_clip_path)">
                <g transform="matrix(0 0.0530513 -0.0530513 0 80.0763 80.0762)">
                  <foreignObject
                    x="-1011.07"
                    y="-1011.07"
                    width="2022.15"
                    height="2022.15"
                  >
                    <div
                      className="orb-rotating-gradient"
                      style={{
                        background:
                          "conic-gradient(from 90deg,rgba(59, 130, 246, 1) 0deg,rgba(255, 255, 255, 1) 120.6deg,rgba(99, 102, 241, 1) 250.2deg,rgba(6, 182, 212, 1) 360deg)",
                        height: "100%",
                        width: "100%",
                        opacity: 0.2,
                        transformOrigin: "50% 50%",
                        animation: "orb-rotate-colors 8s linear infinite",
                      }}
                    />
                  </foreignObject>
                </g>
              </g>
              <circle cx="80.0763" cy="80.0762" r="53.0513" />
            </g>
          )}
          <g clipPath="url(#clip0_2406_16701)">
            <g clipPath="url(#clip1_2406_16701)">
              <rect
                width="150.4"
                height="94"
                transform="translate(26.3201 32.0774)"
                fill="white"
              />
              <g filter="url(#filter1_f_2406_16701)">
                <circle cx="101.572" cy="89.6785" r="45.2767" fill="#6482F2" />
              </g>
              <g filter="url(#filter2_f_2406_16701)">
                <circle cx="87.2634" cy="141.274" r="45.2767" fill="#4FFFF3" />
              </g>
              <g filter="url(#filter3_f_2406_16701)">
                <ellipse
                  cx="43.6579"
                  cy="38.6053"
                  rx="28.9311"
                  ry="63.9722"
                  fill="#2BCEF4"
                />
              </g>
              <g filter="url(#filter4_f_2406_16701)">
                <ellipse
                  cx="175.78"
                  cy="62.1053"
                  rx="28.9311"
                  ry="63.9722"
                  fill="#3559EC"
                />
              </g>
            </g>
          </g>
          <g filter="url(#filter5_f_2406_16701)">
            <rect
              x="50.6943"
              y="47.8503"
              width="59.5864"
              height="59.5864"
              rx="29.7932"
              fill="url(#paint1_radial_2406_16701)"
              fillOpacity="0.5"
            />
          </g>
          <g filter="url(#filter6_f_2406_16701)">
            <ellipse
              cx="78.96"
              cy="78.6075"
              rx="48.2925"
              ry="47.47"
              fill="url(#paint2_radial_2406_16701)"
            />
          </g>
          <g
            filter="url(#filter7_f_2406_16701)"
            style={{ mixBlendMode: "overlay" }}
          >
            <path
              d="M84.7893 38.5395C58.511 37.1623 39.9427 47.4619 38.5859 73.3513"
              stroke="url(#paint3_linear_2406_16701)"
              strokeWidth="2.115"
            />
          </g>
          <defs>
            <filter
              id="filter0_f_2406_16701"
              x="2.28882e-05"
              y="-9.91821e-05"
              width="160.152"
              height="160.152"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="13.5125"
                result="effect1_foregroundBlur_2406_16701"
              />
            </filter>
            <clipPath id="paint0_angular_2406_16701_clip_path">
              <circle cx="80.0763" cy="80.0762" r="53.0513" />
            </clipPath>
            <filter
              id="filter1_f_2406_16701"
              x="14.5179"
              y="2.62408"
              width="174.109"
              height="174.109"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="20.8889"
                result="effect1_foregroundBlur_2406_16701"
              />
            </filter>
            <filter
              id="filter2_f_2406_16701"
              x="0.208977"
              y="54.2195"
              width="174.109"
              height="174.109"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="20.8889"
                result="effect1_foregroundBlur_2406_16701"
              />
            </filter>
            <filter
              id="filter3_f_2406_16701"
              x="-27.051"
              y="-67.1447"
              width="141.418"
              height="211.5"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="20.8889"
                result="effect1_foregroundBlur_2406_16701"
              />
            </filter>
            <filter
              id="filter4_f_2406_16701"
              x="105.071"
              y="-43.6447"
              width="141.418"
              height="211.5"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="20.8889"
                result="effect1_foregroundBlur_2406_16701"
              />
            </filter>
            <filter
              id="filter5_f_2406_16701"
              x="43.4032"
              y="40.5592"
              width="74.1688"
              height="74.1688"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="3.64558"
                result="effect1_foregroundBlur_2406_16701"
              />
            </filter>
            <filter
              id="filter6_f_2406_16701"
              x="24.44"
              y="24.91"
              width="109.04"
              height="107.395"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="3.11375"
                result="effect1_foregroundBlur_2406_16701"
              />
            </filter>
            <filter
              id="filter7_f_2406_16701"
              x="33.8286"
              y="33.6598"
              width="54.7173"
              height="43.4479"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="1.85063"
                result="effect1_foregroundBlur_2406_16701"
              />
            </filter>
            <radialGradient
              id="paint1_radial_2406_16701"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(80.4876 77.6436) rotate(90) scale(29.7932)"
            >
              <stop stopColor="white" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </radialGradient>
            <radialGradient
              id="paint2_radial_2406_16701"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(78.96 78.6075) rotate(90) scale(47.47 48.2925)"
            >
              <stop offset="0.924177" stopColor="white" stopOpacity="0" />
              <stop offset="1" stopColor="white" />
            </radialGradient>
            <linearGradient
              id="paint3_linear_2406_16701"
              x1="21.3727"
              y1="44.7841"
              x2="128.744"
              y2="90.1462"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" />
              <stop offset="0.38139" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <clipPath id="clip0_2406_16701">
              <rect
                x="33.4875"
                y="32.0774"
                width="94"
                height="94"
                rx="47"
                fill="white"
              />
            </clipPath>
            <clipPath id="clip1_2406_16701">
              <rect
                width="150.4"
                height="94"
                fill="white"
                transform="translate(26.3201 32.0774)"
              />
            </clipPath>
          </defs>
        </svg>
      </div>
    );
  },
);

AiOrb.displayName = "AiOrb";

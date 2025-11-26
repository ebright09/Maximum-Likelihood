import { Module } from './types';

// SVG Avatar of Professor Max (South Park Style) - No Glasses
export const PROF_MAX_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" class="w-full h-full">
  <!-- Background Aura -->
  <circle cx="100" cy="100" r="95" fill="#FDB515" opacity="0.2" />
  
  <!-- Body/Blazer -->
  <path d="M50,180 Q50,130 100,130 Q150,130 150,180 L150,200 L50,200 Z" fill="#003262" />
  <path d="M90,130 L90,200" stroke="#000" stroke-width="1" />
  
  <!-- Shirt -->
  <path d="M85,130 L115,130 L115,180 L85,180 Z" fill="#ADD8E6" />
  <!-- Checkered Pattern -->
  <path d="M85,140 H115 M85,150 H115 M85,160 H115 M85,170 H115 M95,130 V180 M105,130 V180" stroke="#fff" stroke-width="0.5" opacity="0.5" />
  
  <!-- Head -->
  <ellipse cx="100" cy="85" rx="45" ry="50" fill="#FCD5B4" stroke="#000" stroke-width="2" />
  
  <!-- Hair (Receding) -->
  <path d="M55,80 Q50,60 60,40 Q80,25 100,25 Q120,25 140,40 Q150,60 145,80" fill="none" stroke="#5D4037" stroke-width="3" />
  <path d="M95,25 Q100,20 105,25" fill="none" stroke="#5D4037" stroke-width="2" />

  <!-- Eyes (No Glasses) -->
  <circle cx="85" cy="80" r="4" fill="#000" />
  <circle cx="115" cy="80" r="4" fill="#000" />
  
  <!-- Mouth (Witty Smirk) -->
  <path d="M85,110 Q100,115 115,108" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" />

  <!-- Holding Book -->
  <rect x="120" y="150" width="40" height="50" fill="#FDB515" stroke="#000" stroke-width="2" transform="rotate(-10 140 175)" />
  <text x="130" y="180" font-size="20" font-family="serif" font-weight="bold" fill="#003262" transform="rotate(-10 140 175)">R</text>
</svg>
`;

export const SYLLABUS: Module[] = [
  {
    id: 1,
    title: "Samples & Surveys",
    topics: ["Population of Interest", "Sampling Frames", "Selection Bias", "Non-response Bias"],
    cases: [
      {
        title: "Poll-i-am-a (iOS vs Voters)",
        description: "A startup polls 10,000 iOS users to predict the Presidential Election.",
        dataPoints: ["Sample: 10,000 US iOS users", "Goal: Predict election winner", "Bias: Coverage bias (iOS users != electorate)"]
      },
      {
        title: "Honda EV Survey",
        description: "Honda surveys past owners about a new 'e:prototype' electric SUV.",
        dataPoints: ["Frame: Past Honda owners", "Response Rate: 14%", "72% said they would buy", "Voluntary response bias"]
      },
      {
        title: "Twitter Bot Detection",
        description: "Elon Musk samples 100 followers of @twitter to estimate fake accounts.",
        dataPoints: ["Sample: 100 followers of @twitter", "Method: Replies to math problem", "Bias: Sampling frame is not random users"]
      }
    ]
  },
  {
    id: 2,
    title: "Sampling Variation & Quality",
    topics: ["Standard Error", "Confidence Intervals", "Central Limit Theorem"],
    cases: [
      {
        title: "Hitachi Metals Pencils",
        description: "Manufacturing high-end pencils with core thickness 3mm.",
        dataPoints: ["Target: 3mm", "SD: 0.1mm", "Sample: 100 pencils", "Rule: Retool if mean < 2.95 or > 3.05"]
      },
      {
        title: "Haas F1 Lap Times",
        description: "Monitoring driver performance to detect anomalies.",
        dataPoints: ["Mean lap: 82.3s", "SD: 1.3s", "Sample: 3 laps", "Rule: Check if avg < 80.83s or > 83.77s"]
      }
    ]
  },
  {
    id: 3,
    title: "Statistical Tests",
    topics: ["Hypothesis Testing", "T-tests", "Type I/II Errors"],
    cases: [
      {
        title: "OpenAI Employee Satisfaction",
        description: "Testing if a new compensation plan improved morale.",
        dataPoints: ["Old Mean: 7.3", "Sample (n=36): 7.6", "Sample SD: 1.1", "One-sided test"]
      },
      {
        title: "ABAG Wastewater",
        description: "Testing COVID concentration in sewage.",
        dataPoints: ["Mean: 240", "SD: 60", "Control limits for 5% Type I error"]
      }
    ]
  },
  {
    id: 4,
    title: "Linear Patterns",
    topics: ["Correlation vs Causation", "Scatterplots", "Linearity"],
    cases: [
      {
        title: "Rent-the-Chicken",
        description: "Weekly spend vs. Yard size.",
        dataPoints: ["Avg Yard: 0.5 acres", "SD Yard: 0.1", "Avg Spend: $137", "SD Spend: $24", "R^2: 0.42"]
      },
      {
        title: "Spotify Songs",
        description: "Song duration vs. Popularity rating.",
        dataPoints: ["n=18,835", "Slope: -0.414", "P-value: 0.009", "Intercept: 54.5"]
      }
    ]
  },
  {
    id: 5,
    title: "Simple Regression",
    topics: ["OLS", "Slope Interpretation", "Residuals", "R-squared"],
    cases: [
      {
        title: "Wobb Influencer Marketing",
        description: "Ad spend vs Sales.",
        dataPoints: ["Avg Sales: 24M", "Avg Ad Spend: 28k", "Slope claim: 1k spend -> 1M sales", "Correlation: 0.63"]
      },
      {
        title: "Haagen-Dazs Sales",
        description: "Ice cream sales vs Temperature (Celsius).",
        dataPoints: ["Slope: 21.44", "Intercept: 44.83", "R^2: 0.9797", "n=500"]
      }
    ]
  },
  {
    id: 6,
    title: "Multiple Regression",
    topics: ["Partial Slopes", "Adjusted R-squared", "Multicollinearity"],
    cases: [
      {
        title: "Fortune 500 Wages",
        description: "Wage determined by Education, Experience, Age.",
        dataPoints: ["log(wage) model", "Educ coef: .072", "Exper coef: .014", "Age coef: .012", "n=935"]
      },
      {
        title: "Biden Campaign 2020",
        description: "Votes for Biden vs Votes Counted in Georgia.",
        dataPoints: ["Slope: 0.2235", "Intercept: 27.68", "R^2: 0.994", "High t-stat: 154.6"]
      }
    ]
  },
  {
    id: 7,
    title: "Building Models",
    topics: ["F-tests", "Model Selection", "Standard Error of Regression"],
    cases: [
      {
        title: "EBMUD Water Demand",
        description: "Water usage vs Price, Lot Size, Bathrooms.",
        dataPoints: ["Log-Log model", "Price Elast: -1.567", "Lot Size coef: .469", "Baths coef: .166"]
      },
      {
        title: "Used Car Prices",
        description: "ln(Price) vs Odometer.",
        dataPoints: ["Slope: -0.020", "Intercept: 13.25", "R^2: 0.0035", "Small R^2 but significant slope"]
      }
    ]
  },
  {
    id: 8,
    title: "Predictive Analytics",
    topics: ["Prediction Intervals", "Confidence Intervals for Mean"],
    cases: [
      {
        title: "Used Car Prices (Prediction)",
        description: "Predicting price for a specific car with 50k miles.",
        dataPoints: ["Prediction Interval is wider than Confidence Interval", "Root MSE = 1.17"]
      }
    ]
  },
  {
    id: 9,
    title: "Categorical Variables",
    topics: ["Dummy Variables", "Interaction Terms", "Reference Categories"],
    cases: [
      {
        title: "Wage Gap Analysis",
        description: "Gender/Race impact on wages.",
        dataPoints: ["Lurking variables", "Correlation between race and education", "Dummy variable trap"]
      }
    ]
  }
];
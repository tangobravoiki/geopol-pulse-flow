// Simple location extraction without external NLP libraries
const KNOWN_LOCATIONS: { [key: string]: [number, number] } = {
  "United States": [37.09, -95.71],
  "USA": [37.09, -95.71],
  "America": [37.09, -95.71],
  "China": [35.86, 104.19],
  "Russia": [61.52, 105.32],
  "Ukraine": [48.38, 31.99],
  "Israel": [31.05, 34.83],
  "Palestine": [31.95, 35.23],
  "Gaza": [31.50, 34.47],
  "Iran": [32.43, 53.69],
  "Turkey": [38.96, 35.24],
  "Syria": [34.80, 38.99],
  "Iraq": [33.22, 43.68],
  "Afghanistan": [33.94, 67.71],
  "India": [20.59, 78.96],
  "Pakistan": [30.38, 69.35],
  "Japan": [36.20, 138.25],
  "South Korea": [35.91, 127.77],
  "North Korea": [40.34, 127.51],
  "Taiwan": [23.70, 120.96],
  "Europe": [54.53, 15.25],
  "Germany": [51.17, 10.45],
  "France": [46.23, 2.21],
  "UK": [55.38, -3.44],
  "Britain": [55.38, -3.44],
  "Poland": [51.92, 19.15],
  "NATO": [50.85, 4.35],
  "Middle East": [29.30, 47.48],
  "Africa": [8.78, 34.51],
  "South America": [-8.78, -55.49],
  "Australia": [-25.27, 133.78],
  "Mexico": [23.63, -102.55],
  "Brazil": [-14.24, -51.93],
  "Saudi Arabia": [23.89, 45.08],
  "Egypt": [26.82, 30.80],
  "Yemen": [15.55, 48.52],
  "Libya": [26.34, 17.23],
  "Sudan": [12.86, 30.22],
  "Ethiopia": [9.15, 40.49],
  "South Africa": [-30.56, 22.94],
  "Nigeria": [9.08, 8.68],
  "Kenya": [-0.02, 37.91],
  "Venezuela": [6.42, -66.59],
  "Colombia": [4.57, -74.30],
  "Argentina": [-38.42, -63.62],
  "Chile": [-35.68, -71.54],
};

export const extractLocations = (text: string): string[] => {
  if (!text) return [];

  const locations: string[] = [];
  const textUpper = text.toUpperCase();

  Object.keys(KNOWN_LOCATIONS).forEach((location) => {
    if (textUpper.includes(location.toUpperCase())) {
      if (!locations.includes(location)) {
        locations.push(location);
      }
    }
  });

  return locations.slice(0, 5);
};

export const getCoordinates = (location: string): [number, number] | null => {
  return KNOWN_LOCATIONS[location] || null;
};

export const getAllLocations = () => KNOWN_LOCATIONS;

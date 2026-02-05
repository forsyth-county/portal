// School locations for Forsyth County, GA
export const schoolLocations = [
  { name: "South Forsyth", lat: 34.118, lng: -84.156 },
  { name: "Denmark",       lat: 34.078, lng: -84.200 },
  { name: "Lambert",       lat: 34.084, lng: -84.142 },
  { name: "North Forsyth", lat: 34.250, lng: -84.120 },
  { name: "West Forsyth",  lat: 34.140, lng: -84.250 },
  { name: "Forsyth Central", lat: 34.180, lng: -84.090 },
  { name: "East Forsyth",  lat: 34.300, lng: -84.000 },
  { name: "Alliance",      lat: 34.150, lng: -84.180 },
];

// Haversine formula to calculate distance in km
export function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // distance in km
}

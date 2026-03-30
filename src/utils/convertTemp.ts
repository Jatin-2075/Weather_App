export const convertCelsiusToFahrenheit = (celsius: number): number => {
  return (celsius * 9) / 5 + 32;
};

export const formatTemperature = (
  celsius: number,
  isFahrenheit: boolean
): number => {
  return isFahrenheit ? convertCelsiusToFahrenheit(celsius) : celsius;
};

export const getTemperatureUnit = (isFahrenheit: boolean): string => {
  return isFahrenheit ? '°F' : '°C';
};

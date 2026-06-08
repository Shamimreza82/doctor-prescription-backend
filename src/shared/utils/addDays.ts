export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date); // clone original date
  result.setDate(result.getDate() + days);
  return result;
};

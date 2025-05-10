// server/src/utils/helpers.ts

/**
 * Formats a date to a readable string
 * @param date Date to format
 * @returns Formatted date string
 */
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Calculates the percentage of a value from a total
 * @param value The value to calculate percentage for
 * @param total The total value
 * @returns Calculated percentage
 */
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

/**
 * Formats a currency value
 * @param amount The amount to format
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Gets the current month and year
 * @returns Current month and year string
 */
export const getCurrentMonthYear = (): string => {
  const date = new Date();
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
};

/**
 * Gets the previous X months from the current date
 * @param monthsCount Number of previous months to get
 * @returns Array of month strings
 */
export const getPreviousMonths = (monthsCount: number): string[] => {
  const months = [];
  const date = new Date();

  for (let i = 0; i < monthsCount; i++) {
    date.setMonth(date.getMonth() - 1);
    months.push(
      date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    );
  }

  return months.reverse();
};

/**
 * Generates a random color
 * @returns Random hex color
 */
export const getRandomColor = (): string => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

/**
 * Safely parses a JSON string
 * @param jsonString JSON string to parse
 * @returns Parsed object or null if invalid
 */
export const safeJSONParse = (jsonString: string): any => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return null;
  }
};

/**
 * Truncates a string to a specified length
 * @param str String to truncate
 * @param length Maximum length
 * @returns Truncated string
 */
export const truncateString = (str: string, length: number): string => {
  if (str.length <= length) return str;
  return str.substring(0, length) + "...";
};

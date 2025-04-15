export const capitalize = (word: string) =>
  word.charAt(0).toUpperCase() + word.toLowerCase().slice(1);

export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export const formatDate = (date: Date | null) => {
  if (!date) return "Pendiente";
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

export function parseDates<T>(data: T): T {
  if (data === null || typeof data !== "object") {
    if (typeof data === "string" && isDateString(data)) {
      return new Date(data) as unknown as T;
    }
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => parseDates(item)) as unknown as T;
  }

  const parsedObject: Record<string, unknown> = {};
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      parsedObject[key] = parseDates((data as Record<string, unknown>)[key]);
    }
  }
  return parsedObject as T;
}

function isDateString(str: string) {
  const isoRegex =
    /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?)?$/;
  if (!isoRegex.test(str)) return false;
  const date = new Date(str);
  return !isNaN(date.getTime());
}

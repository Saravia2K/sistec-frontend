export const COLORS = {
  GREEN: "#078349",
  BLUE: "#122C53",
};

export const API_URL = {
  development: "http://localhost:8000",
  production: "",
  test: "http://localhost:8000",
}[process.env.NODE_ENV];

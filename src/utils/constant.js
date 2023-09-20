const isProduction = process.env.NODE_ENV === "production";
const domain = isProduction
  ? "https://leadershipwebapp.azurewebsites.net"
  : "http://localhost:8081";
export { isProduction, domain };

const isProduction = process.env.NODE_ENV === "production";
const domain = isProduction
  ? "https://leadershipwebapp.azurewebsites.net"
  : "http://localhost:8081";
const audioDomain = isProduction
  ? "https://leadershipwebapp.azurewebsites.net"
  : "http://localhost:8084";
export { isProduction, domain, audioDomain };

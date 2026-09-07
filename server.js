const http = require("http");
const fs = require("fs");
const path = require("path");

const port = 3000;
const rootDirectory = __dirname;
const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8"
};

function loadEnvFile() {
  const envPath = path.join(rootDirectory, ".env");
  if (!fs.existsSync(envPath)) {
    return;
  }

  fs.readFileSync(envPath, "utf8")
    .split(/\r?\n/)
    .filter((line) => line && !line.trim().startsWith("#"))
    .forEach((line) => {
      const separatorIndex = line.indexOf("=");
      if (separatorIndex === -1) return;
      const key = line.slice(0, separatorIndex).trim();
      const value = line.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, "");
      if (key) process.env[key] = value;
    });
}

async function getTokyoWeather() {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENWEATHER_API_KEY が .env に設定されていません");
  }

  const params = new URLSearchParams({
    lat: "35.6762",
    lon: "139.6503",
    appid: apiKey,
    units: "metric",
    lang: "ja"
  });
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?${params}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "OpenWeatherMap APIから天気を取得できませんでした");
  }

  return {
    description: data.weather[0].description,
    icon: getWeatherEmoji(data.weather[0].icon),
    temperature: data.main.temp,
    maxTemperature: data.main.temp_max,
    minTemperature: data.main.temp_min,
    humidity: data.main.humidity
  };
}

function getWeatherEmoji(iconCode) {
  if (iconCode.startsWith("01")) return "☀️";
  if (iconCode.startsWith("02")) return "🌤️";
  if (iconCode.startsWith("03") || iconCode.startsWith("04")) return "☁️";
  if (iconCode.startsWith("09") || iconCode.startsWith("10")) return "🌧️";
  if (iconCode.startsWith("11")) return "⛈️";
  if (iconCode.startsWith("13")) return "❄️";
  return "🌫️";
}

function serveStaticFile(request, response) {
  const requestedPath = request.url === "/" ? "/index.html" : request.url;
  const filePath = path.resolve(rootDirectory, `.${requestedPath}`);
  if (!filePath.startsWith(rootDirectory)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(404);
      response.end("Not Found");
      return;
    }
    response.writeHead(200, { "Content-Type": mimeTypes[path.extname(filePath)] || "text/plain; charset=utf-8" });
    response.end(content);
  });
}

loadEnvFile();
http.createServer(async (request, response) => {
  if (request.url === "/api/weather") {
    try {
      const weather = await getTokyoWeather();
      response.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      response.end(JSON.stringify(weather));
    } catch (error) {
      response.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
      response.end(JSON.stringify({ error: error.message }));
    }
    return;
  }

  serveStaticFile(request, response);
}).listen(port, () => {
  console.log(`http://localhost:${port} で起動しました`);
});
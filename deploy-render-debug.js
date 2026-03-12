const fs = require('fs');
const key = "rnd_oFPOGPc7RiHObdpuq5mIVPVP6jw5";

const payload = {
  type: "web_service",
  name: "videochat-api",
  ownerId: "tea-d4u076n17kns73cuiv20",
  repo: "https://github.com/Parteek04/videochat-platform",
  branch: "main",
  autoDeploy: "yes",
  rootDir: "backend",
  serviceDetails: {
    env: "node",
    plan: "free",
    envSpecificDetails: {
      buildCommand: "npm install && npm run build",
      startCommand: "npm run start"
    }
  }
};

fetch("https://api.render.com/v1/services", {
  method: "POST",
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Authorization": `Bearer ${key}`
  },
  body: JSON.stringify(payload)
})
.then(r => r.json())
.then(data => {
  fs.writeFileSync('render-response.json', JSON.stringify(data, null, 2));
  console.log('Saved to render-response.json');
})
.catch(e => console.error(e));

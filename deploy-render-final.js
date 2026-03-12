const key = "rnd_oFPOGPc7RiHObdpuq5mIVPVP6jw5";

const payload = {
  type: "web_service",
  name: "videochat-api",
  ownerId: "tea-d4u076n17kns73ccuiv20",
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
  console.log("FINAL_URL=" + data.service.serviceDetails.url);
  console.log("COMPLETE_DATA=" + JSON.stringify(data, null, 2));
})
.catch(e => console.error(e));

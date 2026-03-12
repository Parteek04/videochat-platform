const key = "rnd_oFPOGPc7RiHObdpuq5mIVPVP6jw5";

const payload = {
  type: "web_service",
  name: "videochat-api-prod",
  ownerId: "usr_cv0rr2VICzJJ983Nm4xN2tiv20",
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
  console.log("Success! Render Service Details:");
  console.log(JSON.stringify(data, null, 2));
})
.catch(e => console.error(e));

const key = "rnd_oFPOGPc7RiHObdpuq5mIVPVP6jw5";
const serviceId = "srv-d6piftmuk2gs73fh8ip0";

const payload = {
  serviceDetails: {
    envSpecificDetails: {
      buildCommand: "npm install --include=dev && npm run build",
      startCommand: "npm run start"
    }
  }
};

fetch(`https://api.render.com/v1/services/${serviceId}`, {
  method: "PATCH",
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Authorization": `Bearer ${key}`
  },
  body: JSON.stringify(payload)
})
.then(r => r.json())
.then(d => {
  console.log("Service Updated. Triggering deploy...");
  return fetch(`https://api.render.com/v1/services/${serviceId}/deploys`, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${key}`
    },
    body: JSON.stringify({ "clearCache": "clear" })
  });
})
.then(r => r.json())
.then(d => console.log("Deploy Triggered:", JSON.stringify(d, null, 2)))
.catch(e => console.error(e));

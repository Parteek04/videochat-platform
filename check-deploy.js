const key = "rnd_oFPOGPc7RiHObdpuq5mIVPVP6jw5";
const serviceId = "srv-d6piftmuk2gs73fh8ip0";

fetch(`https://api.render.com/v1/services/${serviceId}/deploys?limit=1`, {
  method: "GET",
  headers: {
    "Accept": "application/json",
    "Authorization": `Bearer ${key}`
  }
})
.then(r => r.json())
.then(d => {
  const status = d[0].deploy.status;
  console.log("Current Status:", status);
})
.catch(e => console.error(e));

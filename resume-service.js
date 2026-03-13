const key = "rnd_oFPOGPc7RiHObdpuq5mIVPVP6jw5";
const serviceId = "srv-d6piftmuk2gs73fh8ip0";

fetch(`https://api.render.com/v1/services/${serviceId}/resume`, {
  method: "POST",
  headers: {
    "Accept": "application/json",
    "Authorization": `Bearer ${key}`
  }
})
.then(r => r.json())
.then(d => {
  console.log(JSON.stringify(d, null, 2));
})
.catch(e => console.error(e));

const key = "rnd_oFPOGPc7RiHObdpuq5mIVPVP6jw5";

fetch(`https://api.render.com/v1/services`, {
  method: "GET",
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

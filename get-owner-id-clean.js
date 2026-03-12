const key = "rnd_oFPOGPc7RiHObdpuq5mIVPVP6jw5";

fetch("https://api.render.com/v1/owners", {
  method: "GET",
  headers: {
    "Accept": "application/json",
    "Authorization": `Bearer ${key}`
  }
})
.then(r => r.json())
.then(data => {
  const oId = data[0].owner.id;
  console.log("EXACT_OWNER_ID=" + oId);
})
.catch(e => console.error(e));

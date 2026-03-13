const key = "rnd_oFPOGPc7RiHObdpuq5mIVPVP6jw5";
const serviceId = "srv-d6piftmuk2gs73fh8ip0";

const envVars = [
  { envVar: { key: "NODE_ENV", value: "production" } },
  { envVar: { key: "MONGODB_URI", value: "mongodb+srv://parteekpersonal_db_user:YX4mEMuUG0Iv6Lo7@cluster0.fhqanqb.mongodb.net/videochat?retryWrites=true&w=majority" } },
  { envVar: { key: "FIREBASE_PROJECT_ID", value: "chat-6d122" } },
  { envVar: { key: "FIREBASE_PRIVATE_KEY", value: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDZDXAtf87dRxp4\nDGXIF+91qf0AkvkgfwlFf5IFDwX4qQtIgXAoBzrGD0kBO1rp/zd0h1B2CY71yMpR\nQ2klgpIOEPPoZZaA532csZa+T9ZG8OXQzi0vuPpNHy5F4+YXxlLo/AdHjgedDwHi\nzzQVgdAF+K2VFHBXjpA4tand1OMn6NKN3/SLsSO62o+a2I/R/5l/xkBV9YOVUQ6g\ng5CaLIbBBHQTEaplA6LXWJdpry4OGzQTltEhejb6kS99UIc3CLr/yJlviYxrovA9\nSCbPcUh6TaJ+PEYh/7d2khQvvSKCTwjQm7GKJVRi+CL4WK0BIuxFTxmzJOPvPyze\nBwGNNFZDAgMBAAECggEAX74GQAOzD7d4DQFG+krYlVn84H50RunSgKYDlpioZSXH\n9N0nyHhb7Ba8+L6iXTp3Tz8K9m5D8dX2rH7kSCf+3haLSHVbPJQgO/i4Ck20Msm7\nTe5MT1M0kcVRx4F+MvmIA/58BYu4fwaqKc6FZoFC7gdiJjMEVRLtOh6kBdaMtsKz\n9FkC2jpw/qbmquTA5gxsbfBGHDZ3bedjx276LPVmnQeFPRCmys7H1QYZqz8PwSo4\nxamdDprkoaCgvrlWlQZ2AvwGanzgDQ6thuNftmNI2p5KWvEqrMLoPjeNoEfyzxuP\n85VwIZbkDGcctlpX1SxM3gwivL7a+Rr8yqBfX+kqQQKBgQDv2EKe8ZX4sJ40zh5z\nipHpaB0brtiERcJN9CU9EONqWEHeDFm2WeFiD4455R/uWJLTCoA+tZtn+nUve7Uj\nnLjgKiQ5RvXuQcUU/FZiTnIcWQrhQzt2CMY9x5xN6GK6YUzmVg89RBHr+s8aEfmk\nGPzjuqsNfucK90qSAbfTltAJgwKBgQDnrClfuMLoVJnZN/a0zKy7BXg70aeQGq2u\n8RJhXoIfSbK6VCb7EPgNAP9vTRK+nHnqAmc8KYQt1YZ4nY1VJ/yYRuG+zCK5CUa5\nDZVOX47uTS7SPWlkJVey/syCWFL4xAkJe5FpUJUrzAt3E4QmrdDnosJBet9ZKDfs\n8QMWom6kQQKBgFh67nDWbN4WwfZ3B7LWLuftWbeptARv+7NoWwiBH3RO5NW2tq3X\n0JataGmhRjtWf6vNVuxLcO5V7j87IuLlYSqJQV3D+NwRdVQ9ltyjVeNxUdsyQ1BT\nAlcuOVJgZXOei5D5tJuEbhwhJZ/Xe8H22exlI89RvohEHEVqztcG7u5jAoGALOwx\nSaJmCO7+tiQn7n8Rr2IsIk1RFJxXuWh9i+vrh22e/op61IxBzSO4ZDipvdRRv5Kf\nugbC3rBc1t6WHUEXtd9ovrqOsRqfYBrGLOBSstq8jX/jA8xJ6SeHOG8wB5Tbu77+\nP1Gk201Bm+Fo6qchrwjcah4NWRh3X7aMRsNQeQECgYBQfQ7xVzXDht0wMZo0aBOb\nMjI2NEXAV7GlaxD/KCzIBAqSrbBxB5H/FLvIxXmaF4ZYfwtHQyj8VHJ1ld5r6J3l\n3AX7OBq9qZcSBTw1T+FgPlBOH4nPJ9FPgkvcEvKTvXSTHKMp33rlIoR7oDbEncVl\nBwk0Nf1s1m45+HKZs0ZoNA==\n-----END PRIVATE KEY-----\n" } },
  { envVar: { key: "FIREBASE_CLIENT_EMAIL", value: "firebase-adminsdk-fbsvc@chat-6d122.iam.gserviceaccount.com" } },
  { envVar: { key: "FRONTEND_URL", value: "https://videochat-platform.vercel.app" } },
  { envVar: { key: "JWT_SECRET", value: "your-super-secret-jwt-key-change-in-production" } }
];

fetch(`https://api.render.com/v1/services/${serviceId}/env-vars`, {
  method: "PUT",
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Authorization": `Bearer ${key}`
  },
  body: JSON.stringify(envVars)
})
.then(r => r.json())
.then(d => {
  console.log("Updated Env Vars Successfully!");
})
.catch(e => console.log(e));

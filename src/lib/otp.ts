import redis from "@/lib/redis";

const OTP_EXPIRY_SECONDS = 600;// 10 minutes

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
}

export async function createOtp(email:string){
  const otp = generateOtp();

  const key = `otp:${email.toLowerCase()}`;

  await redis.set(key, otp, "EX", OTP_EXPIRY_SECONDS);

  return otp;
}

export async function getOtp(email:string){
  const key = `otp:${email.toLowerCase()}`;

  return await redis.get(key);
}

export async function deleteOtp(email:string){
  const key = `otp:${email.toLowerCase()}`;
  await redis.del(key);
}
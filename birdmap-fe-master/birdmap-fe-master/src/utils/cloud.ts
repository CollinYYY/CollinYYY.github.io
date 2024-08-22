export const cloudInit = async () => {
  const c1 = new wx.cloud.Cloud({
    resourceEnv: "prod-4gxykas5f6c2f40a",
  });
  await c1.init();
  
  return c1
}
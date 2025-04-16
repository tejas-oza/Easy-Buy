import cron from "node-cron";
import { Coupon } from "../models/coupon.models.js";

const expireCouponsCron = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      console.log("cron job start");

      const currentDate = new Date();
      const results = await Coupon.updateMany(
        {
          expirationDate: { $lt: currentDate },
          isActive: true,
        },
        {
          $set: { isActive: false },
        }
      );

      if (results.modifiedCount > 0) {
        console.log(
          `[Coupon Expire Cron] Deactivated ${results.modifiedCount} expired coupons.`
        );
      }
      console.log("cron job end");
    } catch (error) {
      console.log("cron job error: ", error);
    }
  });
};

export { expireCouponsCron };

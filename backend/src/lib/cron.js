import cron from "cron";
import https from "https";

const job = new cron.CronJob("*/14 * * * *", () => {
    const url = process.env.API_URL;
  
    if (!url) {
      console.error("API_URL is not defined in environment variables.");
      return;
    }
  
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        console.log("GET request sent successfully");
      } else {
        console.log("GET request failed with status code:", res.statusCode);
      }
    }).on("error", (err) => {
      console.error("Error while sending request:", err.message);
    });
  });
  

export default job;
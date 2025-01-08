import moment from "moment";
import "moment-timezone";

export default defineNuxtPlugin(() => {
  return {
    provide: {
      moment,
    },
  };
});

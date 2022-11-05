import type { App } from "vue";
import { Form as VeeForm, Field as VeeField } from "vee-validate";

export default {
  install(app: App) {
    app.component("VeeForm", VeeForm);
    app.component("VeeField", VeeField);
  },
};

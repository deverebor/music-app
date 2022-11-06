import {
  alpha_spaces as alphaSpaces,
  between,
  email,
  max,
  max_value as maxValue,
  min,
  min_value as minValue,
  required,
  confirmed,
} from "@vee-validate/rules";
import {
  defineRule,
  ErrorMessage as VeeErroMessage,
  Field as VeeField,
  Form as VeeForm,
} from "vee-validate";

import type { App } from "vue";
export default {
  install(app: App) {
    app.component("VeeForm", VeeForm);
    app.component("VeeField", VeeField);
    app.component("VeeErroMessage", VeeErroMessage);

    defineRule("alphaSpaces", alphaSpaces);
    defineRule("between", between);
    defineRule("confirmed", confirmed);
    defineRule("email", email);
    defineRule("max", max);
    defineRule("maxValue", maxValue);
    defineRule("min", min);
    defineRule("minValue", minValue);
    defineRule("required", required);
  },
};

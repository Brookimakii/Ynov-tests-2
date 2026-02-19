import * as validators from "./validators";

export function isFormValidData(formData) {
  validators.validateIdentity(formData.firstName);
  validators.validateIdentity(formData.lastName);
  validators.validateEmail(formData.email);
  validators.validateAge(new Date(formData.birthDate));
  validators.validatePostalCode(formData.postalCode);
  validators.validateIdentity(formData.city);

  return true;
}

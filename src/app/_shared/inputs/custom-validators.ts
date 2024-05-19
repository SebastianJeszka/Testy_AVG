const EMAIL_REGEX =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PHONE_NUMBER_REGEX_COMMON = /^[\d\.\-\+\(\) ]{9,}$/;
const PHONE_NUMBER_REGEX = /^\+?\d{9,15}$/;
const NUMBER_REGEX = /^\d+(\.\d+)?$/;
const TEXT_REGEX = /^[^(0-9)"!#$%&()*+,./:;<=>?@[\]^_`{|}~]+$/;
const TOTAL_NUMBER_REGEX = /^\d+$/;
const POSTAL_CODE_REGEX = /^\d{2}-\d{3}$/;

export class CustomValidators {
  static isValidPesel(pesel: string): boolean {
    if (pesel.length !== 11) {
      return false;
    }
    const weight = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
    let sum = 0;
    const controlNumber = parseInt(pesel.substring(10, 11));
    for (let i = 0; i < weight.length; i++) {
      sum += parseInt(pesel.substring(i, i + 1)) * weight[i];
    }
    sum = sum % 10;
    return 10 - sum === controlNumber;
  }

  static isValidNip(nip: string): boolean {
    if (nip.length !== 10) {
      return false;
    }
    nip = nip.replace(/[\ \-]/gi, '');

    const weight = [6, 5, 7, 2, 3, 4, 5, 6, 7];
    let sum = 0;
    const controlNumber = parseInt(nip.substring(9, 10));
    for (let i = 0; i < weight.length; i++) {
      sum += parseInt(nip.substr(i, 1)) * weight[i];
    }

    return sum % 11 === controlNumber;
  }

  static isValidEmail(email): boolean {
    return EMAIL_REGEX.test(email);
  }

  static isValidPostalCode(postalCode): boolean {
    return POSTAL_CODE_REGEX.test(postalCode);
  }

  static transformPhone(phone): string {
    return phone ? phone.replace(/[^+/0-9]/gi, '') : null;
  }

  static isValidPhoneNumber(phone: string): boolean {
    if (!PHONE_NUMBER_REGEX_COMMON.test(phone)) {
      return false;
    }
    const parsedPhone = this.transformPhone(phone);
    return PHONE_NUMBER_REGEX.test(parsedPhone);
  }

  static isText(value): boolean {
    return TEXT_REGEX.test(value);
  }

  static isNumber(value): boolean {
    return NUMBER_REGEX.test(value);
  }

  static isTotalNumber(value): boolean {
    return TOTAL_NUMBER_REGEX.test(value);
  }

  static isNumberWithDecimalsLimit(value, maxDecimals): boolean {
    return new RegExp(`^\\d+(\\.\\d{1,${maxDecimals}})?$`).test(value);
  }

  static isLowerOrEqual(value: number, max: number): boolean {
    return value <= max;
  }

  static isGraterOrEqual(value: number, min: number): boolean {
    return value >= min;
  }

  static dateMax(inputDate: Date | string, maxDate: Date | string) {
    return new Date(inputDate).getTime() <= new Date(maxDate).getTime();
  }

  static dateMin(inputDate: Date | string, minDate: Date | string) {
    return new Date(inputDate).getTime() >= new Date(minDate).getTime();
  }
}

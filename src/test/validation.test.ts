import { describe, expect, it } from "vitest";
import { isEmail, isUkPhone } from "@/lib/validation";
import { business } from "@/data/business";

describe("quote form rules", () => {
  it("accepts UK mobiles in 07 and +447 form", () => {
    expect(isUkPhone("07957 321647")).toBe(true);
    expect(isUkPhone("+44 7957 321647")).toBe(true);
  });
  it("accepts UK landlines starting 01/02/03", () => {
    expect(isUkPhone("(01992) 123456")).toBe(true);
    expect(isUkPhone("020 7946 0958")).toBe(true);
  });
  it("rejects non-UK or short numbers", () => {
    expect(isUkPhone("0795732164")).toBe(false);
    expect(isUkPhone("+15551234567")).toBe(false);
  });
  it("checks email addresses", () => {
    expect(isEmail("someone@example.co.uk")).toBe(true);
    expect(isEmail("not-an-email")).toBe(false);
  });
  it("business phone number is a valid UK number", () => {
    expect(isUkPhone(business.phoneDisplay)).toBe(true);
    expect(business.whatsapp).toContain(business.phoneTel.replace("+", ""));
  });
});

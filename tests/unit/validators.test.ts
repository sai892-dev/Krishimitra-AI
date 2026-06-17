import { loginSchema, registerSchema } from "@/lib/validators/auth";
import { listingSchema, inquirySchema } from "@/lib/validators/marketplace";

describe("auth validators", () => {
  it("accepts valid login", () => {
    const result = loginSchema.safeParse({
      email: "farmer@demo.ap",
      password: "demo1234",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = loginSchema.safeParse({
      email: "not-email",
      password: "demo1234",
    });
    expect(result.success).toBe(false);
  });

  it("rejects short password", () => {
    const result = loginSchema.safeParse({
      email: "farmer@demo.ap",
      password: "123",
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid farmer registration", () => {
    const result = registerSchema.safeParse({
      email: "new@farmer.ap",
      password: "demo1234",
      full_name: "Test Farmer",
      role: "farmer",
      district: "Krishna",
      preferred_language: "te",
      land_size_acres: 2.5,
    });
    expect(result.success).toBe(true);
  });
});

describe("marketplace validators", () => {
  it("accepts valid listing", () => {
    const result = listingSchema.safeParse({
      crop_name: "Sona Masuri Paddy",
      quantity_kg: 5000,
      expected_price_per_kg: 28,
      district: "Krishna",
    });
    expect(result.success).toBe(true);
  });

  it("rejects negative quantity", () => {
    const result = listingSchema.safeParse({
      crop_name: "Paddy",
      quantity_kg: -100,
      expected_price_per_kg: 28,
      district: "Guntur",
    });
    expect(result.success).toBe(false);
  });

  it("requires inquiry message min length", () => {
    const result = inquirySchema.safeParse({
      listing_id: "list-001",
      message: "Hi",
    });
    expect(result.success).toBe(false);
  });
});

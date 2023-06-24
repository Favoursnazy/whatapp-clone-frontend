import * as Yup from "yup";

export const signUpSchema = Yup.object({
  name: Yup.string()
    .required("Full name is required")
    .matches(/^[a-zA-Z_ ]*$/, "No special characters allowed")
    .min(2, "Name to short.")
    .max(16, "Name to long."),
  email: Yup.string()
    .required("Email address is required")
    .email("Invalid email address"),
  status: Yup.string().max(64, "Status must be 64 characters."),
  password: Yup.string()
    .required("Password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      "Password must contain atleast uppercase, lowercase, number and a special characters."
    ),
});

export const SigInSchema = Yup.object({
  email: Yup.string()
    .required("Email address is required")
    .email("Invalid email address"),
  password: Yup.string().required("Password is required"),
});

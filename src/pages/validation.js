
import * as Yup from "yup";

export const loginFormvalidation=Yup.object().shape({
email:Yup.string().email("Invalid Email").required("Email is required"),
password:Yup.string().required("Password is required").min(6,"Password must be at least 8 characters"),
})
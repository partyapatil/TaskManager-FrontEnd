import React, { useEffect } from "react";
import { Formik } from "formik";
import { loginFormvalidation } from "./validation.js";
// import Button from "../components/Button.js";
import { useDispatch, useSelector } from "react-redux";
import {
  setCredentials,
  setCredentialsWithUser,
} from "../redux/slices/authSlice";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@headlessui/react";
import { useLoginMutation } from "../redux/slices/authApiSlice.js";
import { toast } from "react-toastify";
// import Loading from "../components/Loading"

const Login = () => {
  const user = useSelector((state) => state.auth.user);

  const [login, { isLoading }] = useLoginMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user]);

  const submitHandler = async (data: any) => {
    console.log(data);
    try {
      const result = await login(data).unwrap();
      console.log(result);

      dispatch(setCredentials(result));
      dispatch(setCredentialsWithUser(result));
      navigate("/");
    } catch (err) {
      console.log(err)
      toast.error(err?.data?.message || "login failed");
    }
  };

  if (!user)
    return (
      <div className="w-full min-h-screen flex items-center justify-center flex-col lg:flex-row bg-[#f3f4f6]">
        <div className="w-full md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center">
          <div className="h-full w-full lg:w-2/3 flex flex-col items-center justify-center">
            <div className="w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10 2xl:-mt-20">
              <span className="flex gap-1 py-1 px-3 border rounded-full text-sm md:text-base bordergray-300 text-gray-600">
                Manage all your task in one place!
              </span>
              <p className="flex flex-col gap-0 md:gap-4 text-4xl md:text-6xl 2xl:text-7xl font-black text-center text-blue-700">
                <span>Infraplan Task Manager</span>
                {/* <span>Cloud-Based</span> */}
              </p>

              <div className="cell">
                <div className="circle rotate-in-up-left"></div>
              </div>
            </div>
          </div>

          {/* right side */}
          <div className="w-full md:w-1/3 p-4 md:p-1 flex flex-col justify-center items-center">
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={loginFormvalidation}
              onSubmit={submitHandler}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
              }) => (
                <form
                  onSubmit={handleSubmit}
                  className="form-container w-full md:w-[400px] flex flex-col gap-y-8 bg-white px-10 pt-14 pb-14"
                >
                  <div className="">
                    <p className="text-blue-600 text-3xl font-bold text-center">
                      Welcome back!
                    </p>
                    <p className="text-center text-base text-gray-700 ">
                      Keep all your credential safge.
                    </p>
                  </div>
                  <div className="flex flex-col gap-y-5">
                    <input
                      type="text"
                      name="email"
                      placeholder="Email"
                      className={`w-full p-2 border rounded-md ${
                        errors.email && touched.email
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                    />
                    {errors.email && touched.email ? (
                      <div className="text-red-500">{errors.email}</div>
                    ) : null}
                    <input
                      type="password"
                      name="password"
                      placeholder="Enter password"
                      className="w-full border rounded-md p-2"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                    />
                    {errors.password && touched.password ? (
                      <div className="text-red-500">{errors.password}</div>
                    ) : null}
                    {isLoading ? (
                      <></>
                    ) : (
                      <Button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Login
                      </Button>
                    )}
                  </div>
                </form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    );
};

export default Login;

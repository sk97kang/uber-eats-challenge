import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { authToken, isLoggedInVar } from "../apollo";
import { FormError } from "../components/form-error";
import { LOCALSTORAGE_TOKEN } from "../constants";
import {
  loginMutation,
  loginMutationVariables,
} from "../__generated__/loginMutation";

const LOGIN_MUTATION = gql`
  mutation loginMutation($input: LoginInput!) {
    login(input: $input) {
      ok
      error
      token
    }
  }
`;

interface ILoginForm {
  email: string;
  password: string;
}

export const Login = () => {
  const {
    register,
    getValues,
    handleSubmit,
    errors,
    formState,
  } = useForm<ILoginForm>({ mode: "onChange" });
  const onCompleted = (data: loginMutation) => {
    const {
      login: { ok, token },
    } = data;
    if (ok && token) {
      localStorage.setItem(LOCALSTORAGE_TOKEN, token);
      authToken(token);
      isLoggedInVar(true);
    }
  };
  const [loginMutation, { loading, data: loginMutationResult }] = useMutation<
    loginMutation,
    loginMutationVariables
  >(LOGIN_MUTATION, {
    onCompleted,
  });
  const onSubmit = () => {
    if (!loading) {
      const { email, password } = getValues();
      loginMutation({
        variables: {
          input: {
            email,
            password,
          },
        },
      });
    }
  };
  return (
    <div className="h-screen flex justify-center items-center flex-col w-full px-5 sm:px-0">
      <div className="w-full max-w-screen-sm mx-auto">
        <form
          className="grid gap-3 mt-5 mb-5 w-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="text-3xl font-semibold mb-3 text-blue-700">Login</div>
          <input
            ref={register({
              required: "Email is required",
              pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            })}
            className="focus:outline-none focus:border-blue-500 p-3 border-2 text-lg font-light border-blue-200 rounded transition-colors"
            name="email"
            type="email"
            placeholder="Email"
            required
          />
          {errors.email?.message && (
            <FormError message={errors.email.message} />
          )}
          {errors.email?.type === "pattern" && (
            <FormError message="Please enter a valid email" />
          )}
          <input
            ref={register({ required: "Password is required" })}
            className="focus:outline-none focus:border-blue-500 p-3 border-2 text-lg font-light border-blue-200 rounded transition-colors"
            name="password"
            type="password"
            placeholder="Password"
            required
          />
          {errors.password?.message && (
            <FormError message={errors.password.message} />
          )}
          <button
            disabled={!formState.isValid}
            className={` text-white p-3 rounded focus:outline-none  transition-colors ${
              formState.isValid
                ? "hover:bg-blue-600 bg-blue-500"
                : "bg-blue-100"
            }`}
          >
            {loading ? "Loading..." : "Login"}
          </button>
          {loginMutationResult?.login.error && (
            <FormError message={loginMutationResult?.login.error} />
          )}
        </form>
      </div>
    </div>
  );
};

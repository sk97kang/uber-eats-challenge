import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { authTokenVar, isLoggedInVar } from "../apollo";
import { FormError } from "../components/form-error";
import { Button } from "../components/button";
import { login, loginVariables } from "../__generated__/login";
import { LS_TOKEN } from "../constants";
import { TextLink } from "../components/text-link";
import { Layout } from "../components/layout";

const LOGIN_MUTATION = gql`
  mutation login($input: LoginInput!) {
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
    handleSubmit,
    getValues,
    errors,
    formState,
  } = useForm<ILoginForm>({ mode: "onChange" });
  const onCompleted = (data: login) => {
    const {
      login: { ok, token },
    } = data;
    if (ok && token) {
      localStorage.setItem(LS_TOKEN, token);
      authTokenVar(token);
      isLoggedInVar(true);
    }
  };
  const [login, { data: loginResults, loading }] = useMutation<
    login,
    loginVariables
  >(LOGIN_MUTATION, {
    onCompleted,
  });
  const onValid = () => {
    const { email, password } = getValues();
    login({
      variables: {
        input: {
          email,
          password,
        },
      },
    });
  };
  return (
    <Layout title="Login">
      <form
        className="grid gap-3 w-full max-w-xs"
        onSubmit={handleSubmit(onValid)}
      >
        <input
          className="focus:outline-none focus:border-blue-100 bg-gray-800 text-white border-b-2 border-blue-400 transition-colors px-1 py-2"
          ref={register({
            required: "Email is required",
            pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          })}
          name="email"
          type="email"
          placeholder="Email"
          required
        />
        {errors.email?.message && <FormError error={errors.email?.message} />}
        {errors.email?.type === "pattern" && (
          <FormError error="Please enter a valid email" />
        )}
        <input
          className="focus:outline-none focus:border-blue-100 bg-gray-800 text-white border-b-2 border-blue-400 transition-colors px-1 py-2"
          ref={register({
            required: "Password is required",
          })}
          name="password"
          type="password"
          placeholder="Password"
          required
        />
        {errors.password?.message && (
          <FormError error={errors.password?.message} />
        )}
        <Button isValid={formState.isValid} loading={loading} text="Log In" />
        {loginResults?.login.error && (
          <FormError error={loginResults.login.error} />
        )}
        <div className="text-white">
          New to Podcast?{" "}
          <TextLink to="create-account">Create an Account</TextLink>
        </div>
      </form>
    </Layout>
  );
};

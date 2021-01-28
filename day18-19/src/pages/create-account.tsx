import { gql, useMutation } from "@apollo/client";
import React from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { Button } from "../components/button";
import { FormError } from "../components/form-error";
import { Layout } from "../components/layout";
import { TextLink } from "../components/text-link";
import {
  createAccount,
  createAccountVariables,
} from "../__generated__/createAccount";
import { UserRole } from "../__generated__/globalTypes";

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccount($input: CreateAccountInput!) {
    createAccount(input: $input) {
      ok
      error
    }
  }
`;

interface IForm {
  email: string;
  password: string;
  role: UserRole;
}

export const CreateAccount = () => {
  const history = useHistory();
  const {
    register,
    handleSubmit,
    getValues,
    formState,
    errors,
  } = useForm<IForm>({
    mode: "onChange",
    defaultValues: {
      role: UserRole.Host,
    },
  });
  const onCompleted = (data: createAccount) => {
    const { ok } = data.createAccount;
    if (ok) {
      history.push("/");
    }
  };

  const [createAccount, { data: createAccountResult, loading }] = useMutation<
    createAccount,
    createAccountVariables
  >(CREATE_ACCOUNT_MUTATION, {
    onCompleted,
  });

  const onSubmit = () => {
    if (!loading) {
      const { email, password, role } = getValues();
      createAccount({
        variables: {
          input: {
            email,
            password,
            role,
          },
        },
      });
    }
  };

  return (
    <Layout title="Create Account">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-3 w-full max-w-xs"
      >
        <input
          ref={register({ required: "Email is required" })}
          className="focus:outline-none focus:border-blue-100 bg-gray-800 text-white border-b-2 border-blue-400 transition-colors px-1 py-2"
          name="email"
          type="email"
          placeholder="Email"
          required
        />
        {errors.email?.message && <FormError error={errors.email.message} />}
        <input
          ref={register({ required: "Password is required" })}
          className="focus:outline-none focus:border-blue-100 bg-gray-800 text-white border-b-2 border-blue-400 transition-colors px-1 py-2"
          name="password"
          type="password"
          placeholder="Password"
          required
        />
        {errors.password?.message && (
          <FormError error={errors.password.message} />
        )}
        <select
          ref={register({ required: "Role is required" })}
          className="focus:outline-none focus:border-blue-100 bg-gray-800 text-white border-b-2 border-blue-400 transition-colors px-1 py-2"
          name="role"
        >
          {Object.keys(UserRole).map((role, index) => (
            <option key={index}>{role}</option>
          ))}
        </select>
        {errors.role?.message && <FormError error={errors.role.message} />}
        <Button
          isValid={formState.isValid}
          loading={loading}
          text="Create Account"
        />
        {createAccountResult?.createAccount.error && (
          <FormError error={createAccountResult?.createAccount.error} />
        )}
        <div className="text-white">
          Already have an account? <TextLink to="/">Log in now</TextLink>
        </div>
      </form>
    </Layout>
  );
};

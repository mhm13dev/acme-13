import React, { useId } from "react";
import { FormType } from "./auth.types";

interface Props {
  formType: FormType;
  onSubmitAction: (formData: FormData) => void;
}

export const AuthForm: React.FC<Props> = ({ formType, onSubmitAction }) => {
  const authFormId = useId();

  return (
    <form className="space-y-6" action={onSubmitAction}>
      <div className="space-y-2">
        <label
          htmlFor={`email-${authFormId}`}
          className="block text-sm font-medium text-gray-00"
        >
          Email
        </label>
        <input
          type="email"
          name="email"
          id={`email-${authFormId}`}
          className="block rounded-md w-full p-2 border-none focus:outline-none focus:border-none ring-2 ring-slate-200 focus:ring-black"
          placeholder="johndoe@example.com"
          required
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor={`password-${authFormId}`}
          className="block text-sm font-medium text-gray-00"
        >
          Password
        </label>
        <input
          type="password"
          name="password"
          id={`password-${authFormId}`}
          className="block rounded-md w-full p-2 border-none focus:outline-none focus:border-none ring-2 ring-slate-200 focus:ring-black"
          placeholder="********"
          required
        />
      </div>

      <button className="bg-black text-white py-2 px-4 rounded-md font-medium block w-full focus:outline-none focus:border-none focus:ring-2 focus:ring-black">
        {formType === "login" ? "Login" : "Sign up"}
      </button>
    </form>
  );
};

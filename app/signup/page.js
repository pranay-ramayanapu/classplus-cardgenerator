import AuthCard from "@/components/AuthCard";
import AuthForm from "@/components/AuthForm";

export const metadata = {
  title: "Sign up | classplus",
};

export default function SignupPage() {
  return (
    <AuthCard
      title="Create your account"
      description="Sign up with email/password, Google, or use a guest login to try the app immediately."
      footerText="Already have an account?"
      footerHref="/login"
      footerLinkLabel="Sign in"
    >
      <AuthForm mode="signup" />
    </AuthCard>
  );
}

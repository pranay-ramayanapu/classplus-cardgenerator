import AuthCard from "@/components/AuthCard";
import AuthForm from "@/components/AuthForm";

export const metadata = {
  title: "Login | classplus",
};

export default function LoginPage() {
  return (
    <AuthCard
      title="Sign in to your account"
      description="Use Google, email/password, or a guest session to get into the app quickly."
      footerText="Need an account?"
      footerHref="/signup"
      footerLinkLabel="Create one"
    >
      <AuthForm mode="login" />
    </AuthCard>
  );
}

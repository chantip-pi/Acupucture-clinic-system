import { Form, useNavigate } from "@remix-run/react";
import * as React from "react";
import {
  Button,
  Card,
  FormField,
  Input,
  PageShell,
  SectionHeading,
} from "~/presentation/designSystem";
import { useLogin } from "~/presentation/hooks/useLogin";

function LogIn() {
  const navigate = useNavigate();
  const { login, loading, error } = useLogin();
  const [formError, setFormError] = React.useState<string | null>(null);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setFormError(null);

    const formData = new FormData(e.currentTarget);
    const username = String(formData.get("username") ?? "").trim();
    const password = String(formData.get("password") ?? "").trim();

    if (!username || !password) {
      setFormError("Username and password are required.");
      return;
    }

    const session = await login({ username, password });

    if (!session) {
      setFormError("Invalid username or password.");
      return;
    }

    navigate("/home");
  };

  return (
    <PageShell className="!items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <SectionHeading
          title="Clinic"
          description="Chinese Medical Clinic"
        />
        <Form method="post" onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Username">
            <Input id="username" name="username" autoComplete="username" required />
          </FormField>
          <FormField label="Password">
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </FormField>
          {(formError || error) && (
            <p className="text-md text-red-600">{formError ?? error}</p>
          )}
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </Form>
      </Card>
    </PageShell>
  );
}

export default LogIn;

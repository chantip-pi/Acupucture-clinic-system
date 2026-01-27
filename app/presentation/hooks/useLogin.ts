import { useState } from "react";
import { loginUseCase } from "~/infrastructure/di/container";
import { LoginDTO } from "~/application/dtos/StaffDTO";
import { Staff } from "~/domain/entities/Staff";
import { setUserSession, UserSession } from "~/presentation/session/userSession";
import { BackendErrorService } from "~/domain/services/ErrorService";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (dto: LoginDTO): Promise<UserSession | null> => {
    setLoading(true);
    setError(null);

    try {
      const staff = await loginUseCase.execute(dto);
      if (!staff) {
        setError("Invalid username or password.");
        return null;
      }

      setUserSession(staff);
      const { password, ...sessionData } = staff;
      return sessionData;
    } catch (err) {
      const errorMessage = BackendErrorService.getErrorMessage(err);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}


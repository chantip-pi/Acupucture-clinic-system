import { useState } from "react";
import { addStaffUseCase } from "~/infrastructure/di/container";
import { CreateStaffDTO } from "~/application/dtos/StaffDTO";
import { BackendErrorService } from "~/domain/services/ErrorService";
import bcrypt from "bcryptjs";

export function useAddStaff() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addStaff = async (dto: CreateStaffDTO) => {
    setLoading(true);
    setError(null);

    try {
      // Hash password before sending to the backend
      const hashedPassword = await bcrypt.hash(dto.password, 10);

      await addStaffUseCase.execute({
        ...dto,
        password: hashedPassword,
      });
      return { success: true };
    } catch (err) {
      const errorMessage = BackendErrorService.getErrorMessage(err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { addStaff, loading, error };
}


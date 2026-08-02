import * as React from "react";
import { Controller, type Control, type FieldErrors } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { FieldError } from "@/components/ui/field-error";
import { MEAL_OPTIONS } from "@/types/rsvp";
import type { RsvpFormValues } from "@/types/rsvp";

interface GuestCardProps {
  index: number;
  control: Control<RsvpFormValues>;
  errors: FieldErrors<RsvpFormValues>;
}

const ORDINALS = ["Primer", "Segundo", "Tercer", "Cuarto"];

export const GuestCard: React.FC<GuestCardProps> = ({
  index,
  control,
  errors,
}) => {
  const guestErrors = errors.guests?.[index];

  return (
    <div
      className="animate-card-in rounded-xl border border-champagne/50 bg-parchment/60 p-5"
      style={{ animationDelay: `${index * 70}ms`, opacity: 0 }}
    >
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-champagne-dark/30 font-display text-sm font-bold text-ink/80">
          {index + 1}
        </span>
        <p className="font-display text-lg font-semibold italic text-ink/85">
          {ORDINALS[index]} invitado
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor={`guests.${index}.name`} required>
            Nombre completo
          </Label>
          <Controller
            name={`guests.${index}.name`}
            control={control}
            render={({ field }) => (
              <Input
                id={`guests.${index}.name`}
                placeholder="Ej. María Fernanda Rojas"
                error={guestErrors?.name?.message}
                {...field}
              />
            )}
          />
          <FieldError message={guestErrors?.name?.message} />
        </div>

        <div>
          <Label htmlFor={`guests.${index}.meal`} required>
            Elección de almuerzo
          </Label>
          <Controller
            name={`guests.${index}.meal`}
            control={control}
            render={({ field }) => (
              <Select
                id={`guests.${index}.meal`}
                error={guestErrors?.meal?.message}
                {...field}
              >
                <option value="">Elige un plato</option>
                {MEAL_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            )}
          />
          <FieldError message={guestErrors?.meal?.message} />
        </div>
      </div>
    </div>
  );
};

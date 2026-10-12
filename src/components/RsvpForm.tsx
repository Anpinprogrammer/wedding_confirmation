import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Heart, CheckCircle2, AlertCircle } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import { GuestCard } from "@/components/GuestCard";

import {
  submitRsvpToGoogleSheets,
  GoogleSheetsNotConfiguredError,
} from "@/services/googleSheets";
import type { RsvpFormValues } from "@/types/rsvp";

const guestSchema = z.object({
  name: z.string().trim().min(2, "Escribe el nombre completo"),
  meal: z.enum(["tamal", "sancocho", "kids", ""]).refine((v) => v !== "", {
    message: "Elige un plato",
  }),
});

const schema = z.object({
  guestCount: z
    .union([z.number(), z.literal("")])
    .refine((v) => v !== "", { message: "Elige el número de personas" }),
  guests: z.array(guestSchema),
  message: z.string().trim().max(500, "Máximo 500 caracteres").optional(),
});

type Status = "idle" | "submitting" | "success" | "error";

export const RsvpForm: React.FC = () => {
  const [status, setStatus] = React.useState<Status>("idle");
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<RsvpFormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      guestCount: "",
      guests: [],
      message: "",
    },
    mode: "onBlur",
  });

  const guestCount = watch("guestCount");

  // Keep the `guests` array in sync with the selected guest count.
  React.useEffect(() => {
    const count = typeof guestCount === "number" ? guestCount : 0;
    const current = control._formValues.guests ?? [];
    const next = Array.from({ length: count }, (_, i) => ({
      name: current[i]?.name ?? "",
      meal: current[i]?.meal ?? "",
    }));
    setValue("guests", next, { shouldValidate: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guestCount]);

  const onSubmit = async (values: RsvpFormValues) => {
    setStatus("submitting");
    setErrorMsg(null);
    try {
      await submitRsvpToGoogleSheets(values);
      setStatus("success");
      reset();
    } catch (err) {
      setStatus("error");
      if (err instanceof GoogleSheetsNotConfiguredError) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg(
          "No pudimos enviar tu confirmación. Por favor intenta de nuevo."
        );
      }
    }
  };

  if (status === "success") {
    return (
      <Card className="animate-fade-in p-10 text-center sm:p-14">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-sage-light">
          <CheckCircle2 className="h-7 w-7 text-sage" strokeWidth={1.75} />
        </div>
        <h2 className="font-display text-3xl italic text-ink">
          ¡Asistencia confirmada!
        </h2>
        <p className="mx-auto mt-3 max-w-sm font-body text-base font-medium leading-relaxed text-ink/70">
          Gracias por acompañarnos en este día tan especial. Hemos recibido
          tu confirmación con mucho cariño. ✨
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-8"
          onClick={() => setStatus("idle")}
        >
          Enviar otra respuesta
        </Button>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      {/* Hero photo */}
      <div className="relative h-52 w-full overflow-hidden sm:h-64">
        <img
          src="/images/hero-couple.jpg"
          alt="Los novios abrazados frente a un árbol"
          className="h-full w-full object-cover object-[center_30%]"
        />
      </div>

      {/* Header / invitation masthead */}
      <div className="border-b border-champagne/40 bg-gradient-to-b from-champagne/15 to-transparent px-8 pb-8 pt-2 text-center sm:px-14">
        <div className="mx-auto mb-4 h-px w-14 bg-champagne-dark/50" />
        <p className="font-body text-xs font-semibold uppercase tracking-[0.25em] text-champagne-dark">
          Con todo nuestro cariño
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold italic text-ink sm:text-[2.75rem]">
          Confirmación de Asistencia
        </h1>
        <Heart
          className="mx-auto mt-4 h-4 w-4 fill-clay/70 text-clay/70"
          strokeWidth={1.5}
        />
        <p className="mx-auto mt-5 max-w-md font-body text-base font-medium leading-relaxed text-ink/70">
          ¡Nos llena de alegría compartir este momento con ustedes! Su
          presencia hará que este día sea aún más especial para nosotros.
        </p>
        <p className="mx-auto mt-3 max-w-md font-body text-sm font-medium leading-relaxed text-ink/55">
          Agradecemos confirmar antes del{" "}
          <span className="font-semibold text-ink/75">
            01 de noviembre de 2026
          </span>{" "}
          para organizar cada detalle con mucho cariño.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-9 sm:px-14">
        {/* Guest count */}
        <section>
          <Label htmlFor="guestCount" required>
            Número de personas que asistirán con esta invitación
          </Label>
          <p className="mb-3 font-body text-sm font-medium leading-relaxed text-ink/55">
            Nota: Esta invitación ha sido preparada para un número específico de personas. Por favor, selecciona el número de asistentes indicado en tu invitación y registra únicamente a quienes fueron invitados. ❤️
          </p>
          <Controller
            name="guestCount"
            control={control}
            render={({ field }) => (
              <Select
                id="guestCount"
                className="sm:max-w-[220px]"
                error={errors.guestCount?.message}
                value={field.value}
                onChange={(e) =>
                  field.onChange(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
              >
                <option value="">Elige...</option>
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "persona" : "personas"}
                  </option>
                ))}
              </Select>
            )}
          />
          <FieldError message={errors.guestCount?.message as string} />
        </section>

        {/* Dynamic guest cards */}
        {typeof guestCount === "number" && guestCount > 0 && (
          <section className="mt-8">
            <div className="mb-1 flex items-center gap-2">
              <h2 className=" text-md font-semibold ">
                Selección del almuerzo 🍽️
              </h2>
            </div>
            <p className="mb-2 font-body text-sm font-medium leading-relaxed text-ink/55">
              Escribe el nombre y el plato de preferencia de cada asistente
              confirmado.
            </p>
            <p className="mb-2 font-body text-sm font-medium leading-relaxed text-ink/55">
              Opciones disponibles:
            </p>
            <ul className="mb-5 list-disc space-y-1 pl-5 font-body text-sm font-medium leading-relaxed text-ink/55">
              <li className="font-semibold text-ink/70">🫔 Tamal valluno</li>
              <li className="font-semibold text-ink/70">🍲 Sancocho de pollo</li>
              <li className="font-semibold text-ink/70">🍟 Menú infantil (Nuggets de pollo y papas fritas)</li>
            </ul>

            <div className="space-y-4">
              {Array.from({ length: guestCount }, (_, i) => (
                <GuestCard key={i} index={i} control={control} errors={errors} />
              ))}
            </div>
          </section>
        )}

        {/* Message */}
        <section className="mt-8">
          <Label htmlFor="message">¿Nos quieres dejar un mensaje? 💫</Label>
          <Controller
            name="message"
            control={control}
            render={({ field }) => (
              <Textarea
                id="message"
                rows={4}
                placeholder="Escribe aquí tu mensaje para los novios..."
                error={errors.message?.message}
                {...field}
              />
            )}
          />
          <FieldError message={errors.message?.message} />
        </section>

        {status === "error" && errorMsg && (
          <div className="mt-6 flex items-start gap-2 rounded-lg border border-clay/30 bg-clay/5 px-4 py-3">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-clay" />
            <p className="font-body text-sm font-medium leading-relaxed text-clay">
              {errorMsg}
            </p>
          </div>
        )}

        <div className="mt-9 flex justify-center">
          <Button
            type="submit"
            size="lg"
            loading={status === "submitting"}
            className="w-full sm:w-auto sm:min-w-[220px]"
          >
            Confirmar asistencia
          </Button>
        </div>
      </form>
    </Card>
  );
};

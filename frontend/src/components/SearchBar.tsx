import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { LOCATION_HINTS } from "../data/site"
import { cn } from "../lib/cn"
import { searchSchema, type SearchValues } from "../lib/schemas"
import { EMPTY_SEARCH, PRICE_RANGES, UNIT_FILTERS, toSearchParams } from "../lib/search"
import Icon from "./ui/Icon"
import Pill from "./ui/Pill"

interface SearchBarProps {
  defaults?: SearchValues;
  variant?: "hero" | "inline";
}

export default function SearchBar({ defaults = EMPTY_SEARCH, variant = "hero" }: SearchBarProps) {
  const navigate = useNavigate();
  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm<SearchValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: defaults,
  });
  const unitType = useWatch({ control, name: "unitType" });

  const onSubmit = handleSubmit((values) => {
    navigate({ pathname: "/properties", search: toSearchParams(values).toString() });
  });

  return (
    <form onSubmit={onSubmit} noValidate role="search" aria-label="Search properties"
      className={cn("rounded-[2rem] rounded-tr-lg bg-white p-4 shadow-lift ring-1 ring-ink-900/5 sm:p-6", variant === "hero" && "mx-auto max-w-5xl")}>
      <fieldset className="flex flex-wrap gap-2">
        <legend className="sr-only">Unit type</legend>
        {UNIT_FILTERS.map((option) => (
          <Pill key={option.value} active={unitType === option.value}
            onClick={() => setValue("unitType", option.value, { shouldDirty: true })}>
            {option.label}
          </Pill>
        ))}
      </fieldset>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-[1.3fr_1fr_1fr_auto]">
        <div className="relative">
          <label htmlFor="search-query" className="sr-only">Property, building or unit</label>
          <Icon name="search" className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-deca-500" />
          <input id="search-query" placeholder="Property, building or unit (e.g. 5B)" autoComplete="off"
            className="field pl-12" aria-invalid={!!errors.query} {...register("query")} />
        </div>
        <div className="relative">
          <label htmlFor="search-location" className="sr-only">Location</label>
          <Icon name="pin" className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-deca-500" />
          <input id="search-location" list="location-hints" placeholder="Location" autoComplete="off"
            className="field pl-12" aria-invalid={!!errors.location} {...register("location")} />
          <datalist id="location-hints">
            {LOCATION_HINTS.map((hint) => <option key={hint} value={hint} />)}
          </datalist>
        </div>
        <div className="relative">
          <label htmlFor="search-price" className="sr-only">Price range</label>
          <select id="search-price" className="field appearance-none pr-10" {...register("priceRange")}>
            {PRICE_RANGES.map((range) => <option key={range.value} value={range.value}>{range.label}</option>)}
          </select>
          <Icon name="chevron-down" className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-ink-500" />
        </div>
        <button type="submit" className="btn btn-primary min-h-12 md:col-span-2 xl:col-span-1">
          <Icon name="search" className="size-5" /> Search
        </button>
      </div>

      {(errors.query || errors.location) && (
        <p role="alert" className="field-error">{errors.query?.message ?? errors.location?.message}</p>
      )}
    </form>
  );
}

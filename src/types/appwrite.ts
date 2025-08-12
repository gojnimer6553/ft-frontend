import type { Models } from "appwrite";

export enum MealsTypeMeal_type {
  "breakfest" = "breakfest",
  "brunch" = "brunch",
  "lunch" = "lunch",
  "snack" = "snack",
  "dinner" = "dinner",
  "supper" = "supper",
  "tea" = "tea",
  "midnight_snack" = "midnight_snack",
}

export interface MealsType {
  name: string;
  consumptionDate: string;
  meal_type?: MealsTypeMeal_type;
  observations?: string;
}

export interface MealsDocument extends MealsType, Models.Document {}

export interface Meal_ia_diagnosticType {
  last_diagnostic?: string;
  calories?: number;
  completed?: boolean;
  meal_id: number;
}

export interface Meal_ia_diagnosticDocument
  extends Meal_ia_diagnosticType,
    Models.Document {}

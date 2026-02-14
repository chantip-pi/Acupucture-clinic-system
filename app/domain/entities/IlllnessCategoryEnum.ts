export enum IllnessCategoryEnum {
    EXTERNAL_PATHOGEN = "External pathogen",
    INTERNAL_ORGAN_DISORDER = "Internal organ disorder",
    DEFICIENCY_SYNDROME = "Deficiency syndrome",
    EXCESS_SYNDROME = "Excess syndrome",
    CONGENITAL_CONDITION = "Congenital condition",
    TRAUMA_INJURY = "Trauma / Injury",
  }
  
  export const illnessCategoryOptions = Object.values(
    IllnessCategoryEnum
  );
export enum IllnessCategoryEnum {
  CARDIOVASCULAR = "Cardiovascular",
  NEURO_PSYCHIATRIC = "Neuro - Psychiatric",
  LOCOMOTOR = "Locomotor",
  RESPIRATORY_SYSTEM = "Respiratory system",
  DIGESTIVE_SYSTEM = "Digestive system",
  URINARY_SYSTEM = "Urinary system",
  OBSTETRICS_GYNECOLOGY = "Obstetrics and Gynecology",
  ENT = "ENT / Otolaryngology",
  ENDOCRINE_SYSTEM = "Endocrine system",
  INFECTION = "Infection",
  OTHERS = "Others"
}
  
  export const illnessCategoryOptions = Object.values(
    IllnessCategoryEnum
  );
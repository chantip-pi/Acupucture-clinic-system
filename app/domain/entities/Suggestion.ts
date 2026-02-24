export type SuggestAcupoint = {
    meridian: string;
    acupoint: string;
    illness: string;
    illness_id: number | null;
  };
  
  export type SuggestResult = {
    text: string;
    acupoints: SuggestAcupoint[];
  };
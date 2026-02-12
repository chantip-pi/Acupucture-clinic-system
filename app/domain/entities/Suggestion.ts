export type SuggestAcupoint = {
    meridian: string;
    acupoint: string;
    illness: string;
  };
  
  export type SuggestResult = {
    text: string;
    acupoints: SuggestAcupoint[];
  };
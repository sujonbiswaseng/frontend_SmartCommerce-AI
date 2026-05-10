// types/filter.types.ts

export type TFilterField =
  | {
      type: "text" | "email" | "password" | "search" | "url" | "tel";
      name: string;
      placeholder?: string;
      label?:string,
      value: string;
      onChange: (val: string) => void;
    }
  | {
      type: "number";
      name: string;
      label?: string;
      placeholder?:string,
      value: number;
      onChange: (val: number) => void;
    }
  | {
      type: "date" | "time" | "datetime-local" | "month" | "week";
      name: string;
      label?: string;
      placeholder?:string,
      value: string;
      onChange: (val: string) => void;
    }
  | {
      type: "checkbox";
      name: string;
      label?: string;
      placeholder?:string,
      value: boolean;
      onChange: (val: boolean) => void;
    }
  | {
      type: "select";
      name: string;
      label: string;
      placeholder?:string,
      value: string;
      options: { label: string; value: string }[];
      onChange: (val: string) => void;
    }
  | {
      type: "range";
      name: string;
      label: string;
      placeholder?:string,
      min: number;
      max: number;
      value: number;
      onChange: (val: number) => void;
    };
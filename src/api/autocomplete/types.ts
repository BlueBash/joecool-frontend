export interface AutocompleteOption {
  id: number | string;
  name: string;
  code?: string;
}

export interface AutocompleteParams {
  klass: string;
  search?: string;
}

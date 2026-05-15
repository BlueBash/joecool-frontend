/** Row shape after flattening JSON:API `stock_settings` records for the UI. */
export type StockSettingRow = {
  id: string;
  name: string;
  [key: string]: unknown;
};

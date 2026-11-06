export type RegisteredVehicleSpecification = { catalogSpecificationId?: string; premium?: boolean; vehicleBrand: string; vehicleModel: string; vehicleYear: number; vehicleCapacity: number };
export const normalizeVehicleOption = (value: string) => value.trim().replace(/\s+/g, ' ').toLowerCase();
const distinctText = (values: string[]) => Array.from(new Map(values.map(value => [normalizeVehicleOption(value), value])).values()).sort((a, b) => a.localeCompare(b));
export function vehicleFareSelections(rows: RegisteredVehicleSpecification[], brand: string, model: string, year: string) {
  const branded = rows.filter(row => normalizeVehicleOption(row.vehicleBrand) === normalizeVehicleOption(brand));
  const modeled = branded.filter(row => normalizeVehicleOption(row.vehicleModel) === normalizeVehicleOption(model));
  return {
    brands: distinctText(rows.map(row => row.vehicleBrand)),
    models: distinctText(branded.map(row => row.vehicleModel)),
    years: Array.from(new Set(modeled.map(row => row.vehicleYear))).sort((a, b) => b - a),
    seats: Array.from(new Set(modeled.filter(row => row.vehicleYear === Number(year)).map(row => row.vehicleCapacity))).sort((a, b) => a - b),
  };
}

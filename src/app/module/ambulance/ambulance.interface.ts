export type AmbulanceType = 'BASIC_LIFE_SUPPORT' | 'ADVANCED_LIFE_SUPPORT' | 'ICU_AMBULANCE';

export type IAmbulanceFilterRequest = {
  searchTerm?: string;
  type?: AmbulanceType;
  isAvailable?: boolean;
};
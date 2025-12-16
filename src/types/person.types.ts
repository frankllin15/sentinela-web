export interface Person {
  id: number;
  fullName: string;
  nickname?: string;
  cpf?: string;
  rg?: string;
  voterId?: string;
  addressPrimary: string;
  addressSecondary?: string;
  latitude: number;
  longitude: number;
  motherName?: string;
  fatherName?: string;
  warrantStatus?: string;
  warrantFileUrl?: string;
  notes?: string;
  isConfidential: boolean;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePersonDto {
  fullName: string;
  nickname?: string;
  cpf?: string;
  rg?: string;
  voterId?: string;
  addressPrimary: string;
  addressSecondary?: string;
  latitude: number;
  longitude: number;
  motherName?: string;
  fatherName?: string;
  warrantStatus?: string;
  warrantFileUrl?: string;
  notes?: string;
  isConfidential?: boolean;
}

export interface UpdatePersonDto {
  fullName?: string;
  nickname?: string;
  cpf?: string;
  rg?: string;
  voterId?: string;
  addressPrimary?: string;
  addressSecondary?: string;
  latitude?: number;
  longitude?: number;
  motherName?: string;
  fatherName?: string;
  warrantStatus?: string;
  warrantFileUrl?: string;
  notes?: string;
  isConfidential?: boolean;
}

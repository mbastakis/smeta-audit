export interface CAPA {
  id: number;
  capaId: string; // User-defined unique ID
  description: string;
  pillar: 'pillar-1' | 'pillar-2' | 'pillar-3' | 'pillar-4' | null;
  severity: 'critical' | 'major' | 'minor' | 'observation' | null;
  status: 'open' | 'in-progress' | 'closed';
  dateOpened: string; // ISO 8601
  dateDue: string | null; // ISO 8601
  dateClosed: string | null; // ISO 8601
  rootCause: string | null;
  correctiveAction: string | null;
  preventiveAction: string | null;
}

export interface CAPACreateRequest {
  capaId: string;
  description: string;
  pillar?: CAPA['pillar'];
  severity?: CAPA['severity'];
  status?: CAPA['status'];
  dateOpened?: string;
  dateDue?: string;
  rootCause?: string;
  correctiveAction?: string;
  preventiveAction?: string;
}

export interface CAPAUpdateRequest {
  capaId?: string;
  description?: string;
  pillar?: CAPA['pillar'];
  severity?: CAPA['severity'];
  status?: CAPA['status'];
  dateDue?: string;
  dateClosed?: string;
  rootCause?: string;
  correctiveAction?: string;
  preventiveAction?: string;
}

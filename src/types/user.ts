export interface User {
  azureId: string;
  mail: string;
  givenName?: string;
  surname?: string;
  displayName?: string;
  jobTitle?: string;
  department?: string;
  mobile?: string;
  telephoneNumber?: string;
  status?: 'enabled' | 'disabled';
  external: boolean;
  superAdmin?: boolean;
  adType: string;
  bannerAdmin?: boolean;
}

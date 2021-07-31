export interface IZRoadblockTokensService {
  verify(jwt: string): Promise<boolean>;
  create(): Promise<any>;
}

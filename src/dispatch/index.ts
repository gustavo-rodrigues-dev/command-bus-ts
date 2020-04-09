export interface DispatchCommand {
  dispatch<T>(namespace: string, propreties: any): Promise<T>;
}

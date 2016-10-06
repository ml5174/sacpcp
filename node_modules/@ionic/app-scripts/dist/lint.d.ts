import { BuildContext } from './util';
export declare function lint(context?: BuildContext, tsConfigPath?: string): Promise<{}>;
export interface TsConfig {
    executable: string;
}

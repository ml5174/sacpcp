import { BuildContext } from './util';
export declare function transpile(context?: BuildContext): Promise<boolean>;
export declare function transpileUpdate(event: string, path: string, context: BuildContext): Promise<boolean>;
export declare function transpileApp(context: BuildContext, transpileConfig?: TranspileConfig): Promise<{}>;
export declare function transpile6To5(context: BuildContext, srcFile: string, destFile: string): Promise<{}>;
export interface TranspileConfig {
    source: string;
    destFileName: string;
}

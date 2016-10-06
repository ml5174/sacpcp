import { BuildContext } from './util';
export declare function cleancss(context?: BuildContext, cleanCssConfig?: CleanCssConfig): Promise<boolean>;
export interface CleanCssConfig {
    sourceFileName: string;
    destFileName: string;
}

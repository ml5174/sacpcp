import { BuildContext, BuildOptions } from './util';
export declare function templateUpdate(event: string, path: string, context: BuildContext, options: BuildOptions): Promise<boolean>;
export declare function inlineTemplate(options: NgTemplateOptions, source: string, sourcePath: string): string;
export interface NgTemplateOptions {
    include?: string[];
    exclude?: string[];
    directoryMaps?: {
        [key: string]: string;
    };
    componentDir?: string;
}

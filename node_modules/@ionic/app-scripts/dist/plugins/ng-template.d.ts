import { NgTemplateOptions } from '../template';
export declare function ngTemplate(options?: NgTemplateOptions): {
    name: string;
    transform(source: string, sourcePath: string): string;
};

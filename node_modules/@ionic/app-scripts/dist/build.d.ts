import { BuildContext, BuildOptions } from './util';
export declare function build(context: BuildContext, options: BuildOptions): Promise<boolean>;
export declare function buildUpdate(event: string, path: string, context: BuildContext, options: BuildOptions): Promise<never>;

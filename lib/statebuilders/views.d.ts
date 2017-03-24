/** @module ng2 */ /** */
import { StateObject } from "ui-router-core";
import { PathNode } from "ui-router-core";
import { ViewConfig } from "ui-router-core";
import { Ng2ViewDeclaration } from "../interface";
/**
 * This is a [[StateBuilder.builder]] function for Angular `views`.
 *
 * When the [[StateBuilder]] builds a [[State]] object from a raw [[StateDeclaration]], this builder
 * handles the `views` property with logic specific to ui-router-ng2.
 *
 * If no `views: {}` property exists on the [[StateDeclaration]], then it creates the `views` object and
 * applies the state-level configuration to a view named `$default`.
 */
export declare function ng2ViewsBuilder(state: StateObject): {
    [key: string]: Ng2ViewDeclaration;
};
export declare class Ng2ViewConfig implements ViewConfig {
    path: PathNode[];
    viewDecl: Ng2ViewDeclaration;
    $id: number;
    loaded: boolean;
    constructor(path: PathNode[], viewDecl: Ng2ViewDeclaration);
    load(): Promise<this>;
}

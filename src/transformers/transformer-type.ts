import type { Project } from "ts-morph";
import type { Options } from "../cli/get-opts.js";

export type FileTransformer = {
  deps: (opts: Options) => boolean;
  transformer: (args: { project: Project; opts: Options }) => void;
};

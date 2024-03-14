import fsExtra from "fs-extra";

type UpdateFileOpts = {
  path: string;
  prepend?: string;
  append?: string;
};

export const updateFile = (opts: UpdateFileOpts) => {
  const file = fsExtra.readFileSync(opts.path);

  let newFile = opts.prepend
    ? `
${opts.prepend}
`.trimStart()
    : "";

  newFile += `
${file}
`.trimStart();

  if (opts.append) {
    newFile += `
${opts.append}
`.trim();
  }

  fsExtra.writeFileSync(opts.path, newFile);
};

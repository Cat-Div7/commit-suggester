async function loadFlags(argv: string[]) {
  jest.resetModules();
  process.argv = argv;
  return await import("../src/cli/flags.js");
}

describe("flags parsing", () => {
  it("should return all flags as false when no flags are provided", async () => {
    // Importing the flags
    console.log(await loadFlags(['node', 'sgt']))
    const { flags } = await loadFlags(["node", "sgt"]);
    expect(flags).toEqual({
      changeModel: false,
      changeKey: false,
      changeProvider: false,
      addKey: false,
      reset: false,
      config: false,
      autoCommit: false,
      toggleWelcome: false,
    });
  });
  
  it("should return --auto-commit flag as true", async () => {
    // Importing the flags
    console.log(await loadFlags(['node', 'sgt', '--auto-commit']))
    const { flags } = await loadFlags(["node", "sgt", "--auto-commit"]);
    expect(flags.autoCommit).toBe(true);
    expect(flags.changeProvider).toBe(false);
  });
});

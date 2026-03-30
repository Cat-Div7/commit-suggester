describe("flags parsing", () => {
  // add beforeeach here to clear the cache

  it("should return all flags as false when no flags are provided", async () => {
    // Clear cache
    jest.resetModules();
    // mock data for process.argv
    process.argv = ["node", "sgt"];
    // Importing the flags
    const { flags } = await import("../src/cli/flags.js");
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
});

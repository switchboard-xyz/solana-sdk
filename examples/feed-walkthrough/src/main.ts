async function main() {
  console.log(`Creating a private feed`);
}

main().then(
  () => process.exit(),
  (error) => {
    console.error("Failed to create a private feed");
    console.error(error);
    process.exit(-1);
  }
);

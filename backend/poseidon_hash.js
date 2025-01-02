const circomlibjs = require("circomlibjs");

(async () => {
    const args = process.argv.slice(2);
    if (args.length !== 2) {
        console.error("Usage: node poseidon_hash.js <cccd> <otp>");
        process.exit(1);
    }

    const cccd = BigInt(args[0]);
    const otp = BigInt(args[1]);

   
    const poseidon = await circomlibjs.buildPoseidon();

 
    const hash = poseidon.F.toString(poseidon([cccd, otp]));

    // Print the result
    console.log(hash);
})();

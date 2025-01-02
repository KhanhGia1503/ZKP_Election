pragma circom 2.1.6;

include "node_modules/circomlib/circuits/poseidon.circom";

template Main() {
    signal input cccd; 
    signal input otp; 
    signal output calculated_hash; 

    component poseidon = Poseidon(2);

    poseidon.inputs[0] <== cccd;
    poseidon.inputs[1] <== otp;

    calculated_hash <== poseidon.out;
}

component main = Main();

pragma circom 2.1.6;

include "circomlib/circuits/poseidon.circom";

template Voting() {
    signal input cccd; 
    signal input otp; 
    signal input cccdHash; 
    signal input candidateId;

    signal output isValid;
    signal output encryptedVote;

    component hash = Poseidon(2);
    hash.inputs[0] <== cccd;
    hash.inputs[1] <== otp;

    signal validCheck;
    validCheck <-- (hash.out == cccdHash) ? 1 : 0;
    isValid <== validCheck;

    component voteHash = Poseidon(2);
    voteHash.inputs[0] <== candidateId;
    voteHash.inputs[1] <== 123;

    encryptedVote <== voteHash.out;
}

component main = Voting();

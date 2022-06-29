| Name                  | Value | Description                                                                     |
| --------------------- | ----- | ------------------------------------------------------------------------------- |
| StatusNone            | 0     | VRF Account has not requested randomness yet.                                   |
| StatusRequesting      | 1     | VRF Account has requested randomness but has yet to receive an oracle response. |
| StatusVerifying       | 2     | VRF Account has received a VRF proof that has yet to be verified on-chain.      |
| StatusVerified        | 3     | VRF Account has successfully requested and verified randomness on-chain.        |
| StatusCallbackSuccess | 4     | VRF Account's callback was invoked successfully.                                |
| StatusVerifyFailure   | 5     | Failed to verify VRF proof.                                                     |

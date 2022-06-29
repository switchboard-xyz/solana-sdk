A struct representing a floating point number on-chain.

| Field    | Type | Description                                                                                                                                                                                             |
| -------- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| mantissa | i128 | The part of a floating-point number that represents the significant digits of that number, and that is multiplied by the base, 10, raised to the power of scale to give the actual value of the number. |
| scale    | u32  | The number of decimal places to move to the left to yield the actual value.                                                                                                                             |

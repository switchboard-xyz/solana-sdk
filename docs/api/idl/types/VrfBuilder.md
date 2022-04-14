

| Field | Type | Description |
|--|--|--|
| producer |  publicKey |  |
| status |  [VrfStatus](/api/idl/types/VrfStatus) |  |
| reprProof |  u8[80] |  |
| proof |  [EcvrfProofZC](/api/idl/types/EcvrfProofZC) |  |
| yPoint |  publicKey |  |
| stage |  u32 |  |
| stage1Out |  [EcvrfIntermediate](/api/idl/types/EcvrfIntermediate) |  |
| r1 |  [EdwardsPointZC](/api/idl/types/EdwardsPointZC) |  |
| r2 |  [EdwardsPointZC](/api/idl/types/EdwardsPointZC) |  |
| stage3Out |  [EcvrfIntermediate](/api/idl/types/EcvrfIntermediate) |  |
| hPoint |  [EdwardsPointZC](/api/idl/types/EdwardsPointZC) |  |
| sReduced |  [Scalar](/api/idl/types/Scalar) |  |
| yPointBuilder |  [FieldElementZC](/api/idl/types/FieldElementZC)[3] |  |
| yRistrettoPoint |  [EdwardsPointZC](/api/idl/types/EdwardsPointZC) |  |
| mulRound |  u8 |  |
| hashPointsRound |  u8 |  |
| mulTmp1 |  [CompletedPointZC](/api/idl/types/CompletedPointZC) |  |
| uPoint1 |  [EdwardsPointZC](/api/idl/types/EdwardsPointZC) |  |
| uPoint2 |  [EdwardsPointZC](/api/idl/types/EdwardsPointZC) |  |
| vPoint1 |  [EdwardsPointZC](/api/idl/types/EdwardsPointZC) |  |
| vPoint2 |  [EdwardsPointZC](/api/idl/types/EdwardsPointZC) |  |
| uPoint |  [EdwardsPointZC](/api/idl/types/EdwardsPointZC) |  |
| vPoint |  [EdwardsPointZC](/api/idl/types/EdwardsPointZC) |  |
| u1 |  [FieldElementZC](/api/idl/types/FieldElementZC) |  |
| u2 |  [FieldElementZC](/api/idl/types/FieldElementZC) |  |
| invertee |  [FieldElementZC](/api/idl/types/FieldElementZC) |  |
| y |  [FieldElementZC](/api/idl/types/FieldElementZC) |  |
| z |  [FieldElementZC](/api/idl/types/FieldElementZC) |  |
| p1Bytes |  u8[32] |  |
| p2Bytes |  u8[32] |  |
| p3Bytes |  u8[32] |  |
| p4Bytes |  u8[32] |  |
| cPrimeHashbuf |  u8[16] |  |
| m1 |  [FieldElementZC](/api/idl/types/FieldElementZC) |  |
| m2 |  [FieldElementZC](/api/idl/types/FieldElementZC) |  |
| txRemaining |  u32 |  |
| verified |  bool |  |
| result |  u8[32] |  |

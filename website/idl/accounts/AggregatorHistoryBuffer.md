import AggregatorHistoryBuffer from "../\_AggregatorHistoryBuffer.md"
import AggregatorHistoryRow from "../types/AggregatorHistoryRow.md"

Serialized buffer account storing a given number of accepted on-chain results for a single aggregator

<b>Size: </b>12 Bytes + (28 Bytes &#215; Num Samples)
<br />
<b>Rent Exemption: </b> Dependent on number of samples to store.
<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
10,000 samples:&nbsp;&nbsp; 1.949774400 SOL
<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
200,000 samples: 38.976974400 SOL
<br /><br />

<AggregatorHistoryBuffer />

**AggregatorHistoryRow**

<AggregatorHistoryRow />

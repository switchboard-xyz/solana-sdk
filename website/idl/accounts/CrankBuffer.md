import CrankBuffer from "../\_CrankBuffer.md"
import CrankRow from "../types/CrankRow.md"

Serialized buffer account storing the list of aggregators and their next update timestamp.

<b>Size: </b>8 Bytes + (48 Bytes &#215; Num Aggregators)
<br />
<b>Rent Exemption: </b> Dependent on number of aggregators.
<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
1,000 aggregators: 0.335026560 SOL

<br /><br />

<CrankBuffer />

**CrankRow**

<CrankRow />

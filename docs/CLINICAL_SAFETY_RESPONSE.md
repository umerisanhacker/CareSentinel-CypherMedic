# CareSentinel Clinical Safety Response Model

CareSentinel is a synthetic healthcare cybersecurity environment. Its defining design principle is that cyber response must account for patient safety.

## Response model

1. Detect the security signal.
2. Identify the affected clinical asset and patient dependency.
3. Consider cyber risk, clinical impact, and response risk.
4. Notify the assigned clinical and biomedical owners when a clinically connected device is involved.
5. Prefer upstream/network containment when direct device isolation could interrupt care.
6. Preserve device operation while the SOC investigates the attacker.
7. Record the decision and outcome in the audit ledger.

## Safety envelope

Synthetic clinical devices can declare whether patient monitoring is required, direct isolation is allowed, upstream containment is allowed, and whether clinical or biomedical approval is required.

## Boundary

The simulator does not control real medical devices, patients, hospital networks, or clinical workflows. Device telemetry and security events are synthetic and exist only inside the demonstration environment.

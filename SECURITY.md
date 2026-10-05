# Security Policy — CareSentinel

## Scope

CareSentinel is a healthcare cybersecurity prototype for authorized demonstration and testing.

## Safe-use boundary

- The repository uses synthetic clinical, patient, device, and security telemetry.
- Do not add real patient records, credentials, API keys, production network details, or other confidential information.
- Do not use the simulator or any project component against systems or medical devices without explicit authorization.
- The prototype is not connected to real clinical equipment and must not be represented as a production medical-device control system.
- Disruptive containment of clinically connected critical devices requires explicit human/SOC review in the prototype workflow.

## Reporting a security issue

For a suspected vulnerability in this repository, report it privately to the project maintainers rather than publishing exploit details in a public issue.

Include:
- affected file/component;
- reproducible steps;
- security impact;
- suggested mitigation, if known.

Do not include secrets or real patient/confidential data in a report.

## Secrets

Never commit:
- API keys;
- passwords;
- access tokens;
- private keys;
- production connection strings;
- real patient identifiers.

If a secret is accidentally committed, treat it as compromised, revoke/rotate it, remove it from the repository, and review Git history as appropriate.

## Responsible testing

Only test CareSentinel in environments and against assets for which you have explicit authorization.

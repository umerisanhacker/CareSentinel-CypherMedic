# CareSentinel — Clinical Security Intelligence

> A deterministic healthcare cybersecurity operations platform for detecting, investigating, and safely responding to threats across clinical systems and connected medical devices.

## Project Name

**CareSentinel — Clinical Security Intelligence**

Repository: `umerisanhacker/CareSentinel-CypherMedic`

## Team Name

**[TEAM NAME — UPDATE BEFORE SUBMISSION]**

> The repository does not currently contain a verified team name, so this field is intentionally marked rather than guessed.

## Selected Track

**[SELECTED TRACK — UPDATE BEFORE SUBMISSION]**

> The selected competition track is not present in the repository source currently available, so it is intentionally marked rather than guessed.

## Challenge Number & Title

**[CHALLENGE NUMBER & TITLE — UPDATE BEFORE SUBMISSION]**

> The official challenge number/title is not stored in the repository source currently available, so it is intentionally marked rather than guessed.

## Problem Statement

Modern hospitals depend on interconnected digital infrastructure and connected medical devices. This expands the cybersecurity attack surface beyond conventional endpoints and servers to systems that can have direct clinical consequences.

A security event affecting an ICU monitor, infusion pump, ventilator, dialysis machine, imaging workstation, or other biomedical system cannot be evaluated only as a conventional network-security alert. The security team also needs to understand:

- Which clinical device is affected.
- Whether a patient is currently connected.
- Whether the device is clinically critical.
- Whether the observed network behavior deviates from its normal baseline.
- What clinical impact containment could create.
- Whether Biomedical Engineering needs to be involved.
- What actions were taken and why.

CareSentinel addresses this gap by bringing cybersecurity telemetry and clinical context into a unified Security Operations Center (SOC) workflow.

## Proposed Solution

CareSentinel provides a healthcare-focused SOC interface that combines security events, incident investigation, network context, clinical-device telemetry, deterministic behavioral rules, risk scoring, clinical-impact assessment, response actions, and auditability.

The medical-device workflow is designed around a safety-first principle:

**Detect → Understand → Assess Clinical Impact → Decide → Respond → Audit**

The platform uses a **100% deterministic, rule-based decision pipeline** for the prototype. It does not depend on Gemini, LLMs, machine learning, or an external AI service.

Synthetic medical-device telemetry is used to safely demonstrate the workflow without connecting to real clinical equipment or patient systems.

## Key Features

### 1. Medical Device Security Monitoring

CareSentinel models a synthetic clinical-device environment containing:

- ICU patient monitors
- ICU cardiac monitors
- Infusion pumps
- Ventilators
- Dialysis machines
- PACS imaging workstations

Each device can expose clinical, operational, network, lifecycle, and cybersecurity context.

### 2. Deterministic Behavioral Baseline

The device security engine compares observed behavior against defined baselines.

Examples:

- Traffic at or above 3× baseline → traffic anomaly.
- Connections at or above 4× baseline → connection spike.
- Unknown destinations → unknown-destination finding.
- Unexpected network zone → network-zone deviation.
- Critical patient-connected device → clinical safety flag.

### 3. Security Risk Score

The rule engine combines deterministic findings into a normalized security risk score.

Signals include:

- Traffic anomaly
- Unknown destinations
- Connection spikes
- Network-zone deviation
- Clinical criticality
- Device state
- Security event severity

The score is capped at 100 and classified into LOW, MEDIUM, HIGH, or CRITICAL risk.

### 4. Clinical Impact Assessment

Security risk and clinical impact are deliberately separated.

Clinical impact considers:

- Device criticality
- Patient connection state
- Clinical operating state
- Whether explicit clinical/SOC approval is required

This prevents a high-security-risk event from automatically becoming a high-impact disruptive response.

### 5. Device Health vs Cybersecurity State

CareSentinel keeps operational/clinical device health separate from cybersecurity state.

The SOC can therefore distinguish between:

- Normal clinical operation
- Clinical warning/critical state
- Cybersecurity anomaly
- Containment/isolation state

### 6. Device Investigation Timeline

Analysts can review device-related events as an investigation timeline, including security signals and response activity.

### 7. Clinical Network Topology

The Network view maps synthetic clinical devices into their network zones and highlights devices associated with security anomalies.

### 8. Attack-Path Visualization

The platform provides a device/network investigation path so the analyst can reason about:

**Source → Network Zone → Clinical Device → Security Event → Clinical Impact → Response**

### 9. Incident Correlation

Multiple security signals associated with the same medical device can be correlated into an investigation incident.

Correlated incidents retain affected device IDs and clinical-impact context.

### 10. Device Lifecycle and Maintenance

Device records include lifecycle and maintenance context such as:

- Active / maintenance / decommissioned / retired state
- Firmware version
- Last maintenance date
- Maintenance window
- Clinical operational status

### 11. Biomedical Engineering Escalation

When a device requires specialist clinical/biomedical review, the investigation workflow can escalate to Biomedical Engineering instead of treating the event as a generic IT incident.

### 12. Safe Containment Workflow

Clinically connected critical devices require explicit SOC approval before disruptive containment.

The prototype supports:

- Approve Containment
- Dismiss / Resolve
- Escalation / Investigation
- Audit recording

### 13. Attack Simulator

The built-in simulator can generate synthetic abnormal medical-device network traffic.

Example scenario:

**Synthetic Threat Simulator → ICU Patient Monitor → Abnormal Network Traffic → Deterministic Detection → Risk/Clinical Impact Assessment → SOC Decision**

### 14. Auditability

Security decisions and response actions are designed to remain traceable through the existing incident/audit workflow.

## Technology Stack

### Frontend

- React 19
- TypeScript
- Vite
- HTML5
- CSS
- Lucide React icons
- Recharts
- OGL

### Application Architecture

- React component-based UI
- Central application state and reducer architecture
- Deterministic device-security engine
- Deterministic risk and clinical-impact calculations
- Existing incident/event workflow
- Synthetic telemetry and attack simulation

### Security Decision Model

No external AI/LLM service is required for the CareSentinel decision engine.

The core medical-device assessment follows:

`Telemetry + Baseline + Network Context + Device Criticality + Patient State + Security Events → Rules → Risk → Clinical Impact → Incident → Response → Audit`

## System Architecture

```text
                         CARESENTINEL SOC
                                │
             ┌──────────────────┼──────────────────┐
             │                  │                  │
        SECURITY DATA      NETWORK DATA       CLINICAL DATA
             │                  │                  │
             └──────────────────┼──────────────────┘
                                │
                                ▼
                   MEDICAL DEVICE TELEMETRY
                                │
          ┌─────────────────────┼─────────────────────┐
          │                     │                     │
         ICU                LIFE-SUPPORT          IMAGING
       MONITORS               DEVICES              / PACS
          │                     │                     │
          └─────────────────────┼─────────────────────┘
                                │
                                ▼
                    DETERMINISTIC RULE ENGINE
                                │
                    ┌───────────┴───────────┐
                    ▼                       ▼
              SECURITY RISK          CLINICAL IMPACT
                    │                       │
                    └───────────┬───────────┘
                                ▼
                       INCIDENT CORRELATION
                                │
                                ▼
                         SOC INVESTIGATION
                                │
              ┌─────────────────┼─────────────────┐
              ▼                 ▼                 ▼
          CONTAIN            DISMISS          ESCALATE
              │                                   │
              │                          Biomedical Engineering
              └─────────────────┬─────────────────┘
                                ▼
                         AUDIT / INCIDENT STATE
```

### Safety Boundary

The prototype uses synthetic devices and telemetry. It is not connected to real medical equipment, live patient telemetry, or production hospital infrastructure.

Clinically connected critical devices are not automatically disrupted by the prototype's detection logic. The response workflow requires explicit SOC review before disruptive containment.

## Setup / Installation Steps

### Prerequisites

- Node.js
- npm
- Git

### Install

Clone the repository:

```bash
git clone https://github.com/umerisanhacker/CareSentinel-CypherMedic.git
cd CareSentinel-CypherMedic
```

Install dependencies:

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

The Vite development server is configured to run on port 3000.

### Production Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

## Usage Instructions

1. Start the application.
2. Open the CareSentinel SOC dashboard.
3. Navigate to **Devices** to inspect the synthetic medical-device inventory.
4. Review clinical telemetry and cybersecurity telemetry separately.
5. Inspect device risk and clinical-impact scores.
6. Review deterministic findings and the investigation timeline.
7. Open the Network view to inspect the clinical network context.
8. Use the Attack Simulator to generate a synthetic medical-device network anomaly.
9. Return to Devices/Incidents and investigate the resulting alert.
10. Review the affected device, network path, clinical state, and risk.
11. Choose an explicit response such as containment, dismissal, or escalation.
12. Review the resulting incident/audit state.

## Demo Instructions

### Recommended Judge Demonstration

**Step 1 — Start in the SOC**

Show the CareSentinel dashboard and explain that the application provides a unified healthcare cybersecurity view.

**Step 2 — Open Devices**

Show the synthetic clinical-device inventory.

Point out:

- Device type
- Clinical criticality
- Patient connection
- Network zone
- Current traffic
- Baseline traffic
- Clinical state
- Cybersecurity state

**Step 3 — Trigger the Attack Simulator**

Use:

**SIMULATE MEDICAL DEVICE TRAFFIC**

This generates abnormal synthetic network activity against the ICU Patient Monitor.

**Step 4 — Show Deterministic Detection**

Explain that the event is evaluated using predefined rules rather than an AI model.

The scenario can trigger:

- Traffic anomaly
- Connection spike
- Unknown destinations
- Clinical safety flag

**Step 5 — Investigate**

Show:

- Security risk score
- Clinical impact score
- Device timeline
- Network path/topology
- Device operational state
- Maintenance/lifecycle context
- Correlated incident information

**Step 6 — Make the SOC Decision**

Demonstrate that a clinically connected critical device is not blindly isolated.

The analyst can:

- Approve containment
- Dismiss/resolve
- Escalate to Biomedical Engineering

**Step 7 — Show Auditability**

Finish by showing the resulting incident/security state and audit trail.

### Core Demo Story

```text
ATTACK SIMULATOR
       ↓
ABNORMAL ICU DEVICE TRAFFIC
       ↓
DETERMINISTIC RULE ENGINE
       ↓
SECURITY RISK + CLINICAL IMPACT
       ↓
SOC INVESTIGATION
       ↓
EXPLICIT RESPONSE DECISION
       ↓
AUDITABLE OUTCOME
```

## Testing / Evaluation Results

The implemented synthetic medical-device workflow has been exercised through the application's attack-simulation path.

### Evaluated Capabilities

| Capability | Result |
|---|---|
| Synthetic clinical-device inventory | Implemented |
| Medical-device network anomaly simulation | Implemented |
| Deterministic rule evaluation | Implemented |
| Security risk scoring | Implemented |
| Clinical impact scoring | Implemented |
| Device investigation timeline | Implemented |
| Clinical network mapping | Implemented |
| Device lifecycle/maintenance context | Implemented |
| Incident correlation | Implemented |
| Biomedical Engineering escalation path | Implemented |
| Explicit containment decision | Implemented |
| Device health vs cyber state | Implemented |
| Historical/device activity context | Implemented |
| AI/LLM dependency | None |

### Important Verification Note

The repository's latest deployment status has previously reported a Vercel failure, but the exact Vercel build-log error was not available in the repository-connected environment. Therefore this README does **not** claim a successful Vercel production build.

For final competition submission, run:

```bash
npm run build
npm run lint
```

and record the final results here.

## Limitations

1. **Synthetic environment** — Medical devices and telemetry are simulated and are not connected to real hospital equipment.
2. **Prototype baselines** — Behavioral baselines are deterministic thresholds intended for demonstration and would require extensive clinical/biomedical validation for production deployment.
3. **No live clinical integration** — The prototype does not connect to real EHR, PACS, medical-device management, bedside-monitoring, or hospital network infrastructure.
4. **No automatic disruptive containment of critical clinical devices** — Clinically connected devices require explicit SOC review before disruptive response.
5. **Rule-based detection** — The prototype intentionally uses deterministic rules and does not provide ML/UEBA-style adaptive detection.
6. **Competition prototype** — Production deployment would require authentication hardening, secure telemetry ingestion, device identity management, clinical governance, regulatory validation, fail-safe controls, and extensive testing.
7. **No clinical decision-making** — CareSentinel is a cybersecurity/SOC platform and is not intended to diagnose, treat, or make autonomous medical decisions.

## Team Members

- **[TEAM MEMBER 1 — UPDATE]**
- **[TEAM MEMBER 2 — UPDATE]**
- **[TEAM MEMBER 3 — UPDATE, IF APPLICABLE]**
- **[TEAM MEMBER 4 — UPDATE, IF APPLICABLE]**

> Team membership is intentionally not guessed because the repository does not currently contain a verified team roster.

## Competition Submission Checklist

Before submitting the project, replace the remaining placeholders:

- [ ] Team Name
- [ ] Selected Track
- [ ] Challenge Number & Title
- [ ] Team Members
- [ ] Final `npm run build` result
- [ ] Final `npm run lint` result

## License

This project is released under the MIT License. See [LICENSE](./LICENSE).

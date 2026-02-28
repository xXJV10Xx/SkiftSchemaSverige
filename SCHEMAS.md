# Skiftscheman – översikt och åtkomst

Detta dokument beskriver var skiftscheman finns och hur man lägger till fler företag.

---

## Struktur

```
lib/
├── schemas/
│   ├── index.ts              # Schema-register (getSchema, SCHEMAS, DEFAULT_SCHEMA_ID)
│   └── ssab-oxelosund-5lag.ts # SSAB Oxelösund 5-lag v3.0 (kalibrerad)
└── shifts.ts                 # App-API: getShift, getShiftFull, generateMonthShifts, röd/grön
```

- **Aktivt schema** används via `lib/shifts.ts` (default: SSAB Oxelösund 5-lag).
- **Röd/grön-dagar** (helger, storhelger) hanteras i `lib/shifts.ts` och gäller alla scheman.

---

## Aktuellt schema: SSAB Oxelösund 5-lag v3.0

| Egenskap    | Värde |
|------------|--------|
| **ID**     | `ssab-oxelosund-5lag` |
| **Version**| `v3.0-mar11-seq-verified` |
| **Startdatum** | 1999-01-20 |
| **Offset** | +21 (kalibrerad mot mars 11-seq m.m.) |
| **Cykel**  | 35 dagar per lag |
| **Skift**  | F (förmiddag), E (eftermiddag), N (natt), `null` = ledig |

**Användning i kod:**

```ts
import { getSchema } from "@lib/schemas";

const schema = getSchema(); // eller getSchema("ssab-oxelosund-5lag")
schema.getShift(1, "2026-03-11");  // "F"
schema.getAllShifts("2026-03-17"); // { 1: "N", 2: "N", 3: null, 4: null, 5: "E" }
schema.generateMonth(2026, 3);    // array med { date, shifts }
```

För kalender-UI (med röd/grön): använd `lib/shifts.ts` → `generateMonthShifts`, `getShiftFull`.

---

## Lägga till ett nytt företag/schema

1. **Skapa ny fil** i `lib/schemas/`, t.ex. `lib/schemas/lkab-2lag.ts`.
2. **Exportera** minst: `SCHEMA_ID`, `SCHEMA_VERSION`, `SCHEMA_LABEL`, `getShift`, `getAllShifts`, `generateMonth` (samma signaturer som SSAB-filen).
3. **Registrera** i `lib/schemas/index.ts`:
   - Lägg till `import * as nyttSchema from "./lkab-2lag";`
   - Lägg till i `SCHEMAS`: `"lkab-2lag": { id: ..., version: ..., label: ..., ...nyttSchema }`.
4. **Valfritt:** Ändra `DEFAULT_SCHEMA_ID` eller låt appen välja schema via inställningar/URL.

---

## GitHub / Lovable

- **Nuvarande origin:** `https://github.com/xXJV10Xx/SkiftSchemaSverige.git`
- **Alternativ repo (Lovable):** `https://github.com/xXJV10Xx/skiftschemasverige-27fab223.git`

För att Lovable ska använda samma kod kan du antingen:
- **A)** Sätta `origin` till `skiftschemasverige-27fab223` och pusha dit, eller  
- **B)** Behålla nuvarande repo och i Lovable koppla till `SkiftSchemaSverige` (samma användare).

Se avsnittet "Deployment" i README för build och push-kommandon.

---

*Senast uppdaterad: 2026-02-28*
